from typing import Any

from dashipy.lib import Contribution


class Panel(Contribution):
    """Panel contribution"""
    def __init__(self, name: str, title: str):
        super().__init__(name)
        self.title = title

    def to_dict(self) -> dict[str, Any]:
        return {
            **super().to_dict(),
            "title": self.title

        }
