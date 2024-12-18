import altair as alt
import pandas as pd
from chartlets import Component, Input, State, Output
from chartlets.components import VegaChart, Box, Select

from server.context import Context
from server.panel import Panel


panel = Panel(__name__, title="Panel B")


@panel.layout(State("@app", "selectedDatasetId"))
def render_panel(
    ctx: Context,
    selected_dataset_id: str = "",
) -> Component:
    dataset = ctx.datasets.get(selected_dataset_id)
    variable_names, var_name = get_variable_names(dataset)
    chart = VegaChart(
        id="chart",
        chart=make_chart(ctx, selected_dataset_id, var_name),
        style={"flexGrow": 1},
    )
    select = Select(
        id="selected_variable_name",
        value=var_name,
        label="Variable",
        options=[(v, v) for v in variable_names],
        style={"flexGrow": 0, "minWidth": 120},
        tooltip="Select the variable of the test dataset to be used",
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
        children=[chart, control_group],
    )


@panel.callback(
    Input("@app", "selectedDatasetId"),
    Input("selected_variable_name"),
    Output("chart", "chart"),
)
def make_chart(
    ctx: Context,
    selected_dataset_id: str | None = None,
    selected_variable_name: str | None = None,
) -> alt.Chart:
    dataset = ctx.datasets.get(selected_dataset_id)
    _, selected_variable_name = get_variable_names(dataset, selected_variable_name)
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
        # .interactive() # Using interactive mode will lead to warning
        # `WARN Scale bindings are currently only supported for scales with
        # unbinned, continuous domains.`
        # because it expects both x and y to be continuous scales,
        # but we have x as Nominal which leads to this warning.
        # This still works where we can only zoom in on the y axis but
        # with a warning.
    )
    return chart


@panel.callback(
    Input("@app", "selectedDatasetId"),
    Output("selected_variable_name", "options"),
    Output("selected_variable_name", "value"),
)
def update_variable_selector(
    ctx: Context, selected_dataset_id: str | None = None
) -> tuple[list[tuple[str, str]], str]:
    dataset = ctx.datasets.get(selected_dataset_id)
    variable_names, var_name = get_variable_names(dataset)
    return [(v, v) for v in variable_names], var_name


def get_variable_names(
    dataset: pd.DataFrame,
    prev_var_name: str | None = None,
) -> tuple[list[str], str]:
    """Get the variable names and the selected variable name
    for the given dataset and previously selected variable name.
    """

    if dataset is not None:
        var_names = [v for v in dataset.keys() if v != "x"]
    else:
        var_names = []

    if prev_var_name and prev_var_name in var_names:
        var_name = prev_var_name
    elif var_names:
        var_name = var_names[0]
    else:
        var_name = ""

    return var_names, var_name
