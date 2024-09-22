from typing import Any

import plotly.graph_objects as go

from dashipy.component import Panel, Plot, Box, Button


class Context:
    def __init__(self):
        self.datasets: dict[int, list[int]] = {
            0: [10, 20, 30],
            1: [20, 30, 10],
            2: [30, 10, 20],
        }


context = Context()


def get_panel() -> Panel:

    fig = go.Figure()
    fig.add_trace(go.Bar(x=["A", "B", "C"], y=context.datasets[0]))

    box = Box(style={"display": "flex", "flexDirection": "row"})
    box.add_component(Button(id="bt1", text="Data #1"))
    box.add_component(Button(id="bt2", text="Data #2"))
    box.add_component(Button(id="bt3", text="Data #3"))

    panel = Panel(id="panel1", style={"display": "flex", "flexDirection": "column"})
    panel.add_component(Plot(id="fig1", figure=fig))
    panel.add_component(box)

    return panel


def update_panel(event: dict[str, Any]) -> Panel | None:
    print(event)
    return None
