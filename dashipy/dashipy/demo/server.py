import asyncio
import json
import traceback
from typing import Any

import tornado
import tornado.web
import tornado.log
import yaml

from dashipy import __version__
from dashipy.controllers import ExtensionContext
from dashipy.controllers import Response
from dashipy.controllers import get_callback_results
from dashipy.controllers import get_contributions
from dashipy.controllers import get_layout
from dashipy.lib import Extension
from dashipy.demo.context import Context
from dashipy.demo.contribs import Panel
from dashipy.demo.utils import NumpyJSONEncoder

DASHI_CONTEXT_KEY = "dashi.context"

# This would be done by a xcube server extension
Extension.add_contrib_point("panels", Panel)


class DashiHandler(tornado.web.RequestHandler):
    @property
    def ext_ctx(self) -> ExtensionContext:
        return self.settings[DASHI_CONTEXT_KEY]

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
            self.set_header("Content-Type", "text/json")
            self.write(json.dumps({"result": response.data}, cls=NumpyJSONEncoder))
        else:
            self.set_status(response.status, response.reason)


class RootHandler(DashiHandler):
    # GET /
    def get(self):
        self.set_header("Content-Type", "text/plain")
        self.write(f"dashi-server {__version__}")


class ContributionsHandler(DashiHandler):

    # GET /dashi/contributions
    def get(self):
        self.write_response(get_contributions(self.ext_ctx))


class LayoutHandler(DashiHandler):
    # GET /dashi/layout/{contrib_point_name}/{contrib_index}
    def get(self, contrib_point_name: str, contrib_index: str):
        self.write_response(
            get_layout(self.ext_ctx, contrib_point_name, int(contrib_index), {})
        )

    # POST /dashi/layout/{contrib_point_name}/{contrib_index}
    def post(self, contrib_point_name: str, contrib_index: str):
        data = tornado.escape.json_decode(self.request.body)
        self.write_response(
            get_layout(self.ext_ctx, contrib_point_name, int(contrib_index), data)
        )


class CallbackHandler(DashiHandler):

    # POST /dashi/callback
    def post(self):
        data = tornado.escape.json_decode(self.request.body)
        self.write_response(get_callback_results(self.ext_ctx, data))


def print_usage(app, port):
    url = f"http://127.0.0.1:{port}"
    print(f"Listening on {url}...")
    print(f"API:")
    print(f"- {url}/dashi/contributions")
    ext_ctx: ExtensionContext = app.settings[DASHI_CONTEXT_KEY]
    for contrib_point_name, contributions in ext_ctx.contributions.items():
        for i in range(len(contributions)):
            print(f"- {url}/dashi/layout/{contrib_point_name}/{i}")


def make_app():
    # Read config
    with open("my-config.yaml") as f:
        server_config = yaml.load(f, yaml.SafeLoader)

    # Parse panel renderers
    extensions = ExtensionContext.load_extensions(server_config.get("extensions", []))

    # Create app
    app = tornado.web.Application(
        [
            (r"/", RootHandler),
            (r"/dashi/contributions", ContributionsHandler),
            (r"/dashi/layout/([a-z0-9-]+)/([0-9]+)", LayoutHandler),
            (r"/dashi/callback", CallbackHandler),
        ]
    )
    app.settings[DASHI_CONTEXT_KEY] = ExtensionContext(Context(), extensions)
    return app


async def _main():
    tornado.log.enable_pretty_logging()

    port = 8888
    app = make_app()
    app.listen(port)

    print_usage(app, port)

    shutdown_event = asyncio.Event()
    await shutdown_event.wait()


def main():
    asyncio.run(_main())


if __name__ == "__main__":
    main()
