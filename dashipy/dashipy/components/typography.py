from dataclasses import dataclass

from dashipy import Component


@dataclass(frozen=True)
class Typography(Component):
    text: str | None = None
