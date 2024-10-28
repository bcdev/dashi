import altair as alt

from dashipy import Component, Input, Output
from dashipy.components import Plot, Box, Dropdown
from dashipy.demo.contribs import Panel
from dashipy.demo.context import Context


panel = Panel(__name__, title="Panel B")


@panel.layout()
def render_panel(ctx: Context) -> Component:
    selected_dataset: int = 0
    plot = Plot(
        id="plot", chart=make_figure(ctx, selected_dataset), style={"flexGrow": 1}
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
    Output("plot", "chart"),
)
def make_figure(ctx: Context, selected_dataset: int = 0) -> alt.Chart:
    dataset = ctx.datasets[selected_dataset]
    # Almost same as the chart in Panel 1, but here we use the Shorthand
    # notation for setting x,y and the tooltip, although they both give the
    # same output.
    chart = (
        alt.Chart(dataset)
        .mark_point()
        .encode(
            x="a:N",
            y="b:Q",
            tooltip=["a:N", "b:Q"],
        )
        .properties(
            width=300,
            height=300,
            title="Vega charts using Shorthand syntax",
        )
    )
    return chart
