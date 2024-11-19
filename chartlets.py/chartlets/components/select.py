from dataclasses import dataclass, field

from chartlets import Component


OptionValue = str | int | float
SelectOption = OptionValue | tuple[OptionValue, str]
"""A select option is an option value or a tuple (option value, option label)"""


@dataclass(frozen=True)
class Select(Component):
    """Select components are used for collecting user provided
    information from a list of options."""

    options: list[SelectOption] = field(default_factory=list)
    """The options given as a list of (label, value) pairs."""
