from dataclasses import dataclass

from chartlets import Component


@dataclass(frozen=True)
class Button(Component):
    """Buttons allow users to take actions, and make choices,
    with a single tap."""

    text: str | None = None
    """The button text."""
