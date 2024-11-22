from dataclasses import dataclass

from chartlets import Component


@dataclass(frozen=True)
class Typography(Component):
    """Use typography to present your design and content as clearly
    and efficiently as possible."""

    text: str | None = None
    """Text to be displayed."""

    align: str | None = None
    """Set the text-align on the component."""

    color: str | None = None
    """The color of the component."""

    variant: str | None = None
    """Applies the theme typography styles."""

    gutterBottom: bool | None = None
    """If True, the text will have a bottom margin."""

    noWrap: bool | None = None
    """If true, the text will not wrap, but instead will 
    truncate with a text overflow ellipsis."""

    component: str | None = None
    """The HTML element used for the root node."""
