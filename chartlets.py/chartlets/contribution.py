from typing import Any, Callable
from abc import ABC

from .callback import Callback
from .channel import Channel


class Contribution(ABC):
    """Base class for specific application contributions.

    Derived classes typically add attributes that allow
    customizing the appearance of the contribution in the
    user interface. The user-provided values for such
    attributes determine the initial state of the
    contribution when it is rendered for the first time.

    Args:
        name: A name that should be unique within an extension.
        initial_state: contribution specific attribute values.
    """
    # noinspection PyShadowingBuiltins
    def __init__(self, name: str, **initial_state):
        self.name = name
        self.initial_state = initial_state
        self.extension: str | None = None
        self.layout_callback: Callback | None = None
        self.callbacks: list[Callback] = []

    def to_dict(self) -> dict[str, Any]:
        """Convert this contribution into a
        JSON serializable dictionary.
        """
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
        """A decorator for a user-provided function that
        returns the initial user interface layout.

        The decorated function must return an instance of
        a `chartlets.Component`, usually a `chartlets.components.Box`
        that arranges other components in some layout.

        The first parameter of the decorated function must be a
        positional argument. It provides an application-specific
        context that is used to allow for access server-side
        configuration and resources. The parameter should be
        called `ctx`.

        Other parameters of the decorated function are user-defined
        and must have a corresponding `chartlets.Input` argument
        in the `layout` decorator in the same order.

        Args:
            args: Instances of the `chartlets.Input` class that
                define the source of the value for the corresponding
                parameter of the decorated function. Optional.

        Returns:
             The decorated, user-provided function.
        """

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
