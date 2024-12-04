from dataclasses import dataclass
from typing import Any

import altair as alt

from chartlets import Component


@dataclass(frozen=True)
class Plot(Component):
    """The plot component is a container for a
    [Vega Altair](https://altair-viz.github.io/) chart."""

    theme: str | None = None
    """The name of a [Vega theme](https://vega.github.io/vega-themes/)."""

    chart: alt.Chart | None = None
    """The [Vega Altair chart](https://altair-viz.github.io/gallery/index.html)."""

    def to_dict(self) -> dict[str, Any]:
        d = super().to_dict()
        if self.chart is not None:
            d.update(chart=self.chart.to_dict())
        return d
