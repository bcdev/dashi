import asyncio
import importlib

import tornado
import tornado.web
import tornado.log
import yaml

from dashipy import __version__
from dashipy.context import Context
from dashipy.contribs import Panel
from dashipy.lib import Extension, Contribution

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


class RootHandler(RequestHandler):
    def get(self):
        self.set_header("Content-Type", "text/plain")
        self.write(f"dashi-server {__version__}")


class ExtensionsHandler(RequestHandler):

    # GET /ext/extensions
    def get(self):
        extensions: list[Extension] = self.settings[DASHI_EXTENSIONS_KEY]
        self.set_header("Content-Type", "text/json")
        self.write({"extensions": [e.to_dict() for e in extensions]})


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
        self.write({contrib_point_name: [c.to_dict() for c in contributions]})


class LayoutHandler(RequestHandler):
    # GET /ext/layout/{contrib_point_name}/{contrib_index}
    def get(self, contrib_point_name: str, contrib_index: str):
        self.render_layout(contrib_point_name, int(contrib_index), [])

    # POST /ext/layout/{contrib_point_name}/{contrib_index}
    def post(self, contrib_point_name: str, contrib_index: str):
        data = tornado.escape.json_decode(self.request.body)
        layout_inputs = data.get("inputs") or []
        self.render_layout(contrib_point_name, int(contrib_index), layout_inputs)

    def render_layout(
        self, contrib_point_name: str, contrib_index: int, layout_inputs: list
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

        if contribution.layout_callback is None:
            self.set_status(400, f"contribution {contrib_ref!r} has no layout")
            return

        context: Context = self.settings[DASHI_CONTEXT_KEY]

        try:
            args, kwargs = contribution.layout_callback.make_args(layout_inputs)
            component = contribution.layout_callback(*(context, *args), **kwargs)
        except BaseException as e:
            self.set_status(400, f"contribution {contrib_ref!r}: {e}")
            return

        self.set_header("Content-Type", "text/json")
        self.write({"component": component.to_dict()})


class CallbackHandler(RequestHandler):

    # POST /ext/callback
    def post(self):
        data = tornado.escape.json_decode(self.request.body)
        print(data)
        self.set_header("Content-Type", "text/json")
        self.write({})


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
            (r"/ext/extensions", ExtensionsHandler),
            (r"/ext/contributions/([a-z0-9-]+)", ContributionsHandler),
            (r"/ext/layout/([a-z0-9-]+)/([0-9]+)", LayoutHandler),
            (r"/ext/callback", CallbackHandler),
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

    url = f"http://127.0.0.1:{port}"
    print(f"Listening on {url}...")
    print(f"API:")
    print(f"- {url}/ext/extensions")
    for k in app.settings.keys():
        if k.startswith(DASHI_CONTRIB_KEY_PREFIX):
            contrib_point_name = k[len(DASHI_CONTRIB_KEY_PREFIX) :]
            print(f"- {url}/ext/contributions/{contrib_point_name}")
    for k, v in app.settings.items():
        if k.startswith(DASHI_CONTRIB_KEY_PREFIX):
            contrib_point_name = k[len(DASHI_CONTRIB_KEY_PREFIX) :]
            contributions: list[Contribution] = v
            for i in range(len(contributions)):
                print(f"- {url}/ext/layout/{contrib_point_name}/{i}")

    shutdown_event = asyncio.Event()
    await shutdown_event.wait()


if __name__ == "__main__":
    asyncio.run(main())
