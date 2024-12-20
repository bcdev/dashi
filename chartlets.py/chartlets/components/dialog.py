from dataclasses import dataclass, field
from typing import Literal, Any

from chartlets import Container


@dataclass(frozen=True)
class Dialog(Container):
    """A modal dialog that presents content and actions in a focused interface."""

    open: bool = field(default=False)
    """Controls whether the dialog is open."""

    title: str | None = None
    """The title of the dialog."""

    titleProps: dict[str, Any] | None = None
    """Additional properties for the dialog title. Can include 
    typography-related attributes. 
    https://mui.com/material-ui/api/dialog-title/"""

    content: str | None = None
    """The content of the dialog."""

    contentProps: dict[str, Any] | None = None
    """Additional properties for the dialog content. Can include 
    typography-related attributes. 
    https://mui.com/material-ui/api/dialog-content-text/"""

    disableEscapeKeyDown: bool | None = None
    """If true, pressing the Escape key does not close the dialog."""

    fullScreen: bool | None = None
    """If true, the dialog will be displayed in full-screen mode."""

    fullWidth: bool | None = None
    """If true, the dialog will take up the full width of the screen."""

    maxWidth: Literal["xs", "sm", "md", "lg", "xl", False] | str | None = None
    """The maximum width of the dialog."""

    scroll: Literal["body", "paper"] | None = None
    """Determines the scroll behavior of the dialog's content."""

    ariaLabel: str | None = None
    """Defines a string value that labels the dialog for accessibility."""

    ariaDescribedBy: str | None = None
    """Defines the ID of an element that describes the dialog for 
    accessibility."""
