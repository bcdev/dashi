from dataclasses import dataclass, field

from chartlets import Component


@dataclass(frozen=True)
class Tabs(Component):
    """Select components are used for collecting user provided
    information from a list of options."""

    value: int | None = None
    """The currently selected tab index."""

    titles: list[str] = field(default_factory=list)
    """The list of tab titles."""
