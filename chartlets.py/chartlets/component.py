from abc import ABC
from dataclasses import dataclass, field
from typing import Any


@dataclass(frozen=True)
class Component(ABC):
    """Base class for components.
    Provides the common attributes that apply to all components.
    """

    # Common HTML properties
    id: str | None = None
    """HTML `id` property. Required for referring to this component."""

    name: str | None = None
    """HTML `name` property. Optional."""

    value: bool | int | float | str | None = None
    """HTML `value` property. Required for specific components."""

    style: dict[str, Any] | None = None
    """HTML `style` property. Optional."""

    # We may add more here later
    #
    # Special non-HTML properties
    label: str | None = None
    """Label used by many specific components. Optional """

    children: list["Component"] | None = None
    """Children used by many specific components. Optional """

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
