from typing import Any, Iterable, Callable

from .callback import Callback
from .callback import Input
from .callback import Output
from .component import Component
from .container import Container


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
        self.callbacks: list[Callback] = []

    def callback(self, *args: Input | Output) -> Callable[[Callable], Callable]:
        def call_back_decorator(callback_fn: Callable) -> Callable:
            if not callable(callback_fn):
                # noinspection PyUnresolvedReferences
                raise TypeError(
                    f"'callback' decorator must be"
                    f" used with function, was {callback_fn.__class__.__name__!r}"
                )
            inputs = []
            outputs = []
            for arg in args:
                if isinstance(arg, Input):
                    inputs.append(arg)
                elif isinstance(arg, Output):
                    outputs.append(arg)
                else:
                    raise TypeError(
                        f"'callback' decorator argument must"
                        f" be Input or Output, was {arg.__class__.__name__!r}"
                    )

            callback = Callback(callback_fn, inputs, outputs)
            self.callbacks.append(callback)
            return callback_fn

        return call_back_decorator
