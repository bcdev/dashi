from typing import Callable

from ..lib import Callback, Component
from ..lib import Input, Output


class Panel:
    """Panel contribution"""

    # noinspection PyShadowingBuiltins
    def __init__(self):
        self.renderer: Callback | None = None
        self.callbacks: list[Callback] = []

    def render(self, *args, **kwargs) -> Component | None:
        assert self.renderer is not None
        return self.renderer.function(*args, **kwargs)

    def layout(self, *args) -> Callable:
        """Decorator."""

        def decorator(function: Callable) -> Callable:
            self.renderer = Callback.from_decorator("layout", function, args)
            return function

        return decorator

    def callback(self, *args: Input | Output) -> Callable[[Callable], Callable]:
        """Decorator."""

        def decorator(function: Callable) -> Callable:
            self.callbacks.append(Callback.from_decorator("callback", function, args))
            return function

        return decorator
