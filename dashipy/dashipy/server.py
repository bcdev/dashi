import asyncio
import importlib
from typing import Callable, Any

import tornado
import tornado.web
import tornado.log
import yaml

from dashipy.context import Context
from dashipy import __version__
from dashipy.contribs import Panel


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


class PanelsHandler(RequestHandler):

    # GET /panels
    def get(self):
        panels: dict[str, Callable] = self.settings["panels"]
        self.set_header("Content-Type", "text/json")
        self.write({"panels": list(panels.keys())})


class PanelRendererHandler(RequestHandler):
    # GET /panels/{panel_id}
    def get(self, panel_id: str):
        self.render_panel(panel_id, {})

    # POST /panels/{panel_id}
    def post(self, panel_id: str):
        event = tornado.escape.json_decode(self.request.body)
        panel_props = event.get("eventData") or {}
        self.render_panel(panel_id, panel_props)

    def render_panel(self, panel_id: str, panel_props: dict[str, Any]):
        context: Context = self.settings["context"]
        panels: dict[str, Panel] = self.settings["panels"]
        panel: Panel = panels.get(panel_id)
        if panel is not None:
            self.set_header("Content-Type", "text/json")
            self.write(panel.render(context, **panel_props).to_dict())
        else:
            self.set_status(404, f"panel not found: {panel_props}")


class PanelCallbackHandler(RequestHandler):

    # POST /panels/{panel_id}/callback
    def post(self, panel_id: str):
        event = tornado.escape.json_decode(self.request.body)
        panel_props = event.get("eventData") or {}
        self.render_panel(panel_id, panel_props)

    def render_panel(self, panel_id: str, panel_props: dict[str, Any]):
        context: Context = self.settings["context"]
        panels: dict[str, Callable] = self.settings["panels"]
        panel_renderer = panels.get(panel_id)
        if panel_renderer is not None:
            self.set_header("Content-Type", "text/json")
            self.write(panel_renderer(context, **panel_props).to_dict())
        else:
            self.set_status(404, f"panel not found: {panel_props}")


def make_app():
    # Read config
    with open("my-config.yaml") as f:
        server_config = yaml.load(f, yaml.SafeLoader)

    # Parse panel renderers
    panels: dict[str, Panel] = {}
    for panel_ref in server_config.get("contributions", []):
        try:
            module_name, attr_name = panel_ref.rsplit(".", maxsplit=2)
        except (ValueError, AttributeError):
            raise TypeError(f"contribution syntax error: {panel_ref!r}")
        module = importlib.import_module(module_name)
        panel = getattr(module, attr_name)
        if not isinstance(panel, Panel):
            raise TypeError(f"contribution {panel_ref!r} is not an instance of Panel")
        panels[panel_ref.replace(".", "").replace("_", "").lower()] = panel

    # Create app
    app = tornado.web.Application(
        [
            (r"/", RootHandler),
            (r"/panels", PanelsHandler),
            (r"/panels/([a-z0-9-]+)", PanelRendererHandler),
            (r"/panels/([a-z0-9-]+)/callback", PanelCallbackHandler),
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
