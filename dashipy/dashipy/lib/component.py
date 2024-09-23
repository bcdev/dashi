from abc import ABC
from typing import Any


class Component(ABC):

    # noinspection PyShadowingBuiltins
    def __init__(
        self,
        type: str,
        *,
        # Common data model
        name: str | None = None,
        value: Any = None,
        # Common HTML attributes
        id: str | None = None,
        style: dict[str, Any] | None = None,
    ):
        self.type = type
        self.name = name
        self.value = value
        self.id = id
        self.style = style

    def to_dict(self) -> dict[str, Any]:
        attrs = "type", "name", "id", "style"
        data = {
            attr: getattr(self, attr)
            for attr in attrs
            if getattr(self, attr) is not None
        }
        # "value is included only if "name" is given
        if "name" in data:
            data["value"] = self.value
        return data
