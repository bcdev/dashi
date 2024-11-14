from abc import ABC
from typing import Any, Literal

from .util.assertions import assert_is_instance_of
from .util.assertions import assert_is_none
from .util.assertions import assert_is_one_of


Link = Literal["component"] | Literal["container"] | Literal["app"]


class Channel(ABC):
    """Base class for `Input`, `State`, and `Output`.
    Instances are used as argument passed to
    the `layout` and `callback` decorators.
    """

    # noinspection PyShadowingBuiltins
    def __init__(
        self,
        link: Link | None = None,
        id: str | None = None,
        property: str | None = None,
    ):
        self.link = link
        self.id = id
        self.property = property

    def to_dict(self) -> dict[str, Any]:
        d = {
            k: v
            for k, v in self.__dict__.items()
            if not k.startswith("_") and v is not None
        }
        if self.no_trigger:
            d |= dict(noTrigger=True)
        return d

    @property
    def no_trigger(self):
        return isinstance(self, State)


class Input(Channel):
    """Describes the source of a parameter value for the user-provided
    layout and callback functions.
    `Input` instances are used as arguments passed to the
    `layout` and `callback` decorators.

    An `Input` describes from which property in which state a parameter
    value is read. According state changes trigger callback invocation.

    Args:
        id:
            Value of a component's "id" property.
            Used only if `source` is `"component"`.
        property:
            Name of the property of a component or state.
            To address properties in nested objects or arrays
            use a dot (`.`) to separate property names and array
            indexes.
        source: One of `"component"` (the default), `"container"`,
            or `"app"`.
    """

    # noinspection PyShadowingBuiltins
    def __init__(
        self,
        id: str | None = None,
        property: str | None = None,
        source: Link | None = None,
    ):
        link, id, property = _validate_input_params(source, id, property)
        super().__init__(link=link, id=id, property=property)


class State(Input):
    """Describes the source of a parameter value for the user-provided
    layout and callback functions.
    `State` instances are used as arguments passed to the
    `layout` and `callback` decorators.

    Just like an `Input`, a `State` describes from which property in which state
    a parameter value is read, but according state changes
    will **not*Ü* trigger callback invocation.

    Args:
        id:
            Value of a component's "id" property.
            Used only if `source` is `"component"`.
        property:
            Name of the property of a component or state.
            To address properties in nested objects or arrays
            use a dot (`.`) to separate property names and array
            indexes.
        source: One of `"component"` (the default), `"container"`,
            or `"app"`.
    """

    # noinspection PyShadowingBuiltins
    def __init__(
        self,
        id: str | None = None,
        property: str | None = None,
        source: Link | None = None,
    ):
        super().__init__(id=id, property=property, source=source)


class Output(Channel):
    """Describes the target of a value returned from a user-provided
    callback function.
    `Output` instances are used as arguments passed to the
    `callback` decorators.

    An `Output` describes which property in which state should be
    updated from the returned callback value.

    Args:
        id:
            Value of a component's "id" property.
            Used only if `source` is `"component"`.
        property:
            Name of the property of a component or state.
            To address properties in nested objects or arrays
            use a dot (`.`) to separate property names and array
            indexes.
        target: One of `"component"` (the default), `"container"`,
            or `"app"`.
    """

    # noinspection PyShadowingBuiltins
    def __init__(
        self,
        id: str | None = None,
        property: str | None = None,
        target: Link | None = None,
    ):
        target, id, property = _validate_output_params(target, id, property)
        super().__init__(link=target, id=id, property=property)


NoneType = type(None)


# noinspection PyShadowingBuiltins
def _validate_input_params(
    source: Link | None, id: str | None, property: str | None
) -> tuple[Link, str | None, str | None]:
    return _validate_params("source", source, id, property)


# noinspection PyShadowingBuiltins
def _validate_output_params(
    target: Link | None, id: str | None, property: str | None
) -> tuple[Link, str | None, str | None]:
    return _validate_params("target", target, id, property)


# noinspection PyShadowingBuiltins
def _validate_params(
    link_name: str, link: Link | None, id: str | None, property: str | None
) -> tuple[Link, str | None, str | None]:
    assert_is_one_of(link_name, link, ("component", "container", "app", None))
    if not link or link == "component":
        assert_is_instance_of("id", id, (str, NoneType))
        assert_is_instance_of("property", id, (str, NoneType))
        link = link or "component"
        if property is None and id is not None:
            property = "value"
    else:
        assert_is_none("id", id)
        assert_is_instance_of("property", property, str)
    # noinspection PyTypeChecker
    return link, id, property
