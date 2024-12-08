from typing import Any, Callable
from abc import ABC

from .callback import Callback
from .channel import Input, State, Output


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

    def __init__(self, name: str, **initial_state: Any):
        self.name = name
        self.initial_state = initial_state
        self.extension: str | None = None
        self.layout_callback: Callback | None = None
        self.callbacks: list[Callback] = []

    def to_dict(self) -> dict[str, Any]:
        """Convert this contribution into a JSON serializable dictionary.

        May be overridden by subclasses to allow for specific
        JSON serialization.

        Returns:
            A JSON serializable dictionary.
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

    def layout(self, *args: State) -> Callable[[Callable], Callable]:
        """Provides a decorator for a user-provided function that
        returns the initial user interface layout.

        The layout decorator should only be used once for
        given contribution instance.

        The decorated function must return an instance of
        a `chartlets.Component`, usually a `chartlets.components.Box`
        that arranges other components in some layout.

        The first parameter of the decorated function must be a
        positional argument. It provides an application-specific
        context that is used to allow for access server-side
        configuration and resources. The parameter should be
        called `ctx`.

        Other parameters of the decorated function are user-defined
        and must have a corresponding `chartlets.State` arguments
        in the `layout` decorator in the same order.

        Args:
            args:
                `chartlets.State` objects that
                define the source of the value for the corresponding
                parameter of the decorated function. Optional.

        Returns:
             The decorator.
        """

        def decorator(function: Callable) -> Callable:
            self.layout_callback = Callback.from_decorator(
                "layout", args, function, states_only=True
            )
            return function

        return decorator

    def callback(self, *args: Input | State | Output) -> Callable[[Callable], Callable]:
        """Provide a decorator for a user-provided callback function.

        Callback functions are event handlers that react
        to events fired by the host application state or by events
        fired by related components provided by this contribution's
        layout.

        The first parameter of the decorated function must be a
        positional argument. It provides an application-specific
        context that is used to allow for access server-side
        configuration and resources. The parameter should be
        called `ctx`.

        Other parameters of the decorated function are user-defined
        and must have a corresponding `chartlets.Input` argument
        in the `layout` decorator in the same order.

        The return value of the decorated function is used to change
        the component or the application state as described by its
        `Output` argument passed to the decorator. If more than out
        output is specified, the function is supposed to return a tuple
        of values with the same number of items in the order given
        by the `Output` arguments passed to the decorator.

        Args:
            args:
                `chartlets.Input`, `chartlets.State`, and `Output` objects that
                define sources and targets for the parameters passed to the
                callback function and the returned from the callback function.

        Returns:
             The decorated, user-provided function.
        """

        def decorator(function: Callable) -> Callable:
            self.callbacks.append(
                Callback.from_decorator("callback", args, function, states_only=False)
            )
            return function

        return decorator
