from abc import ABC
from typing import Any

from .util.assertions import (
    assert_is_not_empty,
    assert_is_instance_of,
    assert_is_one_of,
)


# noinspection PyShadowingBuiltins
class Channel(ABC):
    """Base class for `Input`, `State`, and `Output`.
    Instances are used as argument passed to
    the `layout` and `callback` decorators.
    """

    def __init__(self, id: str, property: str | None = None):
        self.id, self.property = self._validate_params(id, property)

    def to_dict(self) -> dict[str, Any]:
        """Convert this channel into a JSON-serializable dictionary."""
        if isinstance(self, State):
            return dict(id=self.id, property=self.property, noTrigger=True)
        else:
            return dict(id=self.id, property=self.property)

    def _validate_params(self, id_: Any, property: Any) -> tuple[str, str | None]:
        assert_is_not_empty("id", id_)
        assert_is_instance_of("id", id_, str)
        id: str = id_
        if id.startswith("@"):
            # Other states than component states
            assert_is_one_of("id", id, ("@app", "@container"))
            assert_is_not_empty("property", property)
            assert_is_instance_of("property", property, str)
        else:
            # Component state
            if property is None:
                # Default property value for components is "value"
                property = "value"
            elif isinstance(self, Output) and property == "":
                # Outputs may have an empty property
                pass
            else:
                # Components must have valid properties
                assert_is_not_empty("property", property)
                assert_is_instance_of("property", property, str)
        return id, property


class Input(Channel):
    """Describes the source of a parameter value for the user-provided
    layout and callback functions.
    `Input` instances are used as arguments passed to the
    `layout` and `callback` decorators.

    An `Input` describes from which property in which state a parameter
    value is read. According state changes trigger callback invocation.

    Args:
        id:
            Either the value of a component's `id` property,
            or a special state of the form `"@<state>"`, e.g.,
            `"@app"` or `@container`.
        property:
            Name of the property of a component or state.
            To address properties in nested objects or arrays
            use a dot (`.`) to separate property names and array
            indexes.
    """

    # noinspection PyShadowingBuiltins
    def __init__(self, id: str, property: str | None = None):
        super().__init__(id, property)


class State(Input):
    """Describes the source of a parameter value for the user-provided
    layout and callback functions.
    `State` instances are used as arguments passed to the
    `layout` and `callback` decorators.

    Just like an `Input`, a `State` describes from which property in which state
    a parameter value is read, but according state changes
    will **not* trigger callback invocation.

    Args:
        id:
            Either the value of a component's `id` property,
            or a special state of the form `"@<state>"`, e.g.,
            `"@app"` or `@container`.
        property:
            Name of the property of a component or state.
            To address properties in nested objects or arrays
            use a dot (`.`) to separate property names and array
            indexes.
    """

    # noinspection PyShadowingBuiltins
    def __init__(self, id: str, property: str | None = None):
        super().__init__(id, property)


class Output(Channel):
    """Describes the target of a value returned from a user-provided
    callback function.
    `Output` instances are used as arguments passed to the
    `callback` decorators.

    An `Output` describes which property in which state should be
    updated from the returned callback value.

    Args:
        id:
            Either the value of a component's `id` property,
            or a special state of the form `"@<state>"`, e.g.,
            `"@app"` or `@container`.
        property:
            Name of the property of a component or state.
            To address properties in nested objects or arrays
            use a dot (`.`) to separate property names and array
            indexes.
            If `id` identifies a component, then `property` may
            be passed an empty string to replace components.
            and the output's value must be a component or `None`.
    """

    # noinspection PyShadowingBuiltins
    def __init__(self, id: str, property: str | None = None):
        super().__init__(id, property)
