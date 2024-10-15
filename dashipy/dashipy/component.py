from abc import ABC
from dataclasses import dataclass, field
from typing import Any


@dataclass(frozen=True)
class Component(ABC):
    # Common HTML properties
    id: str | None = None
    name: str | None = None
    value: bool | int | float | str | None = None
    style: dict[str, Any] | None = None
    # We may add more here later
    #
    # Special non-HTML properties
    label: str | None = None
    children: list["Component"] | None = None

    @property
    def type(self):
        return self.__class__.__name__

    def to_dict(self) -> dict[str, Any]:
        d = dict(type=self.type)
        d.update(
            {
                attr_name: attr_value
                for attr_name, attr_value in self.__dict__.items()
                if attr_value is not None
                and attr_name
                and attr_name != "children"
                and not attr_name.startswith("_")
            }
        )
        if self.children is not None:
            # Note we use "components" instead of "children" in order
            # to avoid later problems with React component's "children"
            # property
            d.update(components=list(c.to_dict() for c in self.children))
        return d
