from abc import ABC
from dataclasses import dataclass
from typing import Any, Union


@dataclass(frozen=True)
class Component(ABC):
    """Base class for components.
    Provides the common attributes that apply to all components.
    """

    # Common HTML properties
    # See https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes
    # TODO: Enhance set of supported HTML attributes

    id: str | None = None
    """HTML `id` attribute. Required for referring to this component."""

    name: str | None = None
    """HTML `name` attribute. Optional."""

    value: bool | int | float | str | None = None
    """HTML `value` attribute. Required for specific components."""

    style: dict[str, Any] | None = None
    """HTML `style` attribute. Optional."""

    disabled: bool | None = None
    """HTML `disabled` attribute. Optional."""

    label: str | None = None
    """HTML `label` attribute. Optional."""

    color: str | None = None
    """HTML `color` attribute. Optional."""

    children: list[Union["Component", str, None]] | None = None
    """Children used by many specific components. Optional."""

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
            d.update(
                children=list(
                    (c.to_dict() if isinstance(c, Component) else c)
                    for c in self.children
                )
            )
        return d
