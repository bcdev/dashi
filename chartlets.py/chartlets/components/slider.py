from dataclasses import dataclass
from typing import Literal, TypedDict, Callable

from chartlets import Component


@dataclass(frozen=True)
class Slider(Component):
    """Sliders allow users to make selections from a range of values along a
    bar."""

    aria_label: str | None = None
    """The label of the slider."""

    color: str | None = None
    """The color of the component. It supports both default and custom theme 
    colors
    """

    defaultValue: list[int] | int | None = None
    """The default value. Use when the component is not controlled. If used 
    as an array, it will create multiple sliding points on the bar
    """

    disableSwap: bool | None = None
    """If true, the active thumb doesn't swap when moving pointer over a thumb 
    while dragging another thumb.
    """

    getAriaValueText: Callable[[int, int], str] | None = None
    """Accepts a function which returns a string value that provides a 
    user-friendly name for the current value of the slider. This is important 
    for screen reader users.
        
    Signature:
    function(value: number, index: number) => string

    value: The thumb label's value to format.
    index: The thumb label's index to format.
    """

    min: int | None = None
    """The minimum allowed value of the slider. Should not be equal to max."""

    max: int | None = None
    """The maximum allowed value of the slider. Should not be equal to min."""

    marks: (bool |
            list[TypedDict("marks", {"value": int, "label": str})] |
            None) = None
    """Marks indicate predetermined values to which the user can move the 
    slider. If  true the marks are spaced according the value of the step 
    prop. If an array, it should contain objects with value and an optional 
    label keys.
    """

    orientation: Literal["horizontal", "vertical"] | None = None
    """The component orientation."""

    step: int | None = None
    """The granularity with which the slider can step through values. (A 
    "discrete" slider.) The min prop serves as the origin for the valid values. 
    We recommend (max - min) to be evenly divisible by the step. When step is 
    null, the thumb can only be slid onto marks provided with the marks prop.
    """

    size: str | None = None
    """The size of the slider."""

    tooltip: str | None = None
    """Tooltip title. Optional."""

    track: Literal["inverted", "normal"] | False | None = None
    """The track presentation:

    `normal`: the track will render a bar representing the slider value.
    `inverted`: the track will render a bar representing the remaining slider 
    value.
    `false`: the track will render without a bar.
    """

    value: list[int] | int | None = None
    """The value of the slider. For ranged sliders, provide an array with two 
    values.
    """

    valueLabelDisplay: Literal['auto', 'on', 'off'] | None = None
    """Controls when the value label is displayed:

    `auto` the value label will display when the thumb is hovered or focused.
    `on` will display persistently.
    `off` will never display.
    """
