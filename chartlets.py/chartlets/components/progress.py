from abc import ABC
from dataclasses import dataclass, field
from typing import Literal

from chartlets import Component


@dataclass(frozen=True)
class Progress(Component, ABC):
    """Progress indicators commonly known as spinners,
    express an unspecified wait time or display the length of a process.
    """

    value: int | None = None
    """Progress value in percent. Optional."""

    variant: str | None = None
    """Progress size. Example values: `"determinate"` or the default `"indeterminate"`."""


@dataclass(frozen=True)
class CircularProgress(Progress):
    """Progress indicators commonly known as spinners,
    express an unspecified wait time or display the length of a process.
    """

    size: str | int | None = None
    """Progress size. Example values: `"30px"`, `40`, `"3rem"`."""


@dataclass(frozen=True)
class CircularProgressWithLabel(CircularProgress):
    """Progress indicators commonly known as spinners,
    express an unspecified wait time or display the length of a process.
    """


@dataclass(frozen=True)
class LinearProgress(Progress):
    """Progress indicators commonly known as spinners,
    express an unspecified wait time or display the length of a process.
    """


@dataclass(frozen=True)
class LinearProgressWithLabel(LinearProgress):
    """Progress indicators commonly known as spinners,
    express an unspecified wait time or display the length of a process.
    """
