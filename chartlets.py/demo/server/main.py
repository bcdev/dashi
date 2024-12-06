import asyncio

from server.app import run_app


def main():
    asyncio.run(run_app())


if __name__ == "__main__":
    main()
