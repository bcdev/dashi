import asyncio
import importlib
from typing import Callable, Any

import tornado
import tornado.web
import tornado.log
import yaml

from dashipy.context import Context
from dashipy import __version__


class RootHandler(tornado.web.RequestHandler):
    def get(self):
        self.set_header("Content-Type", "text/plain")
        self.write(f"dashi-server {__version__}")


class PanelHandler(tornado.web.RequestHandler):

    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Methods", "GET,PUT,DELETE,OPTIONS")
        self.set_header(
            "Access-Control-Allow-Headers",
            "x-requested-with,access-control-allow-origin,"
            "authorization,content-type",
        )

    # GET /panels
    def get(self):
        self.write_panels({})

    # POST /panels
    def post(self):
        event = tornado.escape.json_decode(self.request.body)
        self.write_panels(event.get("eventData") or {})

    def write_panels(self, params: dict[str, Any]):
        context: Context = self.settings["context"]
        panels: list[Callable] = self.settings["panels"]
        self.set_header("Content-Type", "text/json")
        self.write({k: v(context, **params).to_dict() for k, v in panels})


def make_app():
    # Read config
    with open("my-config.yaml") as f:
        server_config = yaml.load(f, yaml.SafeLoader)

    # Parse panel factories
    panels = []
    for function_ref in server_config.get("panels", []):
        module_name, function_name = function_ref.split(":", maxsplit=2)
        module = importlib.import_module(module_name)
        function = getattr(module, function_name)
        panels.append(function)

    # Create app
    app = tornado.web.Application(
        [
            (r"/", RootHandler),
            (r"/panels", PanelHandler),
        ]
    )
    app.settings["context"] = Context()
    app.settings["panels"] = panels
    return app


async def main():
    tornado.log.enable_pretty_logging()
    port = 8888
    app = make_app()
    app.listen(port)
    print(f"Listening on http://127.0.0.1:{port}...")
    shutdown_event = asyncio.Event()
    await shutdown_event.wait()


if __name__ == "__main__":
    asyncio.run(main())
