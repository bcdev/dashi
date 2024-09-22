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

    return Panel(
        style={"display": "flex", "flexDirection": "column"},
        components=[
            Plot(figure=fig),
            Box(
                style={
                    "display": "flex",
                    "flexDirection": "row",
                    "padding": 4,
                    "justifyContent": "center",
                    "gap": 4,
                },
                components=[
                    Button(text=f"DS #{i + 1}", name="selected_dataset", value=i)
                    for i in range(3)
                ],
            ),
        ],
    )
