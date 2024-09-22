import asyncio
import json

import tornado
import tornado.web
import tornado.log

from dashipy.panel import get_panel
from dashipy.panel import update_panel


class PanelHandler(tornado.web.RequestHandler):

    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Methods", "GET,PUT,DELETE,OPTIONS")
        self.set_header(
            "Access-Control-Allow-Headers",
            "x-requested-with,access-control-allow-origin,"
            "authorization,content-type",
        )

    def get(self):
        panel = get_panel()
        self.set_header("Content-Type", "text/json")
        self.write(panel.to_dict())

    def post(self):
        event = tornado.escape.json_decode(self.request.body)
        panel = update_panel(event)
        # self.set_header("Content-Type", "text/json")
        # self.write(panel.to_dict())


def make_app():
    return tornado.web.Application(
        [
            (r"/panel", PanelHandler),
        ]
    )


async def main():
    tornado.log.enable_pretty_logging()
    port = 8888
    app = make_app()
    app.listen(port)
    print(f"Listening http://127.0.0.1:{port}...")
    shutdown_event = asyncio.Event()
    await shutdown_event.wait()


if __name__ == "__main__":
    asyncio.run(main())
