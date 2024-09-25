from typing import Any

from dashipy.lib.component import Component


class Dropdown(Component):

    # noinspection PyShadowingBuiltins
    def __init__(
        self,
        *,
        options: list[tuple[str, str | int | float]],
        # Common HTML attributes
        id: str = None,
        name: str = None,
        value: str | int | float = None,
        style: dict[str, Any] = None,
    ):
        super().__init__("dropdown", id=id, name=name, value=value, style=style)
        self.options = options

    def to_dict(self) -> dict[str, Any]:
        return {
            **super().to_dict(),
            "options": self.options,
        }
