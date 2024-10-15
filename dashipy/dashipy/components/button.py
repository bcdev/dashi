from dataclasses import dataclass

from dashipy import Component


@dataclass(frozen=True)
class Button(Component):
    text: str | None = None
