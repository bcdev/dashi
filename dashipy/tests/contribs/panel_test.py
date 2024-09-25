import unittest

import pytest

from dashipy.contribs import Panel
from dashipy.lib.callback import Input, Callback


def my_callback_1():
    pass


def my_callback_2(a: int = 0, b: str = "", c: bool = False) -> str:
    return f"{a}-{b}-{c}"


# noinspection PyMethodMayBeStatic
class DecoratorsTest(unittest.TestCase):

    def test_layout(self):
        panel = Panel()
        self.assertIsNone(panel.renderer)
        panel.layout()(my_callback_1)
        self.assertIsInstance(panel.renderer, Callback)
        self.assertIs(my_callback_1, panel.renderer.function)

    def test_callback(self):
        panel = Panel()
        panel.callback()(my_callback_1)
        panel.callback(Input("b"), Input("c"), Input("a"))(my_callback_2)
        self.assertEqual(2, len(panel.callbacks))
        callback = panel.callbacks[0]
        self.assertIsInstance(callback, Callback)
        self.assertIs(my_callback_1, callback.function)
        self.assertEqual(0, len(callback.inputs))
        self.assertEqual(0, len(callback.outputs))
        callback = panel.callbacks[1]
        self.assertIsInstance(callback, Callback)
        self.assertIs(my_callback_2, callback.function)
        self.assertEqual(3, len(callback.inputs))
        self.assertEqual("a", callback.inputs[0].param_name)
        self.assertEqual("b", callback.inputs[1].param_name)
        self.assertEqual("c", callback.inputs[2].param_name)
