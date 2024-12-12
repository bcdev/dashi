from dataclasses import dataclass

from chartlets import Component


@dataclass(frozen=True)
class Switch(Component):
    """Switches toggle the state of a single setting on or off."""

    value: bool | None = None
    """The switch value."""

    label: str = ""
    """The switch label."""
