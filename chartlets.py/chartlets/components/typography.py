from dataclasses import dataclass

from chartlets import Component


@dataclass(frozen=True)
class Typography(Component):
    """Use typography to present your design and content as clearly
    and efficiently as possible."""

    text: str | None = None
    """Optional text to be displayed."""

    color: str | None = None
    """The color of the component."""

    variant: str | None = None
    """Applies the theme typography styles."""
