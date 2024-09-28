from typing import Any, Callable
from abc import ABC

from .callback import Callback, Output, Input


class Contribution(ABC):
    # noinspection PyShadowingBuiltins
    def __init__(self, name: str):
        self.name = name
        self.extension: Extension | None = None
        self.layout_callback: Callback | None = None
        self.callbacks: list[Callback] = []

    def to_dict(self) -> dict[str, Any]:
        d = dict(name=self.name)
        if self.extension is not None:
            d.update(extension=self.extension.name)
        if self.layout_callback is not None:
            d.update(layout=self.layout_callback.to_dict())
        if self.callbacks:
            d.update(callbacks=[cb.to_dict() for cb in self.callbacks])
        return d

    def layout(self, *args) -> Callable:
        """Decorator."""

        def decorator(function: Callable) -> Callable:
            self.layout_callback = Callback.from_decorator(
                "layout", args, function, outputs_allowed=False
            )
            return function

        return decorator

    def callback(self, *args: Input | Output) -> Callable[[Callable], Callable]:
        """Decorator."""

        def decorator(function: Callable) -> Callable:
            self.callbacks.append(
                Callback.from_decorator(
                    "callback", args, function, outputs_allowed=True
                )
            )
            return function

        return decorator


class Extension:
    """A UI Extension."""

    _contrib_points: dict[type[Contribution], str] = {}

    @classmethod
    def add_contrib_point(cls, name: str, item_type: type[Contribution]):
        cls._contrib_points[item_type] = name

    @classmethod
    def get_contrib_point_names(cls) -> tuple[str, ...]:
        values = cls._contrib_points.values()
        # noinspection PyTypeChecker
        return tuple(values)

    # noinspection PyShadowingBuiltins
    def __init__(self, name: str, version: str = "0.0.0"):
        self.name = name
        self.version = version
        for contrib_point_name in self.get_contrib_point_names():
            setattr(self, contrib_point_name, [])

    def add(self, contribution: Contribution):
        contrib_type = type(contribution)
        contrib_point_name = self._contrib_points.get(contrib_type)
        if contrib_point_name is None:
            raise TypeError(
                f"unrecognized contribution of type {contrib_type.__qualname__}"
            )
        contribution.extension = self
        contributions: list[Contribution] = getattr(self, contrib_point_name)
        contributions.append(contribution)

    def to_dict(self) -> dict[str, Any]:
        return dict(
            name=self.name,
            version=self.version,
            contributes=[
                contrib_point_name
                for contrib_point_name in self.get_contrib_point_names()
                if getattr(self, contrib_point_name)
            ],
        )
