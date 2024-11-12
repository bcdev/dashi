from dataclasses import dataclass

from chartlets import Component


@dataclass(frozen=True)
class Checkbox(Component):
    value: bool | None = None
    label: str = ""
