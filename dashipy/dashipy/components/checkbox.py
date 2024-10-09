from dataclasses import dataclass, field

from dashipy.lib import Component


@dataclass(frozen=True)
class Checkbox(Component):
    value: bool | None = None
    label: str = ""
