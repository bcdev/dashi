from typing import Any, Iterable

from dashipy.lib.component import Component
from dashipy.lib.container import Container


class Box(Container):

    # noinspection PyShadowingBuiltins
    def __init__(
        self,
        *,
        components: Iterable[Component] | None = None,
        # Common HTML attributes
        id: str = None,
        name: str = None,
        value: str | int | float = None,
        style: dict[str, Any] = None,
    ):
        super().__init__(
            "box", components=components, id=id, name=name, value=value, style=style
        )
