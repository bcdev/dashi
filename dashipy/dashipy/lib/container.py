from abc import ABC
from dataclasses import dataclass, field

from .component import Component


@dataclass(frozen=True)
class Container(Component, ABC):
    children: list[Component] = field(default_factory=list)

    def add(self, component: Component):
        self.children.append(component)
