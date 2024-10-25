import altair as alt

from dashipy import Component, Input, Output
from dashipy.components import Plot, Box, Dropdown
from dashipy.demo.contribs import Panel
from dashipy.demo.context import Context


panel = Panel(__name__, title="Panel B")


@panel.layout(Input(kind="AppState", property="selectedDatasetId"))
def render_panel(
    ctx: Context,
    selected_dataset_id: str = None,
) -> Component:

    dataset = ctx.datasets.get(selected_dataset_id)
    if dataset is not None:
        variable_names = [v for v in dataset.keys() if v != "x"]
        selected_variable_name = variable_names[0]
    else:
        variable_names = []
        selected_variable_name = None

    plot = Plot(
        id="plot",
        chart=make_figure(ctx, selected_dataset_id, selected_variable_name),
        style={"flexGrow": 1},
    )
    dropdown = Dropdown(
        id="selected_variable_name",
        value=selected_variable_name,
        label="Variable",
        options=[(variable_name, variable_name) for variable_name in variable_names],
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
    Input(kind="AppState", property="selectedDatasetId"),
    Input("selected_variable_name"),
    Output("plot", "chart"),
)
def make_figure(
    ctx: Context, selected_dataset_id: str = None, selected_variable_name: str = None
) -> alt.Chart:
    dataset = ctx.datasets.get(selected_dataset_id)

    slider = alt.binding_range(min=0, max=100, step=1, name="Cutoff ")
    selector = alt.param(name="SelectorName", value=50, bind=slider)
    # Almost same as the chart in Panel 1, but here we use the Shorthand
    # notation for setting x,y and the tooltip, although they both give the
    # same output. We also call interactive() on this chart object which allows
    # to zoom in and out as well as move the chart around.
    chart = (
        alt.Chart(dataset)
        .mark_bar()
        .encode(
            x="x:N",
            y=f"{selected_variable_name}:Q",
            tooltip=["x:N", f"{selected_variable_name}:Q"],
            color=alt.condition(
                f"datum.{selected_variable_name} < SelectorName",
                alt.value("green"),
                alt.value("yellow"),
            ),
        )
        .properties(width=300, height=300, title="Vega charts using Shorthand syntax")
        .add_params(selector)
        .interactive()
    )
    return chart
