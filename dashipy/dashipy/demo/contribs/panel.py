from typing import Any

from dashipy.lib import Contribution


class Panel(Contribution):
    """Panel contribution"""
    def __init__(self, name: str, title: str | None = None):
        super().__init__(name, title=title)