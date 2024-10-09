import json
from dataclasses import dataclass
from typing import Any

import plotly.graph_objects as go

from dashipy.lib import Component


@dataclass(frozen=True)
class Plot(Component):
    figure: go.Figure | None = None

    def to_dict(self) -> dict[str, Any]:
        print("to_dict called here:::plot")
        d = super().to_dict()
        if self.figure is not None:
            # TODO: this is stupid, but if using self.figure.to_dict()
            #   for plotly.express figures we get
            #   TypeError: Object of type ndarray is not JSON serializable
            d.update(figure=json.loads(self.figure.to_json()))
        else:
            d.update(figure=None)
        return d
