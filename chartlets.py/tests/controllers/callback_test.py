import unittest

from chartlets import Input, Response, State, Output
from chartlets import Contribution, Extension, ExtensionContext
from chartlets.components import Checkbox
from chartlets.controllers import get_callback_results


class Panel(Contribution):
    pass


Extension.add_contrib_point("panels", Panel)

panel = Panel("my_panel")


@panel.layout(State("@app", "selected"))
def render_layout(ctx, selected):
    return Checkbox("sel", value=selected)


@panel.callback(Input("@app", "selected"), Output("sel"))
def adjust_selection(ctx, selected):
    return selected


@panel.callback(Input("@app", "num_items"), Output("sel", "disabled"))
def disable_selector(ctx, num_items):
    return num_items == 0


panel_wo_callback = Panel("my_panel_wo_callback")

ext = Extension("my_ext")
ext.add(panel)
ext.add(panel_wo_callback)


class GetCallbackResultsTest(unittest.TestCase):

    def test_success_empty(self):
        app_ctx = object()
        ext_ctx = ExtensionContext(app_ctx, [ext])
        response = get_callback_results(ext_ctx, {"callbackRequests": []})
        self.assertIsInstance(response, Response)
        self.assertEqual(200, response.status)
        self.assertEqual([], response.data)

    def test_success_for_1_request(self):
        app_ctx = object()
        ext_ctx = ExtensionContext(app_ctx, [ext])
        response = get_callback_results(
            ext_ctx,
            {
                "callbackRequests": [
                    {
                        "contribPoint": "panels",
                        "contribIndex": 0,
                        "callbackIndex": 1,
                        "inputValues": [0],
                    }
                ]
            },
        )
        self.assertIsInstance(response, Response)
        self.assertEqual(200, response.status)
        self.assertEqual(
            [
                {
                    "contribPoint": "panels",
                    "contribIndex": 0,
                    "stateChanges": [
                        {"id": "sel", "property": "disabled", "value": True}
                    ],
                },
            ],
            response.data,
        )

    def test_success_for_2_requests(self):
        app_ctx = object()
        ext_ctx = ExtensionContext(app_ctx, [ext])
        response = get_callback_results(
            ext_ctx,
            {
                "callbackRequests": [
                    {
                        "contribPoint": "panels",
                        "contribIndex": 0,
                        "callbackIndex": 0,
                        "inputValues": [True],
                    },
                    {
                        "contribPoint": "panels",
                        "contribIndex": 0,
                        "callbackIndex": 1,
                        "inputValues": [5],
                    },
                ]
            },
        )
        self.assertIsInstance(response, Response)
        self.assertEqual(200, response.status)
        self.assertEqual(
            [
                {
                    "contribPoint": "panels",
                    "contribIndex": 0,
                    "stateChanges": [
                        {"id": "sel", "property": "value", "value": True},
                        {"id": "sel", "property": "disabled", "value": False},
                    ],
                },
            ],
            response.data,
        )

    def test_invalid_contrib_point(self):
        app_ctx = object()
        ext_ctx = ExtensionContext(app_ctx, [ext])
        response = get_callback_results(
            ext_ctx,
            {
                "callbackRequests": [
                    {
                        "contribPoint": "tools",
                        "contribIndex": 0,
                        "callbackIndex": 0,
                        "inputValues": [True],
                    }
                ]
            },
        )
        self.assertIsInstance(response, Response)
        self.assertEqual(404, response.status)
        self.assertEqual("contribution point 'tools' not found", response.reason)

    def test_invalid_contrib_index(self):
        app_ctx = object()
        ext_ctx = ExtensionContext(app_ctx, [ext])
        response = get_callback_results(
            ext_ctx,
            {
                "callbackRequests": [
                    {
                        "contribPoint": "panels",
                        "contribIndex": 9,
                        "callbackIndex": 0,
                        "inputValues": [True],
                    }
                ]
            },
        )
        self.assertIsInstance(response, Response)
        self.assertEqual(404, response.status)
        self.assertEqual(
            "index range of contribution point 'panels' is 0 to 1, got 9",
            response.reason,
        )

    def test_invalid_callback_index(self):
        app_ctx = object()
        ext_ctx = ExtensionContext(app_ctx, [ext])
        response = get_callback_results(
            ext_ctx,
            {
                "callbackRequests": [
                    {
                        "contribPoint": "panels",
                        "contribIndex": 0,
                        "callbackIndex": 7,
                        "inputValues": [True],
                    }
                ]
            },
        )
        self.assertIsInstance(response, Response)
        self.assertEqual(404, response.status)
        self.assertEqual(
            "index range of callbacks of contribution 'my_panel' is 0 to 1, got 7",
            response.reason,
        )

    def test_no_callback(self):
        app_ctx = object()
        ext_ctx = ExtensionContext(app_ctx, [ext])
        response = get_callback_results(
            ext_ctx,
            {
                "callbackRequests": [
                    {
                        "contribPoint": "panels",
                        "contribIndex": 1,
                        "callbackIndex": 0,
                        "inputValues": [True],
                    }
                ]
            },
        )
        self.assertIsInstance(response, Response)
        self.assertEqual(400, response.status)
        self.assertEqual(
            "contribution 'my_panel_wo_callback' has no callbacks", response.reason
        )
