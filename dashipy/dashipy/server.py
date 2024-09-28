import asyncio
import importlib
import traceback
from typing import Any

import tornado
import tornado.web
import tornado.log
import yaml

from dashipy import __version__
from dashipy.context import Context
from dashipy.contribs import Panel
from dashipy.lib import Extension, Contribution, Component

DASHI_CONTEXT_KEY = "dashi.context"
DASHI_EXTENSIONS_KEY = "dashi.extensions"
DASHI_CONTRIB_KEY_PREFIX = "dashi.contrib."

Extension.add_contrib_point("panels", Panel)


class RequestHandler(tornado.web.RequestHandler):

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


class RootHandler(RequestHandler):
    def get(self):
        self.set_header("Content-Type", "text/plain")
        self.write(f"dashi-server {__version__}")


class ExtensionsHandler(RequestHandler):

    # GET /ext/extensions
    def get(self):
        extensions: list[Extension] = self.settings[DASHI_EXTENSIONS_KEY]
        self.set_header("Content-Type", "text/json")
        self.write({"result": [e.to_dict() for e in extensions]})


class ContributionsHandler(RequestHandler):

    # GET /ext/contributions/{contrib_point_name}
    def get(self, contrib_point_name):
        contrib_key = DASHI_CONTRIB_KEY_PREFIX + contrib_point_name
        try:
            contributions: list[Contribution] = self.settings[contrib_key]
        except KeyError:
            self.set_status(404, f"contribution point {contrib_point_name!r} not found")
            return
        self.set_header("Content-Type", "text/json")
        self.write({"result": [c.to_dict() for c in contributions]})


class LayoutHandler(RequestHandler):
    # GET /ext/layout/{contrib_point_name}/{contrib_index}
    def get(self, contrib_point_name: str, contrib_index: str):
        self.render_layout(contrib_point_name, int(contrib_index), [])

    # POST /ext/layout/{contrib_point_name}/{contrib_index}
    def post(self, contrib_point_name: str, contrib_index: str):
        data = tornado.escape.json_decode(self.request.body)
        input_values = data.get("inputValues") or []
        self.render_layout(contrib_point_name, int(contrib_index), input_values)

    def render_layout(
        self, contrib_point_name: str, contrib_index: int, input_values: list
    ):
        settings_key = DASHI_CONTRIB_KEY_PREFIX + contrib_point_name
        try:
            contributions: list[Contribution] = self.settings[settings_key]
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
        self.write({"result": component.to_dict()})


class CallbackHandler(RequestHandler):

    # POST /ext/callback
    def post(self):
        data = tornado.escape.json_decode(self.request.body)
        # TODO: validate data
        call_requests: list[dict] = data.get("callRequests") or []

        context: Context = self.settings[DASHI_CONTEXT_KEY]

        # TODO: assert correctness, set status code on error
        call_results: list[dict] = []
        for call_request in call_requests:
            contrib_point_name: str = call_request["contribPoint"]
            contrib_index: int = call_request["contribIndex"]
            callback_index: int = call_request["callbackIndex"]
            input_values: list = call_request["inputValues"]

            contrib_key = DASHI_CONTRIB_KEY_PREFIX + contrib_point_name
            contributions: list[Contribution] = self.settings[contrib_key]
            contribution = contributions[contrib_index]
            callback = contribution.callbacks[callback_index]
            output_values = callback.invoke(context, input_values)

            if len(callback.outputs) == 1:
                output_values = (output_values,)

            callback_outputs: list[dict] = []
            for output_index, output in enumerate(callback.outputs):
                output_value = output_values[output_index]
                callback_outputs.append(
                    {
                        **output.to_dict(),
                        "value": (
                            output_value.to_dict()
                            if isinstance(output_value, Component)
                            else output_value
                        ),
                    }
                )

            call_results.append(
                {
                    "contribPoint": contrib_point_name,
                    "contribIndex": contrib_index,
                    "callbackOutputs": callback_outputs,
                }
            )

        self.set_header("Content-Type", "text/json")
        self.write({"result": call_results})


def print_usage(app, port):
    url = f"http://127.0.0.1:{port}"
    print(f"Listening on {url}...")
    print(f"API:")
    print(f"- {url}/dashi/extensions")
    for k in app.settings.keys():
        if k.startswith(DASHI_CONTRIB_KEY_PREFIX):
            contrib_point_name = k[len(DASHI_CONTRIB_KEY_PREFIX) :]
            print(f"- {url}/dashi/contributions/{contrib_point_name}")
    for k, v in app.settings.items():
        if k.startswith(DASHI_CONTRIB_KEY_PREFIX):
            contrib_point_name = k[len(DASHI_CONTRIB_KEY_PREFIX) :]
            contributions: list[Contribution] = v
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
            (r"/dashi/extensions", ExtensionsHandler),
            (r"/dashi/contributions/([a-z0-9-]+)", ContributionsHandler),
            (r"/dashi/layout/([a-z0-9-]+)/([0-9]+)", LayoutHandler),
            (r"/dashi/callback", CallbackHandler),
        ]
    )
    app.settings[DASHI_CONTEXT_KEY] = Context()
    app.settings[DASHI_EXTENSIONS_KEY] = extensions
    for contrib_point_name in Extension.get_contrib_point_names():
        contributions: list[Contribution] = []
        for extension in extensions:
            contributions.extend(getattr(extension, contrib_point_name))
        app.settings[DASHI_CONTRIB_KEY_PREFIX + contrib_point_name] = contributions
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
