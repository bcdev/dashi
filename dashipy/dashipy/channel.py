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
    """An input value read from component state.
    A component state change may trigger callback invocation.
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
    """An input value read from component state.
    Does not trigger callback invocation.
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
    """Callback output."""

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
