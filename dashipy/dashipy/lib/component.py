from abc import ABC
from dataclasses import dataclass, field
from typing import Any


@dataclass(frozen=True)
class Component(ABC):
    id: str = None
    name: str = None
    value: str | int | float = None
    style: dict[str, Any] = None

    @property
    def type(self):
        return self.__class__.__name__

    def to_dict(self) -> dict[str, Any]:
        d = dict(type=self.type)
        d.update(
            {
                attr_name: attr_value
                for attr_name, attr_value in self.__dict__.items()
                if attr_value is not None
                and not attr_name.startswith("_")
                and attr_name
            }
        )
        return d


@dataclass(frozen=True)
class Container(Component, ABC):
    children: list[Component] = field(default_factory=list)

    def add(self, component: Component):
        self.children.append(component)

    def to_dict(self) -> dict[str, Any]:
        return {
            **super().to_dict(),
            "children": list(c.to_dict() for c in self.children),
        }
