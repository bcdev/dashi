from abc import ABC
from typing import Any


class Component(ABC):

    # noinspection PyShadowingBuiltins
    def __init__(
        self,
        type: str,
        *,
        # Common HTML attributes
        id: str = None,
        name: str = None,
        value: str | int | float = None,
        style: dict[str, Any] = None,
    ):
        assert bool(type)
        self.type = type
        self.id = id
        self.name = name
        self.value = value
        self.style = style

    def to_dict(self) -> dict[str, Any]:
        attrs = "type", "id", "name", "value", "style"
        data = {
            attr: getattr(self, attr)
            for attr in attrs
            if getattr(self, attr) is not None
        }
        return data
