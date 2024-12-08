from collections.abc import Collection
from typing import Any, Container, Type


def assert_is_not_none(name: str, value: Any):
    if value is None:
        raise ValueError(f"value for {name!r} must not be None")


def assert_is_not_empty(name: str, value: Any):
    if value is None:
        raise ValueError(f"value for {name!r} must be given")
    try:
        if len(value) == 0:
            raise ValueError(f"value for {name!r} must not be empty")
    except TypeError:
        pass


def assert_is_one_of(name: str, value: Any, value_set: Container):
    if value not in value_set:
        raise ValueError(
            f"value of {name!r} must be one of {value_set!r}, but was {value!r}"
        )


def assert_is_instance_of(name: str, value: Any, type_set: Type | tuple[Type, ...]):
    if not isinstance(value, type_set):
        if isinstance(type_set, type):
            type_set = (type_set,)
        raise TypeError(
            f"value of {name!r} must be of type"
            f" {" or ".join(map(lambda t: t.__name__, type_set))}, but was {type(value).__name__}"
        )
