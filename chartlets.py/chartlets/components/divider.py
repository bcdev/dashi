from dataclasses import dataclass
from typing import Literal

from chartlets import Container


@dataclass(frozen=True)
class Divider(Container):
    """The `Divider` component provides a thin,
    unobtrusive line for grouping elements to reinforce visual hierarchy.
    """

    orientation: Literal["horizontal", "vertical"] | None = None
    """The orientation. Can be `horizontal` (default) or `vertical`."""

    variant: Literal["fullWidth", "inset", "middle"] | None = None
    """The variant. One of `fullWidth ` (default), `inset`, and `middle`."""

    textAlign: Literal["left", "center", "right"] | None = None
    """Use the `textAlign` prop to align elements that are 
    wrapped by the divider. One of `left`, `center` (default), and `right`.
    """

    flexItem: bool | None = None
    """Use the `flexItem` prop to display the divider when it's being 
    used in a flex container.
    """

