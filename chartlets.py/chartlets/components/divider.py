from dataclasses import dataclass

from chartlets import Container


@dataclass(frozen=True)
class Divider(Container):
    """The Divider component provides a thin,
    unobtrusive line for grouping elements to reinforce visual hierarchy.
    """

    label: str | None = None
    """The text label."""

    orientation: str | None = None
    """The orientation. Can be `horizontal` (default) or `vertical`."""

    variant: str | None = None
    """The variant. One of `fullWidth ` (default), `inset`, and `middle`."""

    flexItem: bool | None = None
    """Use the `flexItem` prop to display the divider when it's being 
    used in a flex container.
    """

    textAlign: str | None = None
    """Use the `textAlign` prop to align elements that are 
    wrapped by the divider. One of `center` (default), `left`, and `right`.
    """
