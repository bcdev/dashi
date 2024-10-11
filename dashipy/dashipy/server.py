import asyncio
import importlib
import json
import traceback
from typing import Any

import tornado
import tornado.web
import tornado.log
import yaml

from dashipy import __version__
from dashipy.context import Context
from dashipy.contribs import Panel
from dashipy.lib import Extension, Contribution
from dashipy.utils import NumpyJSONEncoder

DASHI_CONTEXT_KEY = "dashi.context"
DASHI_EXTENSIONS_KEY = "dashi.extensions"
DASHI_CONTRIBUTION_POINTS_KEY = "dashi.contribution_points"

# This would be done by a xcube server extension
Extension.add_contrib_point("panels", Panel)


class DashiHandler(tornado.web.RequestHandler):
    @property
    def extensions(self) -> list[Extension]:
        return self.settings[DASHI_EXTENSIONS_KEY]

    @property
    def contribution_points(self) -> dict[str, list[Contribution]]:
        return self.settings[DASHI_CONTRIBUTION_POINTS_KEY]

    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Methods", "GET,PUT,DELETE,OPTIONS")
        self.set_header(
            "Access-Control-Allow-Headers",
            "x-requested-with,access-control-allow-origin,"
            "authorization,content-type",
        )

    def write_error(self, status_code: int, **kwargs: Any) -> None:
        error = {"status": status_code, "message": self._reason}
        if "exc_info" in kwargs:
            error["traceback"] = traceback.format_exception(*kwargs["exc_info"])
        self.set_header("Content-Type", "text/json")
        self.write({"error": error})
        self.finish()


class RootHandler(DashiHandler):
    # GET /
    def get(self):
        self.set_header("Content-Type", "text/plain")
        self.write(f"dashi-server {__version__}")


class ContributionsHandler(DashiHandler):

    # GET /dashi/contributions
    def get(self):
        extensions = self.extensions
        contribution_points = self.contribution_points
        self.set_header("Content-Type", "text/json")
        self.write(
            {
                "result": {
                    "extensions": [e.to_dict() for e in extensions],
                    "contributions": {
                        cpk: [c.to_dict() for c in cpv]
                        for cpk, cpv in contribution_points.items()
                    }
                }
            }
        )


class LayoutHandler(DashiHandler):
    # GET /dashi/layout/{contrib_point_name}/{contrib_index}
    def get(self, contrib_point_name: str, contrib_index: str):
        self.render_layout(contrib_point_name, int(contrib_index), [])

    # POST /dashi/layout/{contrib_point_name}/{contrib_index}
    def post(self, contrib_point_name: str, contrib_index: str):
        data = tornado.escape.json_decode(self.request.body)
        input_values = data.get("inputValues") or []
        self.render_layout(contrib_point_name, int(contrib_index), input_values)

    def render_layout(
        self, contrib_point_name: str, contrib_index: int, input_values: list
    ):
        try:
            contributions = self.contribution_points[contrib_point_name]
        except KeyError:
            self.set_status(404, f"contribution point {contrib_point_name!r} not found")
            return

        contrib_ref = f"{contrib_point_name}[{contrib_index}]"

        try:
            contribution = contributions[contrib_index]
        except IndexError:
            self.set_status(404, f"contribution {contrib_ref!r} not found")
            return

        callback = contribution.layout_callback
        if callback is None:
            self.set_status(400, f"contribution {contrib_ref!r} has no layout")
            return

        context: Context = self.settings[DASHI_CONTEXT_KEY]

        try:
            component = callback.invoke(context, input_values)
        except BaseException as e:
            self.set_status(400, f"contribution {contrib_ref!r}: {e}")
            return

        self.set_header("Content-Type", "text/json")
        self.write(json.dumps({"result":  component.to_dict()}, cls=NumpyJSONEncoder))


class CallbackHandler(DashiHandler):

    # POST /dashi/callback
    def post(self):
        data = tornado.escape.json_decode(self.request.body)
        # TODO: validate data
        callback_requests: list[dict] = data.get("callbackRequests") or []

        context: Context = self.settings[DASHI_CONTEXT_KEY]

        # TODO: assert correctness, set status code on error
        state_change_requests: list[dict] = []
        for callback_request in callback_requests:
            contrib_point_name: str = callback_request["contribPoint"]
            contrib_index: int = callback_request["contribIndex"]
            callback_index: int = callback_request["callbackIndex"]
            input_values: list = callback_request["inputValues"]

            contribution_points = self.contribution_points
            contributions = contribution_points[contrib_point_name]
            contribution = contributions[contrib_index]
            callback = contribution.callbacks[callback_index]
            output_values = callback.invoke(context, input_values)

            if len(callback.outputs) == 1:
                output_values = (output_values,)

            state_changes: list[dict] = []
            for output_index, output in enumerate(callback.outputs):
                output_value = output_values[output_index]
                state_changes.append(
                    {
                        **output.to_dict(),
                        "value": (
                            output_value.to_dict()
                            # if isinstance(output_value, Component)
                            if hasattr(output_value, "to_dict")
                            and callable(output_value.to_dict)
                            else output_value
                        ),
                    }
                )

            state_change_requests.append(
                {
                    "contribPoint": contrib_point_name,
                    "contribIndex": contrib_index,
                    "stateChanges": state_changes,
                }
            )

        self.set_header("Content-Type", "text/json")
        self.write(json.dumps({"result":  state_change_requests}, cls=NumpyJSONEncoder))


def print_usage(app, port):
    url = f"http://127.0.0.1:{port}"
    print(f"Listening on {url}...")
    print(f"API:")
    print(f"- {url}/dashi/contributions")
    contribution_points = app.settings[DASHI_CONTRIBUTION_POINTS_KEY]
    for contrib_point_name, contributions in contribution_points.items():
        for i in range(len(contributions)):
            print(f"- {url}/dashi/layout/{contrib_point_name}/{i}")


def make_app():
    # Read config
    with open("my-config.yaml") as f:
        server_config = yaml.load(f, yaml.SafeLoader)

    # Parse panel renderers
    extensions = load_extensions(server_config)

    # Create app
    app = tornado.web.Application(
        [
            (r"/", RootHandler),
            (r"/dashi/contributions", ContributionsHandler),
            (r"/dashi/layout/([a-z0-9-]+)/([0-9]+)", LayoutHandler),
            (r"/dashi/callback", CallbackHandler),
        ]
    )
    app.settings[DASHI_CONTEXT_KEY] = Context()
    app.settings[DASHI_EXTENSIONS_KEY] = extensions
    contribution_points: dict[str, list[Contribution]] = {}
    for contrib_point_name in Extension.get_contrib_point_names():
        contributions: list[Contribution] = []
        for extension in extensions:
            contributions.extend(getattr(extension, contrib_point_name))
        contribution_points[contrib_point_name] = contributions
    app.settings[DASHI_CONTRIBUTION_POINTS_KEY] = contribution_points
    return app


def load_extensions(server_config: dict) -> list[Extension]:
    extensions: list[Extension] = []
    for ext_ref in server_config.get("extensions", []):
        try:
            module_name, attr_name = ext_ref.rsplit(".", maxsplit=2)
        except (ValueError, AttributeError):
            raise TypeError(f"contribution syntax error: {ext_ref!r}")
        module = importlib.import_module(module_name)
        extension = getattr(module, attr_name)
        if not isinstance(extension, Extension):
            raise TypeError(
                f"extension {ext_ref!r} must refer to an"
                f" instance of {Extension.__qualname__!r},"
                f" but was {type(extension).__qualname__!r}"
            )
        extensions.append(extension)
    return extensions


async def main():
    tornado.log.enable_pretty_logging()

    port = 8888
    app = make_app()
    app.listen(port)

    print_usage(app, port)

    shutdown_event = asyncio.Event()
    await shutdown_event.wait()


if __name__ == "__main__":
    asyncio.run(main())
