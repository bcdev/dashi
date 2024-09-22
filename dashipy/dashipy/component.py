from abc import abstractmethod, ABC
from typing import Any, Iterable

import plotly.graph_objects


class Component(ABC):
    # noinspection PyShadowingBuiltins
    def __init__(
        self,
        type: str,
        *,
        # Common data model
        name: str | None = None,
        value: Any = None,
        # Common HTML attributes
        id: str | None = None,
        style: dict[str, Any] | None = None,
    ):
        self.type = type
        self.name = name
        self.value = value
        self.id = id
        self.style = style

    def to_dict(self) -> dict[str, Any]:
        attrs = "type", "name", "id", "style"
        data = {
            attr: getattr(self, attr)
            for attr in attrs
            if getattr(self, attr) is not None
        }
        # "value is included only if "name" is given
        if "name" in data:
            data["value"] = self.value
        return data


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


class Panel(Container):

    # noinspection PyShadowingBuiltins
    def __init__(
        self,
        *,
        components: Iterable[Component] | None = None,
        # Common HTML attributes
        id: str | None = None,
        style: dict[str, Any] | None = None,
    ):
        super().__init__("panel", components=components, id=id, style=style)


class Box(Container):

    def __init__(
        self,
        *,
        components: Iterable[Component] | None = None,
        # Common HTML attributes
        id: str | None = None,
        style: dict[str, Any] | None = None,
    ):
        super().__init__("box", components=components, id=id, style=style)


class Plot(Component):

    def __init__(self, figure: plotly.graph_objects.Figure):
        super().__init__("plot")
        self.figure = figure

    def to_dict(self) -> dict[str, Any]:
        return {
            **super().to_dict(),
            **self.figure.to_dict(),
        }


class Button(Component):

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
