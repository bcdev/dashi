from dataclasses import dataclass, field

from chartlets import Component


@dataclass(frozen=True)
class Radio(Component):
    """Select components are used for collecting user provided
    information from a list of options."""

    value: bool | int | float | str | None = None
    """The value of the component. 
    The DOM API casts this to a string.
    """

    label: str | None = None
    """Button label. Optional."""


@dataclass(frozen=True)
class RadioGroup(Component):
    """The Radio Group allows the user to select one option from a set.

    Use radio buttons when the user needs to see all available options.
    If available options can be collapsed, consider using a `Select`
    component because it uses less space.

    Radio buttons should have the most commonly used option selected
    by default.
    """

    children: list[Radio] = field(default_factory=list)
    """The list of radio buttons."""

    label: str | None = None
    """A label for the group. Optional"""

    tooltip: str | None = None
    """Tooltip title. Optional."""

    dense: bool | None = None
    """Dense styling with smaller radio buttons."""
