from dataclasses import dataclass, field

from chartlets import Component


OptionValue = str | int | float
SelectOption = OptionValue | tuple[OptionValue, str]
"""A select option is a number or text value or a (value, label) pair."""


@dataclass(frozen=True)
class Select(Component):
    """Select components are used for collecting user provided
    information from a list of options."""

    options: list[SelectOption] = field(default_factory=list)
    """The options given as a list of number or text values or a list
    of (value, label) pairs.
    """

    tooltip: str | None = None
    """Tooltip title. Optional."""
