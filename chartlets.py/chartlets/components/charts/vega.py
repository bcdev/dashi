from dataclasses import dataclass
from typing import Any
import warnings

from chartlets import Component


# Respect that "altair" is an optional dependency.
class AltairDummy:
    # noinspection PyPep8Naming
    @property
    def Chart(self):
        warnings.warn("you must install 'altair' to use the VegaChart component")
        return int


try:
    # noinspection PyUnresolvedReferences
    import altair
except ImportError:
    altair = AltairDummy()


@dataclass(frozen=True)
class VegaChart(Component):
    """A container for a
    [Vega Altair](https://altair-viz.github.io/) chart.

    Note: to use this component the `altair` package
    must be available in your python environment.
    """

    theme: str | None = None
    """The name of a [Vega theme](https://vega.github.io/vega-themes/)."""

    chart: altair.Chart | None = None
    """The [Vega Altair chart](https://altair-viz.github.io/gallery/index.html)."""

    def to_dict(self) -> dict[str, Any]:
        d = super().to_dict()
        if self.chart is not None:
            d.update(chart=self.chart.to_dict())
        return d
