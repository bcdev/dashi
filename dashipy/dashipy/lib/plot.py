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
            **self.figure.to_dict(),
        }
