from dataclasses import dataclass

from chartlets import Component


@dataclass(frozen=True)
class Button(Component):
    """Buttons allow users to take actions, and make choices,
    with a single tap."""

    text: str | None = None
    """The button text."""

    startIcon: str | None = None
    """The button's start icon. Must be a name supported by the app's UI."""

    endIcon: str | None = None
    """The button's end icon. Must be a name supported by the app's UI."""

    color: str | None = None
    """The button color. 
    One of "inherit" | "primary" | "secondary" | "success" | "error" | 
    "info" | "warning". Defaults to "primary".
    """

    variant: str | None = None
    """The button variant. 
    One "contained" | "outlined" | "text". Defaults to "text".
    """

    tooltip: str | None = None
    """Tooltip title. Optional."""


@dataclass(frozen=True)
class IconButton(Component):
    """Icon buttons are commonly found in app bars and toolbars.
    Icons are also appropriate for toggle buttons that allow a
    single choice to be selected or deselected, such as adding
    or removing a star to an item.
    """

    icon: str | None = None
    """The button's icon. Must be a name supported by the app's UI."""

    color: str | None = None
    """The button color. 
    One of "inherit" | "primary" | "secondary" | "success" | "error" | 
    "info" | "warning". Defaults to "primary".
    """

    variant: str | None = None
    """The button variant. 
    One "contained" | "outlined" | "text". Defaults to "text".
    """

    tooltip: str | None = None
    """Tooltip title. Optional."""
