from typing import Any, Iterable

from .component import Component
from .container import Container


class Box(Container):

    # noinspection PyShadowingBuiltins
    def __init__(
        self,
        *,
        components: Iterable[Component] | None = None,
        # Common HTML attributes
        id: str | None = None,
        style: dict[str, Any] | None = None,
    ):
        super().__init__("box", components=components, id=id, style=style)
