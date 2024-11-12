from dataclasses import dataclass

from chartlets import Component


@dataclass(frozen=True)
class Button(Component):
    text: str | None = None
