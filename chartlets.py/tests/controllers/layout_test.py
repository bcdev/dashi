import unittest

from chartlets import Input, Response, State
from chartlets import Contribution, Extension, ExtensionContext
from chartlets.components import Checkbox
from chartlets.controllers import get_layout


class Panel(Contribution):
    pass


Extension.add_contrib_point("panels", Panel)

panel = Panel("my_panel")


@panel.layout(State("@app", "selected"))
def render_layout(ctx, selected):
    return Checkbox("x", label="Selected", value=selected)


panel_wo_layout = Panel("my_panel_wo_layout")

ext = Extension("my_ext")
ext.add(panel)
ext.add(panel_wo_layout)


class GetLayoutTest(unittest.TestCase):

    def test_success_empty(self):
        app_ctx = object()
        ext_ctx = ExtensionContext(app_ctx, [ext])
        response = get_layout(ext_ctx, "panels", 0, {"inputValues": []})
        self.assertIsInstance(response, Response)
        self.assertEqual(200, response.status)
        self.assertEqual(
            {"type": "Checkbox", "id": "x", "label": "Selected"},
            response.data,
        )

    def test_success_non_empty(self):
        app_ctx = object()
        ext_ctx = ExtensionContext(app_ctx, [ext])
        response = get_layout(ext_ctx, "panels", 0, {"inputValues": [True]})
        self.assertIsInstance(response, Response)
        self.assertEqual(200, response.status)
        self.assertEqual(
            {"type": "Checkbox", "id": "x", "label": "Selected", "value": True},
            response.data,
        )

    def test_invalid_contrib_point(self):
        app_ctx = object()
        ext_ctx = ExtensionContext(app_ctx, [ext])
        response = get_layout(ext_ctx, "menus", 1, {"inputValues": [True]})
        self.assertIsInstance(response, Response)
        self.assertEqual(404, response.status)
        self.assertEqual("contribution point 'menus' not found", response.reason)

    def test_invalid_contrib_index(self):
        app_ctx = object()
        ext_ctx = ExtensionContext(app_ctx, [ext])
        response = get_layout(ext_ctx, "panels", 15, {"inputValues": [True]})
        self.assertIsInstance(response, Response)
        self.assertEqual(404, response.status)
        self.assertEqual(
            "index range of contribution point 'panels' is 0 to 1, got 15",
            response.reason,
        )

    def test_no_layout(self):
        app_ctx = object()
        ext_ctx = ExtensionContext(app_ctx, [ext])
        response = get_layout(ext_ctx, "panels", 1, {"inputValues": [True]})
        self.assertIsInstance(response, Response)
        self.assertEqual(400, response.status)
        self.assertEqual(
            "contribution 'my_panel_wo_layout' has no layout", response.reason
        )
