import json
from typing import Any

import plotly.graph_objects as go

from .component import Component


class Plot(Component):

    # noinspection PyShadowingBuiltins
    def __init__(
        self,
        figure: go.Figure,
        # Common HTML attributes
        id: str | None = None,
    ):
        super().__init__("plot", id=id)
        self.figure = figure

    def to_dict(self) -> dict[str, Any]:
        return {
            **super().to_dict(),
            # TODO: this is stupid, but if using self.figure.to_dict()
            #   for plotly.express figures we get
            #   TypeError: Object of type ndarray is not JSON serializable
            **json.loads(self.figure.to_json()),
            # **self.figure.to_dict(),
        }
