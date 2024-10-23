from dataclasses import dataclass
from typing import Any

import altair as alt

from dashipy import Component


@dataclass(frozen=True)
class Plot(Component):
    chart: alt.Chart | None = None

    def to_dict(self) -> dict[str, Any]:
        d = super().to_dict()
        if self.chart is not None:
            d.update(chart=self.chart.to_dict())
        else:
            d.update(chart=None)
        return d
