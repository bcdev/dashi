import json
from dataclasses import dataclass
from typing import Any

from plotly.graph_objs import Figure
import plotly.graph_objects as go

from dashipy.utils.jsonencoder import NumpyJSONEncoder


@dataclass()
class PlotFigure(Figure):
    figure: go.Figure | None = None
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def to_dict(self) -> dict[str, Any]:
        print("to_dict called here:::figure")
        d = super().to_dict()
        print("d", d)
        print("self.figure", self.figure)
        if self.figure:
            print("about to call to_json()")
            # d.update(figure= json.dumps(self.figure, cls=NumpyJSONEncoder))
            d.update(figure=json.loads(self.figure.to_json()))
        return d

