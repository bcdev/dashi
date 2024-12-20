from chartlets import Component, Input, Output
from chartlets.components import Box, Button, Dialog, Typography

from server.context import Context
from server.panel import Panel

panel = Panel(__name__, title="Panel E")


# noinspection PyUnusedLocal
@panel.layout()
def render_panel(
    ctx: Context,
) -> Component:
    open_button = Button(id="open_button", text="Open Dialog")
    okay_button = Button(id="okay_button", text="Okay")
    not_okay_button = Button(id="not_okay_button", text="Not okay")
    dialog = Dialog(
        id="dialog",
        title="This is a modal dialog",
        titleProps={
            "id": "dialog-title",
            "variant": "h6",
            "style": {"fontWeight": "bold", "color": "darkblue"},
        },
        content="You can add your content here in the dialog.",
        contentProps={
            "id": "dialog-description",
            "variant": "body1",
            "style": {"padding": "16px", "color": "gray"},
        },
        children=[okay_button, not_okay_button],
        disableEscapeKeyDown=True,
        fullScreen=False,
        fullWidth=True,
        maxWidth="sm",
        scroll="paper",
        ariaLabel="dialog-title",
        ariaDescribedBy="dialog-description",
    )

    info_text = Typography(id="info_text")

    return Box(
        style={
            "display": "flex",
            "flexDirection": "column",
            "width": "100%",
            "height": "100%",
            "gap": "6px",
        },
        children=[open_button, dialog, info_text],
    )


# noinspection PyUnusedLocal
@panel.callback(Input("open_button", "clicked"), Output("dialog", "open"))
def dialog_on_open(ctx: Context, button) -> bool:
    return True


# noinspection PyUnusedLocal
@panel.callback(
    Input("okay_button", "clicked"),
    Output("dialog", "open"),
    Output("info_text", "children"),
)
def dialog_on_close(ctx: Context, button) -> tuple[bool, list[str]]:
    return False, ["Okay button was clicked!"]


# noinspection PyUnusedLocal
@panel.callback(
    Input("not_okay_button", "clicked"),
    Output("dialog", "open"),
    Output("info_text", "children"),
)
def dialog_on_close(ctx: Context, button) -> tuple[bool, list[str]]:
    return False, ["Not okay button was clicked!"]
