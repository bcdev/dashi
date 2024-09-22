from abc import abstractmethod, ABC
from typing import Any

import plotly.graph_objects


class Component(ABC):
    # noinspection PyShadowingBuiltins
    def __init__(
        self, type: str, id: str | None = None, style: dict[str, Any] | None = None
    ):
        self.type = type
        self.id = id
        self.style = style

    def to_dict(self) -> dict[str, Any]:
        d = dict(type=self.type)
        if self.id:
            d["id"] = self.id
        if self.style:
            d["style"] = self.style
        return d


class Container(Component, ABC):

    # noinspection PyShadowingBuiltins
    def __init__(
        self, type: str, id: str | None = None, style: dict[str, Any] | None = None
    ):
        super().__init__("panel", id=id, style=style)
        self.components = []

    def add_component(self, component: Component):
        self.components.append(component)

    def to_dict(self) -> dict[str, Any]:
        return {
            **super().to_dict(),
            "components": list(c.to_dict() for c in self.components),
        }


class Panel(Container):

    # noinspection PyShadowingBuiltins
    def __init__(self, id: str, style: dict[str, Any] | None = None):
        super().__init__("panel", id, style=style)


class Box(Container):

    # noinspection PyShadowingBuiltins
    def __init__(self, id: str | None = None, style: dict[str, Any] | None = None):
        super().__init__("box", id, style=style)


class Plot(Component):

    def __init__(self, id: str, figure: plotly.graph_objects.Figure):
        super().__init__("plot", id)
        self.figure = figure

    def to_dict(self) -> dict[str, Any]:
        return {
            **super().to_dict(),
            **self.figure.to_dict(),
        }


class Button(Component):

    def __init__(self, id: str, text: str, style: dict[str, Any] | None = None):
        super().__init__("button", id, style=style)
        self.text = text

    def to_dict(self) -> dict[str, Any]:
        return {
            **super().to_dict(),
            "text": self.text,
        }
