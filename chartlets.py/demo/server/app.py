import asyncio
import json
import traceback
from typing import Any

import tornado
import tornado.web
import tornado.log
import yaml

from chartlets import __version__
from chartlets import ExtensionContext
from chartlets import Response
from chartlets import Extension
from chartlets.controllers import get_callback_results
from chartlets.controllers import get_contributions
from chartlets.controllers import get_layout

from .context import Context
from .panel import Panel


# This would be done by a xcube server extension
Extension.add_contrib_point("panels", Panel)


_CONTEXT_KEY = "chartlets.context"


class DemoHandler(tornado.web.RequestHandler):
    @property
    def ext_ctx(self) -> ExtensionContext:
        return self.settings[_CONTEXT_KEY]

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

    def write_response(self, response: Response):
        if response.ok:
            self.write({"result": response.data})
        else:
            self.set_status(response.status, response.reason)


class RootHandler(DemoHandler):
    # GET /
    def get(self):
        self.set_header("Content-Type", "text/plain")
        self.write(f"chartlets-demo-server {__version__}")


class ContributionsHandler(DemoHandler):

    # GET /chartlets/contributions
    def get(self):
        self.write_response(get_contributions(self.ext_ctx))


class LayoutHandler(DemoHandler):
    # GET /chartlets/layout/{contrib_point_name}/{contrib_index}
    def get(self, contrib_point_name: str, contrib_index: str):
        self.write_response(
            get_layout(self.ext_ctx, contrib_point_name, int(contrib_index), {})
        )

    # POST /chartlets/layout/{contrib_point_name}/{contrib_index}
    def post(self, contrib_point_name: str, contrib_index: str):
        data = tornado.escape.json_decode(self.request.body)
        self.write_response(
            get_layout(self.ext_ctx, contrib_point_name, int(contrib_index), data)
        )


class CallbackHandler(DemoHandler):

    # POST /chartlets/callback
    def post(self):
        data = tornado.escape.json_decode(self.request.body)
        self.write_response(get_callback_results(self.ext_ctx, data))


def print_usage(app, port):
    url = f"http://127.0.0.1:{port}"
    print(f"Listening on {url}...")
    print(f"API:")
    print(f"- {url}/chartlets/contributions")
    ext_ctx: ExtensionContext = app.settings[_CONTEXT_KEY]
    for contrib_point_name, contributions in ext_ctx.contributions.items():
        for i in range(len(contributions)):
            print(f"- {url}/chartlets/layout/{contrib_point_name}/{i}")


def make_app():
    # Read config
    with open("server-config.yaml") as f:
        server_config = yaml.load(f, yaml.SafeLoader)

    # Create app
    app = tornado.web.Application(
        [
            (r"/", RootHandler),
            (r"/chartlets/contributions", ContributionsHandler),
            (r"/chartlets/layout/([a-z0-9-]+)/([0-9]+)", LayoutHandler),
            (r"/chartlets/callback", CallbackHandler),
        ]
    )

    # Load extensions
    ext_ctx = ExtensionContext.load(Context(), server_config.get("extensions", []))
    app.settings[_CONTEXT_KEY] = ext_ctx

    return app


async def run_app():
    tornado.log.enable_pretty_logging()

    port = 8888
    app = make_app()
    app.listen(port)

    print_usage(app, port)

    shutdown_event = asyncio.Event()
    await shutdown_event.wait()
