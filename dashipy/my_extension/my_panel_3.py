from dashipy import Component, Input, Output
from dashipy.components import Box, Dropdown, Checkbox, Typography
from dashipy.demo.contribs import Panel
from dashipy.demo.context import Context


panel = Panel(__name__, title="Panel C")


COLORS = [("red", 0), ("green", 1), ("blue", 2), ("yellow", 3)]


@panel.layout(
    Input(property="selectedDatasetId", source="app"),
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
    )

    color_dropdown = Dropdown(
        id="color",
        value=color,
        label="Color",
        options=COLORS,
        style={"flexGrow": 0, "minWidth": 80},
    )

    info_text = Typography(
        id="info_text", text=update_info_text(ctx, dataset_id, opaque, color)
    )

    return Box(
        style={
            "display": "flex",
            "flexDirection": "column",
            "width": "100%",
            "height": "100%",
            "gap": "6px",
        },
        children=[opaque_checkbox, color_dropdown, info_text],
    )


# noinspection PyUnusedLocal
@panel.callback(
    Input("selectedDatasetId", source="app"),
    Input("opaque"),
    Input("color"),
    Output("info_text", "text"),
)
def update_info_text(
    ctx: Context,
    dataset_id: str = "",
    opaque: bool = False,
    color: int = 0,
) -> str:
    opaque = opaque or False
    color = color if color is not None else 0
    return (
        f"The dataset is {dataset_id},"
        f" the color is {COLORS[color][0]} and"
        f" it {'is' if opaque else 'is not'} opaque"
    )
