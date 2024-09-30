import unittest

import pytest

from dashipy.lib.callback import Input, Callback


def my_callback(ctx, a: int, /, b: str = "", c: bool = False) -> str:
    return f"{a}-{b}-{c}"


class CallTest(unittest.TestCase):
    def test_make_function_args(self):
        callback = Callback(my_callback, [Input("a"), Input("b"), Input("c")], [])
        ctx = object()
        args, kwargs = callback.make_function_args(ctx, [13, "Wow", True])
        self.assertEqual((ctx, 13), args)
        self.assertEqual({"b": "Wow", "c": True}, kwargs)


# noinspection PyMethodMayBeStatic
class FromDecoratorTest(unittest.TestCase):

    def test_inputs_given_but_not_in_order(self):
        callback = Callback.from_decorator(
            "test", (Input("b"), Input("c"), Input("a")), my_callback
        )
        self.assertIsInstance(callback, Callback)
        self.assertIs(my_callback, callback.function)
        self.assertEqual(3, len(callback.inputs))
        self.assertEqual(0, len(callback.outputs))

    def test_too_few_inputs(self):
        with pytest.raises(
            TypeError,
            match="too few inputs in decorator 'test' for function 'my_callback': expected 3, but got 0",
        ):
            Callback.from_decorator("test", (), my_callback)

    def test_too_many_inputs(self):
        with pytest.raises(
            TypeError,
            match="too many inputs in decorator 'test' for function 'my_callback': expected 3, but got 4",
        ):
            Callback.from_decorator(
                "test", tuple(Input(c) for c in "abcd"), my_callback
            )

    def test_decorator_target(self):
        with pytest.raises(
            TypeError,
            match="decorator 'test' must be used with a callable, but got 'str'",
        ):
            # noinspection PyTypeChecker
            Callback.from_decorator("test", (), "pippo")

    def test_decorator_args(self):
        with pytest.raises(
            TypeError,
            match="arguments for decorator 'test' must be of type Input, but got 'int'",
        ):
            Callback.from_decorator("test", (13,), my_callback)

        with pytest.raises(
            TypeError,
            match="arguments for decorator 'test' must be of type Input or Output, but got 'int'",
        ):
            Callback.from_decorator("test", (13,), my_callback, outputs_allowed=True)
