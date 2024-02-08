import asyncio
import math
import random
import json
import traceback

import tornado


class RegionHandler(tornado.web.RequestHandler):
    regions = dict()

    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Methods", "GET,PUT,DELETE,OPTIONS")
        self.set_header(
            "Access-Control-Allow-Headers",
            "x-requested-with,access-control-allow-origin,"
            "authorization,content-type",
        )

    def write_error(self, status_code: int, **kwargs):
        valid_json_types = str, int, float, bool, type(None)
        error_info = {
            k: v for k, v in kwargs.items() if isinstance(v, valid_json_types)
        }
        error_info.update(status_code=status_code)
        if "exc_info" in kwargs:
            exc_type, exc_val, exc_tb = kwargs["exc_info"]
            error_info.update(
                exception=traceback.format_exception(exc_type, exc_val, exc_tb),
                message=str(exc_val),
            )
            if isinstance(exc_val, tornado.web.HTTPError) and exc_val.reason:
                error_info.update(reason=exc_val.reason)
        self.finish({"error": error_info})

    def get(self, region: str):
        data = self.regions.get(region)
        if not data:
            data = [
                {
                    "name": f"Page {x}",
                    "uv": math.floor(10000 * random.random()),
                    "pv": math.floor(10000 * random.random()),
                    "amt": math.floor(10000 * random.random()),
                }
                for x in "ABCDEFG"
            ]
            print(data)
            self.regions[region] = data
        self.set_header("Content-Type", "text/json")
        self.write(json.dumps({"result": data}))


def make_app():
    return tornado.web.Application(
        [
            (r"/region/([0-9]+)", RegionHandler),
        ]
    )


async def main():
    port = 8888
    app = make_app()
    app.listen(port)
    print(f"Listening http://127.0.0.1:{port}...")
    shutdown_event = asyncio.Event()
    await shutdown_event.wait()


if __name__ == "__main__":
    asyncio.run(main())
