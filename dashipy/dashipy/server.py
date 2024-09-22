import asyncio

import tornado
import tornado.web
import tornado.log

from dashipy.context import Context
from dashipy.panel import get_panel


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
        context: Context = self.settings["context"]
        panel = get_panel(context)
        self.set_header("Content-Type", "text/json")
        self.write(panel.to_dict())

    def post(self):
        context: Context = self.settings["context"]
        event = tornado.escape.json_decode(self.request.body)
        print(event)
        event_data = event.get("eventData") or {}
        panel = get_panel(context, **event_data)
        self.set_header("Content-Type", "text/json")
        self.write(panel.to_dict())


def make_app():
    app = tornado.web.Application(
        [
            (r"/panel", PanelHandler),
        ]
    )
    app.settings["context"] = Context()
    return app


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
