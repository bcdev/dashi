import unittest

import pytest

from dashipy.lib.panel import Panel
from dashipy.lib.callback import Output, Input, Callback


def test_callback_1():
    pass


def test_callback_2(a: int = 0, b: str = "", c: bool = False) -> str:
    return f"{a}-{b}-{c}"


# noinspection PyMethodMayBeStatic
class PanelCallbackTest(unittest.TestCase):

    def test_no_inputs(self):
        panel = Panel()
        panel.callback()(test_callback_1)
        self.assertEqual(1, len(panel.callbacks))
        callback = panel.callbacks[0]
        self.assertIsInstance(callback, Callback)
        self.assertEqual(0, len(callback.inputs))
        self.assertEqual(0, len(callback.outputs))
        self.assertIs(test_callback_1, callback.cb_function)

    def test_some_inputs(self):
        panel = Panel()
        panel.callback(Input("a"), Input("b"), Input("c"))(test_callback_2)
        self.assertEqual(1, len(panel.callbacks))
        callback = panel.callbacks[0]
        self.assertIsInstance(callback, Callback)
        self.assertEqual(3, len(callback.inputs))
        self.assertEqual(0, len(callback.outputs))
        self.assertIs(test_callback_2, callback.cb_function)
        self.assertEqual("a", callback.inputs[0].param_name)
        self.assertEqual("b", callback.inputs[1].param_name)
        self.assertEqual("c", callback.inputs[2].param_name)

    def test_sorted_inputs(self):
        panel = Panel()
        panel.callback(Input("b"), Input("c"), Input("a"))(test_callback_2)
        self.assertEqual(1, len(panel.callbacks))
        callback = panel.callbacks[0]
        self.assertIsInstance(callback, Callback)
        self.assertEqual(3, len(callback.inputs))
        self.assertEqual("a", callback.inputs[0].param_name)
        self.assertEqual("b", callback.inputs[1].param_name)
        self.assertEqual("c", callback.inputs[2].param_name)

    def test_wrong_input(self):
        panel = Panel()
        with pytest.raises(
            ValueError,
            match="input 'B' is not a parameter of function 'test_callback_2'",
        ):
            panel.callback(Input("a"), Input("B"))(test_callback_2)

    def test_missing_input(self):
        panel = Panel()
        with pytest.raises(
            ValueError,
            match="missing input for parameter 'b' of function 'test_callback_2'",
        ):
            panel.callback(Input("a"))(test_callback_2)

    def test_decorator_args(self):
        panel = Panel()
        with pytest.raises(
            TypeError,
            match="'callback' decorator argument must be Input or Output, was 'int'",
        ):
            # noinspection PyTypeChecker
            panel.callback(13)(test_callback_2)

    def test_decorator_target(self):
        panel = Panel()
        with pytest.raises(
            TypeError,
            match="'callback' decorator must be used with function, was 'str'",
        ):
            # noinspection PyTypeChecker
            panel.callback()("pippo")
