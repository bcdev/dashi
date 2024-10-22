from dataclasses import dataclass
from typing import Any

import altair as alt

from dashipy import Component


@dataclass(frozen=True)
class Plot(Component):
    figure: alt.Chart | None = None

    def to_dict(self) -> dict[str, Any]:
        d = super().to_dict()
        if self.figure is not None:
            d.update(figure=self.figure.to_dict())
        else:
            d.update(figure=None)
        return d
