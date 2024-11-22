import altair as alt

from chartlets import Component, Input, Output
from chartlets.components import Plot, Box, Select
from chartlets.demo.contribs import Panel
from chartlets.demo.context import Context


panel = Panel(__name__, title="Panel A")


@panel.layout()
def render_panel(ctx: Context) -> Component:
    selected_dataset: int = 0
    plot = Plot(
        id="plot", chart=make_figure(ctx, selected_dataset), style={"flexGrow": 1}
    )
    select = Select(
        id="selected_dataset",
        value=selected_dataset,
        label="Dataset",
        options=[(i, f"DS #{i + 1}") for i in range(len(ctx.datasets))],
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
        children=[select],
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
    dataset_key = tuple(ctx.datasets.keys())[selected_dataset]
    dataset = ctx.datasets[dataset_key]

    variable_name = "a" if selected_dataset == 0 else "u"

    # Create a slider
    corner_slider = alt.binding_range(min=0, max=50, step=1)
    # Create a parameter and bind that to the slider
    corner_var = alt.param(bind=corner_slider, value=0, name="cornerRadius")
    # Create another parameter to handle the click events and send the data as
    # specified in the fields
    click_param = alt.selection_point(
        on="click", name="onClick", fields=["x", variable_name]
    )
    # Create a chart type using mark_* where * could be any kind of chart
    # supported by Vega. We can add properties and parameters as shown below.
    chart = (
        alt.Chart(dataset)
        .mark_bar(cornerRadius=corner_var)
        .encode(
            x=alt.X("x:N", title="x"),
            y=alt.Y(f"{variable_name}:Q", title=variable_name),
            tooltip=[
                alt.Tooltip("x:N"),
                alt.Tooltip(f"{variable_name}:Q"),
            ],
            color=f"{variable_name}:Q",
        )
        .properties(width=290, height=300, title="Vega charts")
        .add_params(corner_var, click_param)
    )

    return chart
