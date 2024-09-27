from dataclasses import dataclass

from dashipy.lib import Component


@dataclass(frozen=True)
class Button(Component):
    text: str = ""
    n_clicks: int = 0
