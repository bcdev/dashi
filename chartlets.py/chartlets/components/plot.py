from dataclasses import dataclass
from typing import Any

import altair as alt

from chartlets import Component


@dataclass(frozen=True)
class Plot(Component):
    """The plot component is a container for a
    [Vega Altair](https://altair-viz.github.io/) chart."""

    chart: alt.Chart | None = None
    """The Vega Altair 
    [chart object](https://altair-viz.github.io/user_guide/generated/toplevel/altair.Chart.html)."""

    def to_dict(self) -> dict[str, Any]:
        d = super().to_dict()
        if self.chart is not None:
            d.update(chart=self.chart.to_dict())
        else:
            d.update(chart=None)
        return d
