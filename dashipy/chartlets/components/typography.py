from dataclasses import dataclass

from chartlets import Component


@dataclass(frozen=True)
class Typography(Component):
    text: str | None = None
