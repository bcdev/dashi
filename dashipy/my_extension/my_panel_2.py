import altair as alt

from dashipy import (Component, Input, Output)
from dashipy.components import (Plot, Box, Dropdown)
from dashipy.demo.contribs import Panel
from dashipy.demo.context import Context


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
def make_figure(ctx: Context, selected_dataset: int = 0) -> alt.Chart:
    dataset = ctx.datasets[selected_dataset]
    slider = alt.binding_range(min=0, max=100, step=1, name='Cutoff ')
    selector = alt.param(name='SelectorName', value=50, bind=slider)
    fig = alt.Chart(dataset).mark_bar().encode(
        x='a:N',
        y='b:Q',
        tooltip=['a:N','b:Q'],
        color = alt.condition(
            'datum.b < SelectorName',
            alt.value('green'),
            alt.value('yellow')
        )
    ).properties(
    width=300,
    height=300,
    title="Vega charts using Shorthand syntax"
    ).add_params(
        selector,
    ).interactive()
    return fig

