from chartlets import Component, Input, State, Output
from chartlets.components import Box, Divider, Select, Checkbox, Typography

from server.context import Context
from server.panel import Panel


panel = Panel(__name__, title="Panel C")


COLORS = [(0, "red"), (1, "green"), (2, "blue"), (3, "yellow")]


@panel.layout(
    State("@app", "selectedDatasetId"),
)
def render_panel(
    ctx: Context,
    dataset_id: str = "",
) -> Component:

    opaque = False
    color = 0

    opaque_checkbox = Checkbox(
        id="opaque",
        value=opaque,
        label="Opaque",
        tooltip="Select whether the color is opaque",
    )

    color_select = Select(
        id="color",
        value=color,
        label="Color",
        options=COLORS,
        style={"flexGrow": 0, "minWidth": 80},
        tooltip="Select color",
    )

    info_text = Typography(
        id="info_text", children=update_info_text(ctx, dataset_id, opaque, color)
    )

    divider = Divider(style={"paddingTop": "10px", "paddingBottom": "10px"})

    return Box(
        style={
            "display": "flex",
            "flexDirection": "column",
            "width": "100%",
            "height": "100%",
            "gap": "6px",
        },
        children=[opaque_checkbox, color_select, divider, info_text],
    )


# noinspection PyUnusedLocal
@panel.callback(
    Input("@app", "selectedDatasetId"),
    Input("opaque"),
    Input("color"),
    State("info_text", "children"),
    Output("info_text", "children"),
)
def update_info_text(
    ctx: Context,
    dataset_id: str = "",
    opaque: bool = False,
    color: int = 0,
    info_elems: list[str] | None = None,
) -> list[str]:
    opaque = opaque or False
    color = color if color is not None else 0
    info_text = info_elems[0] if info_elems else ""
    return [
        f"The dataset is {dataset_id},"
        f" the color is {COLORS[color][1]} and"
        f" it {'is' if opaque else 'is not'} opaque."
        f" The length of the last info text"
        f" was {len(info_text)}."
    ]
