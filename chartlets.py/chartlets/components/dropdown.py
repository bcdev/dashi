from dataclasses import dataclass, field

from chartlets import Component


@dataclass(frozen=True)
class Dropdown(Component):
    """Dropdown components are used for collecting user provided
    information from a list of options."""

    options: list[tuple[str, str | int | float]] = field(default_factory=list)
    """The options given as a list of (label, value) pairs."""
