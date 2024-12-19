from chartlets import Component, Input, Output
from chartlets.components import Box, Slider, Typography

from server.context import Context
from server.panel import Panel

from chartlets.components.charts.table import Table

panel = Panel(__name__, title="Panel D")


@panel.layout()
def render_panel(
    ctx: Context,
) -> Component:
    marks = [
        {
            "value": 0,
            "label": "0",
        },
        {
            "value": 20,
            "label": "20",
        },
        {
            "value": 37,
            "label": "37",
        },
        {
            "value": 100,
            "label": "100",
        },
    ]
    slider = Slider(
        id="slider", min=0, max=100, step=5, marks=marks, valueLabelDisplay="auto"
    )

    info_text = Typography(id="info_text", children=["Move the slider."])

    columns = [
        {"field": "id", "headerName": "ID"},
        {"field": "firstName", "headerName": "First Name", "width": 100},
        {"field": "lastName", "headerName": "Last Name"},
        {"field": "age", "headerName": "Age"},
    ]

    rows = [
        {"id": 1, "firstName": "John", "lastName": "Doe", "age": 30},
        {"id": 2, "firstName": "Jane", "lastName": "Smith", "age": 25},
        {"id": 3, "firstName": "Peter", "lastName": "Jones", "age": 40},
    ]

    table = Table(id="table", rows=rows, columns=columns, checkboxSelection=True)

    table_text = Typography(
        id="table_text", children=["Click on any row in " "the table."]
    )

    return Box(
        style={
            "display": "flex",
            "flexDirection": "column",
            "width": "100%",
            "height": "100%",
            "gap": "6px",
        },
        children=[slider, info_text, table, table_text],
    )


# noinspection PyUnusedLocal
@panel.callback(
    Input("slider"),
    Input("table"),
    Output("info_text", "children"),
    Output("table_text", "children"),
)
def update_info_text(ctx: Context, slider: int, table) -> tuple[str, str]:
    slider = slider or 0
    return f"The value is {slider}.", f"The selected row is {table}."
