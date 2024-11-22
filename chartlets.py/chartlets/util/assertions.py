from typing import Any, Container, Type


def assert_is_one_of(name: str, value: Any, value_set: Container):
    if value not in value_set:
        raise ValueError(
            f"value of {name!r} must be one of {value_set!r}, but was {value!r}"
        )


def assert_is_instance_of(name: str, value: Any, type_set: Type | tuple[Type, ...]):
    if not isinstance(value, type_set):
        raise TypeError(
            f"value of {name!r} must be an instance of {type_set!r}, but was {value!r}"
        )


def assert_is_none(name: str, value: Any):
    if value is not None:
        raise TypeError(f"value of {name!r} must be None, but was {value!r}")


def assert_is_given(name: str, value: Any):
    if not value:
        raise ValueError(f"value for {name!r} must be given")
