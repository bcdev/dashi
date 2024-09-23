from abc import ABC
from typing import Any, Iterable

from .component import Component


class Container(Component, ABC):

    # noinspection PyShadowingBuiltins
    def __init__(
        self,
        type: str,
        *,
        components: Iterable[Component] | None = None,
        # Common data model
        name: str | None = None,
        value: Any = None,
        # Common HTML attributes
        id: str | None = None,
        style: dict[str, Any] | None = None,
    ):
        super().__init__(type, name=name, value=value, id=id, style=style)
        self.components = list(components or [])

    def add(self, component: Component):
        self.components.append(component)

    def to_dict(self) -> dict[str, Any]:
        return {
            **super().to_dict(),
            "components": list(c.to_dict() for c in self.components),
        }
