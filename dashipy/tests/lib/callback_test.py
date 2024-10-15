import unittest

import pytest

from dashipy.callback import Input, Callback


def my_callback(
    ctx,
    a: int,
    /,
    b: str | int = "",
    c: bool | None = False,
    d: list[str] = (),
) -> str:
    return f"{a}-{b}-{c}-{d}"


class CallbackTest(unittest.TestCase):
    def test_make_function_args(self):
        callback = Callback(my_callback, [Input("a"), Input("b"), Input("c")], [])
        ctx = object()
        args, kwargs = callback.make_function_args(ctx, [13, "Wow", True])
        self.assertEqual((ctx, 13), args)
        self.assertEqual({"b": "Wow", "c": True}, kwargs)

    def test_to_dict(self):
        callback = Callback(
            my_callback, [Input("a"), Input("b"), Input("c"), Input("d")], []
        )
        d = callback.to_dict()
        # print(json.dumps(d, indent=2))
        self.assertEqual(
            {
                "function": {
                    "name": "my_callback",
                    "parameters": [
                        {"name": "a", "type": "integer"},
                        {"name": "b", "type": ["string", "integer"], "default": ""},
                        {"name": "c", "type": ["boolean", "null"], "default": False},
                        {"name": "d", "type": "string[]", "default": ()},
                    ],
                    "returnType": "string",
                },
                "inputs": [
                    {"id": "a", "property": "value", "kind": "Component"},
                    {"id": "b", "property": "value", "kind": "Component"},
                    {"id": "c", "property": "value", "kind": "Component"},
                    {"id": "d", "property": "value", "kind": "Component"},
                ],
            },
            d,
        )


# noinspection PyMethodMayBeStatic
class FromDecoratorTest(unittest.TestCase):

    def test_too_few_inputs(self):
        with pytest.raises(
            TypeError,
            match="too few inputs in decorator 'test' for function"
            " 'my_callback': expected 4, but got 0",
        ):
            Callback.from_decorator("test", (), my_callback)

    def test_too_many_inputs(self):
        with pytest.raises(
            TypeError,
            match="too many inputs in decorator 'test' for function"
            " 'my_callback': expected 4, but got 5",
        ):
            Callback.from_decorator(
                "test", tuple(Input(c) for c in "abcde"), my_callback
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
            match="arguments for decorator 'test' must be of"
            " type Input, but got 'int'",
        ):
            Callback.from_decorator("test", (13,), my_callback)

        with pytest.raises(
            TypeError,
            match="arguments for decorator 'test' must be of"
            " type Input or Output, but got 'int'",
        ):
            Callback.from_decorator("test", (13,), my_callback, outputs_allowed=True)
