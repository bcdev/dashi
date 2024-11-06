from abc import ABC
from typing import Any, Literal

from .util.assertions import assert_is_one_of
from .util.assertions import assert_is_instance_of


Source = Literal["component"] | Literal["container"] | Literal["app"]
Target = Literal["component"] | Literal["container"] | Literal["app"]
NoneType = type(None)


# noinspection PyShadowingBuiltins
def _validate_input(
    source: str | None, id: str | None, property: str | None
) -> tuple[str, str | None, str | None]:
    return _validate_kind("source", source, id, property)


# noinspection PyShadowingBuiltins
def _validate_output(
    target: str | None, id: str | None, property: str | None
) -> tuple[str, str | None, str | None]:
    return _validate_kind("target", target, id, property)


# noinspection PyShadowingBuiltins
def _validate_kind(
    kind_name: str, kind: str | None, id: str | None, property: str | None
) -> tuple[str, str | None, str | None]:
    assert_is_one_of(kind_name, kind, ("component", "container", "app", None))
    if not kind or kind == "component":
        assert_is_instance_of("id", id, (str, NoneType))
        assert_is_instance_of("property", id, (str, NoneType))
        kind = kind or "component"
        if property is None and id is not None:
            property = "value"
    else:
        assert_is_instance_of("id", id, NoneType)
        assert_is_instance_of("property", property, str)
    return kind, id, property


class InputOutput(ABC):
    # noinspection PyShadowingBuiltins
    def __init__(
        self,
        id: str | None = None,
        property: str | None = None,
    ):
        self.id = id
        self.property = property

    def to_dict(self) -> dict[str, Any]:
        d = {"class": self.__class__.__name__}
        d.update(
            {
                k: v
                for k, v in self.__dict__.items()
                if not k.startswith("_") and v is not None
            }
        )
        return d


class Input(InputOutput):
    """An input value read from component state.
    A component state change may trigger callback invocation.
    """

    # noinspection PyShadowingBuiltins
    def __init__(
        self,
        id: str | None = None,
        property: str | None = None,
        source: Source | None = None,
    ):
        source, id, property = _validate_input(source, id, property)
        super().__init__(id=id, property=property)
        self.source = source


class State(Input):
    """An input value read from component state.
    Does not trigger callback invocation.
    """

    # noinspection PyShadowingBuiltins
    def __init__(
        self,
        id: str | None = None,
        property: str | None = None,
        source: Source | None = None,
    ):
        super().__init__(id=id, property=property, source=source)


class Output(InputOutput):
    """Callback output."""

    # noinspection PyShadowingBuiltins
    def __init__(
        self,
        id: str | None = None,
        property: str | None = None,
        target: Target | None = None,
    ):
        target, id, property = _validate_output(target, id, property)
        super().__init__(id=id, property=property)
        self.target = target
