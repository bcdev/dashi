from abc import ABC
from typing import Any, Iterable

from dashipy.lib.component import Component


class Container(Component, ABC):

    # noinspection PyShadowingBuiltins
    def __init__(
        self,
        type: str,
        *,
        components: Iterable[Component] | None = None,
        # Common HTML attributes
        id: str = None,
        name: str = None,
        value: str | int | float = None,
        style: dict[str, Any] = None,
    ):
        super().__init__(type, id=id, name=name, value=value, style=style)
        self.components = list(components or [])

    def add(self, component: Component):
        self.components.append(component)

    def to_dict(self) -> dict[str, Any]:
        return {
            **super().to_dict(),
            "components": list(c.to_dict() for c in self.components),
        }
