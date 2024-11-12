from typing import Any, Callable
from abc import ABC

from .callback import Callback
from .channel import Channel


class Contribution(ABC):
    # noinspection PyShadowingBuiltins
    def __init__(self, name: str, **initial_state):
        self.name = name
        self.initial_state = initial_state
        self.extension: str | None = None
        self.layout_callback: Callback | None = None
        self.callbacks: list[Callback] = []

    def to_dict(self) -> dict[str, Any]:
        d = dict(name=self.name)
        if self.initial_state is not None:
            d.update(initialState=self.initial_state)
        if self.extension is not None:
            d.update(extension=self.extension)
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

    def callback(self, *args: Channel) -> Callable[[Callable], Callable]:
        """Decorator."""

        def decorator(function: Callable) -> Callable:
            self.callbacks.append(
                Callback.from_decorator(
                    "callback", args, function, outputs_allowed=True
                )
            )
            return function

        return decorator

    def __str__(self):
        return self.name
