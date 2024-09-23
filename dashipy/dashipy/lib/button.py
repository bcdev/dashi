from typing import Any

from .component import Component


class Button(Component):

    # noinspection PyShadowingBuiltins
    def __init__(
        self,
        *,
        text: str,
        # Common data model
        name: str,
        value: Any,
        # Common HTML attributes
        id: str | None = None,
        style: dict[str, Any] | None = None,
    ):
        super().__init__("button", name=name, value=value, id=id, style=style)
        self.text = text

    def to_dict(self) -> dict[str, Any]:
        return {
            **super().to_dict(),
            "text": self.text,
        }
