import plotly.graph_objects as go
from plotly.graph_objs import Layout

from dashipy.lib import Panel, Plot, Box, Button
from dashipy.context import Context


def get_panel_1(
    context: Context,
    selected_dataset: int = 0,
) -> Panel:
    dataset = context.datasets[selected_dataset]

    fig = go.Figure(layout=Layout(title=f"DS #{selected_dataset + 1}", autosize=True))
    fig.add_trace(go.Bar(x=["A", "B", "C"], y=dataset))
    plot = Plot(figure=fig)

    buttons = [
        Button(text=f"DS #{i + 1}", name="selected_dataset", value=i)
        for i in range(len(context.datasets))
    ]
    button_group = Box(
        style={
            "display": "flex",
            "flexDirection": "row",
            "padding": 4,
            "justifyContent": "center",
            "gap": 4,
        },
        components=buttons,
    )

    return Panel(
        style={"display": "flex", "flexDirection": "column"},
        components=[plot, button_group],
    )


def get_panel_2(
    context: Context,
    selected_dataset: int = 0,
) -> Panel:
    dataset = context.datasets[selected_dataset]

    fig = go.Figure(layout=Layout(title=f"DS #{selected_dataset + 1}", autosize=True))
    fig.add_trace(go.Line(x=[-1.0, 0.0, 1.0], y=dataset))
    plot = Plot(figure=fig)

    buttons = [
        Button(text=f"DS #{i + 1}", name="selected_dataset", value=i)
        for i in range(len(context.datasets))
    ]
    button_group = Box(
        style={
            "display": "flex",
            "flexDirection": "row",
            "padding": 4,
            "justifyContent": "center",
            "gap": 4,
        },
        components=buttons,
    )

    return Panel(
        style={"display": "flex", "flexDirection": "column"},
        components=[plot, button_group],
    )
