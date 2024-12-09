from dataclasses import dataclass
from typing import Any
import unittest

from chartlets import Component, Contribution, Input, Output, State, Callback, Extension

from chartlets.components import Box, Button, Typography


@dataclass(frozen=True)
class Button(Component):
    text: str = ""


class Panel(Contribution):
    pass
    # def __init__(self, name: str, **initial_state: Any):
    #     super().__init__(name, **initial_state)


panel = Panel("panel0", title="My 1st Panel")

Extension.add_contrib_point("panels", Panel)

ext = Extension("ext0")
ext.add(panel)


@panel.layout()
def render_panel(_ctx) -> Box:
    return Box(children=[Typography(id="txt", children=["Hello"]), Button(id="btn")])


@panel.callback(
    Input("btn", "clicked"), State("txt", "children"), Output("txt", "children")
)
def render_panel(_ctx: Any, _clicked: bool, old_children: list[str]) -> list[str]:
    return old_children + [" World!"]


# noinspection PyMethodMayBeStatic
class ContributionTest(unittest.TestCase):

    def test_attributes(self):
        self.assertEqual("panel0", panel.name)
        self.assertEqual("ext0", panel.extension)
        self.assertEqual(dict(title="My 1st Panel"), panel.initial_state)
        self.assertIsInstance(panel.layout_callback, Callback)
        self.assertEqual(1, len(panel.callbacks))
        self.assertIsInstance(panel.callbacks[0], Callback)

    def test_to_dict(self):
        self.assertEqual(
            {
                "name": "panel0",
                "extension": "ext0",
                "initialState": {"title": "My 1st Panel"},
                "layout": {
                    "function": {
                        "name": "render_panel",
                        "parameters": [],
                        "return": {"schema": {"class": "Box", "type": "object"}},
                    }
                },
                "callbacks": [
                    {
                        "function": {
                            "name": "render_panel",
                            "parameters": [
                                {"name": "_clicked", "schema": {"type": "boolean"}},
                                {
                                    "name": "old_children",
                                    "schema": {
                                        "items": {"type": "string"},
                                        "type": "array",
                                    },
                                },
                            ],
                            "return": {
                                "schema": {"items": {"type": "string"}, "type": "array"}
                            },
                        },
                        "inputs": [
                            {"id": "btn", "property": "clicked"},
                            {"id": "txt", "noTrigger": True, "property": "children"},
                        ],
                        "outputs": [{"id": "txt", "property": "children"}],
                    }
                ],
            },
            panel.to_dict(),
        )
