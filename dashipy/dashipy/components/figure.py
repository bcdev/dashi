from typing import Any
from dataclasses import dataclass

from plotly.graph_objs import Figure

from dashipy.utils.json import convert_ndarray_to_list


@dataclass()
class PlotFigure(Figure):
    figure: Figure | None = None

    def __init__(self, figure: Figure = None, **kwargs):
        if figure:
            super().__init__(**figure.to_dict())
            self.figure = figure
        else:
            super().__init__(**kwargs)

    def to_dict(self) -> dict[str, Any]:
        if self.figure:
            d = self.figure.to_plotly_json()
        else:
            d = super().to_dict()  # For graph_objects-based figures
        return convert_ndarray_to_list(d)
