import plotly.express as pe
import plotly.graph_objects as go

from dashipy.components import Plot, Box, Dropdown
from dashipy.components.figure import PlotFigure
from dashipy.contribs import Panel
from dashipy.context import Context
from dashipy.lib import Output, Input, Component


panel = Panel(__name__, title="Panel B")


@panel.layout()
def render_panel(ctx: Context) -> Component:
    selected_dataset: int = 0
    plot = Plot(
        id="plot", figure=make_figure(ctx, selected_dataset), style={"flexGrow": 1}
    )
    dropdown = Dropdown(
        id="selected_dataset",
        value=selected_dataset,
        label="Dataset",
        options=[(f"DS #{i + 1}", i) for i in range(len(ctx.datasets))],
        style={"flexGrow": 0, "minWidth": 120},
    )
    control_group = Box(
        style={
            "display": "flex",
            "flexDirection": "row",
            "padding": 4,
            "justifyContent": "center",
            "gap": 4,
        },
        children=[dropdown],
    )
    return Box(
        style={
            "display": "flex",
            "flexDirection": "column",
            "width": "100%",
            "height": "100%",
        },
        children=[plot, control_group],
    )


@panel.callback(
    Input("selected_dataset"),
    Output("plot", "figure"),
)
def make_figure(ctx: Context, selected_dataset: int) -> PlotFigure:
    dataset = ctx.datasets[selected_dataset]
    line = pe.line(x=[-1.0, 0.0, 1.0], y=dataset, title=f"DS #{selected_dataset + 1}")
    line.update_layout(dict(margin=dict(t=40, r=4, b=4, l=4), autosize=True))
    return PlotFigure(line)
