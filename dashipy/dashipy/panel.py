from typing import Any

import plotly.graph_objects as go
from plotly.graph_objs import Layout

from dashipy.component import Panel, Plot, Box, Button
from dashipy.context import Context


def get_panel(
    context: Context,
    selected_dataset: int = 0,
) -> Panel:
    dataset = context.datasets[selected_dataset]

    fig = go.Figure(layout=Layout(title=f"DS #{selected_dataset + 1}", autosize=True))
    fig.add_trace(go.Bar(x=["A", "B", "C"], y=dataset))

    box = Box(style={"display": "flex", "flexDirection": "row"})
    box.add(Button(text="DS #1", name="selected_dataset", value=0))
    box.add(Button(text="DS #2", name="selected_dataset", value=1))
    box.add(Button(text="DS #3", name="selected_dataset", value=2))

    panel = Panel(style={"display": "flex", "flexDirection": "column"})
    panel.add(Plot(figure=fig))
    panel.add(box)

    return panel
