import inspect
import unittest

import pytest

from dashipy.lib.callback import Input, Callback


def my_callback(a: int = 0, b: str = "", c: bool = False) -> str:
    return f"{a}-{b}-{c}"


# noinspection PyMethodMayBeStatic
class FromDecoratorTest(unittest.TestCase):

    def test_no_inputs_given(self):
        callback = Callback.from_decorator("test", my_callback, ())
        self.assertIsInstance(callback, Callback)
        self.assertEqual(3, len(callback.inputs))
        self.assertEqual(0, len(callback.outputs))
        self.assertIs(my_callback, callback.function)
        self.assertEqual("a", callback.inputs[0].param_name)
        self.assertEqual("b", callback.inputs[1].param_name)
        self.assertEqual("c", callback.inputs[2].param_name)

    def test_inputs_given_but_not_in_order(self):
        callback = Callback.from_decorator(
            "test", my_callback, (Input("b"), Input("c"), Input("a"))
        )
        self.assertIsInstance(callback, Callback)
        self.assertEqual(3, len(callback.inputs))
        self.assertEqual(0, len(callback.outputs))
        self.assertIs(my_callback, callback.function)
        self.assertEqual("a", callback.inputs[0].param_name)
        self.assertEqual("b", callback.inputs[1].param_name)
        self.assertEqual("c", callback.inputs[2].param_name)

    def test_input_params(self):
        callback = Callback.from_decorator("test", my_callback, ())
        self.assertIsInstance(callback, Callback)
        self.assertIsInstance(callback.get_param("a"), inspect.Parameter)
        self.assertIsInstance(callback.get_param("b"), inspect.Parameter)
        self.assertIsInstance(callback.get_param("c"), inspect.Parameter)
        self.assertEqual(int, callback.get_param("a").annotation)
        self.assertEqual(str, callback.get_param("b").annotation)
        self.assertEqual(bool, callback.get_param("c").annotation)
        self.assertEqual(0, callback.get_param("a").default)
        self.assertEqual("", callback.get_param("b").default)
        self.assertEqual(False, callback.get_param("c").default)

    def test_wrong_input(self):
        with pytest.raises(
            TypeError,
            match="input 'B' of decorator 'test' is not a parameter of function 'my_callback'",
        ):
            Callback.from_decorator("test", my_callback, (Input("a"), Input("B")))

    def test_decorator_target(self):
        with pytest.raises(
            TypeError,
            match="decorator 'test' must be used with function, got 'str'",
        ):
            # noinspection PyTypeChecker
            Callback.from_decorator("test", "pippo", ())

    def test_decorator_args(self):
        with pytest.raises(
            TypeError,
            match="arguments for decorator 'test' must be of type Input or Output, got 'int'",
        ):
            Callback.from_decorator("test", my_callback, (13,))
