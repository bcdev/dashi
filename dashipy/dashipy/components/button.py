from typing import Any

from dashipy.lib.component import Component


class Button(Component):

    # noinspection PyShadowingBuiltins
    def __init__(
        self,
        *,
        text: str,
        # Common HTML attributes
        id: str = None,
        name: str = None,
        value: str | int | float = None,
        style: dict[str, Any] = None,
    ):
        super().__init__("button", id=id, name=name, value=value, style=style)
        self.text = text

    def to_dict(self) -> dict[str, Any]:
        return {
            **super().to_dict(),
            "text": self.text,
        }
