import json
from dataclasses import dataclass
from typing import Any

import plotly.graph_objects as go

from dashipy.lib import Component


@dataclass(frozen=True)
class Plot(Component):
    figure: go.Figure | None = None

    def to_dict(self) -> dict[str, Any]:
        d = super().to_dict()
        if self.figure is not None:
            d.update(figure=self.figure.to_dict())
        else:
            d.update(figure=None)
        return d
