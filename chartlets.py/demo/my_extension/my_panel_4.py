from chartlets import Component, Input, State, Output
from chartlets.components import Box, Slider, Typography

from server.context import Context
from server.panel import Panel


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

    return Box(
        style={
            "display": "flex",
            "flexDirection": "column",
            "width": "100%",
            "height": "100%",
            "gap": "6px",
        },
        children=[slider, info_text],
    )


# noinspection PyUnusedLocal
@panel.callback(Input("slider"), Output("info_text", "children"))
def update_info_text(
    ctx: Context,
    slider: int,
) -> list[str]:
    slider = slider or 0
    return [f"The value is {slider}."]
