from typing import Any, Container, Type


def assert_is_one_of(name: str, value: Any, value_set: Container):
    if value not in value_set:
        raise ValueError(
            f"value of {name!r} must be one of {value_set!r}, but was {value!r}"
        )


def assert_is_instance_of(name: str, value: Any, type_set: Type | tuple[Type, ...]):
    if not isinstance(value, type_set):
        raise ValueError(
            f"value of {name!r} must be an instance of {type_set!r}, but was {value!r}"
        )
