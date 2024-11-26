import unittest
from typing import Any

import pytest

from chartlets.channel import Input, State, Output
from chartlets.callback import Callback


# noinspection PyUnusedLocal
def my_callback(
    ctx,
    a: int,
    /,
    b: str | int = "",
    c: bool | None = False,
    d: list[str] = (),
    e: dict[str, Any] = (),
) -> str:
    return f"{a}-{b}-{c}-{d}"


def my_callback_2(ctx, n: int) -> tuple[list[str], str | None]:
    return list(map(str, range(1, n + 1))), str(1)


class CallbackTest(unittest.TestCase):
    def test_make_function_args(self):
        callback = Callback(my_callback, [Input("a"), Input("b"), Input("c")], [])
        ctx = object()
        args, kwargs = callback.make_function_args(ctx, [13, "Wow", True])
        self.assertEqual((ctx, 13), args)
        self.assertEqual({"b": "Wow", "c": True}, kwargs)

    def test_to_dict_with_no_outputs(self):
        callback = Callback(
            my_callback,
            [Input("a"), Input("b"), Input("c"), Input("d"), State("e")],
            [],
        )
        d = callback.to_dict()
        # print(json.dumps(d, indent=2))
        self.assertEqual(
            {
                "function": {
                    "name": "my_callback",
                    "parameters": [
                        {"name": "a", "type": {"type": "integer"}},
                        {
                            "default": "",
                            "name": "b",
                            "type": {"type": ["string", "integer"]},
                        },
                        {
                            "default": False,
                            "name": "c",
                            "type": {"type": ["boolean", "null"]},
                        },
                        {
                            "default": (),
                            "name": "d",
                            "type": {"items": {"type": "string"}, "type": "array"},
                        },
                        {
                            "default": (),
                            "name": "e",
                            "type": {"additionalProperties": {}, "type": "object"},
                        },
                    ],
                    "returnType": {"type": "string"},
                },
                "inputs": [
                    {"id": "a", "property": "value"},
                    {"id": "b", "property": "value"},
                    {"id": "c", "property": "value"},
                    {"id": "d", "property": "value"},
                    {"id": "e", "noTrigger": True, "property": "value"},
                ],
            },
            d,
        )

    def test_to_dict_with_two_outputs(self):
        callback = Callback(
            my_callback_2,
            [Input("n")],
            [
                Output("select", "options"),
                Output("select", "value"),
            ],
        )
        d = callback.to_dict()
        # print(json.dumps(d, indent=2))
        self.assertEqual(
            {
                "function": {
                    "name": "my_callback_2",
                    "parameters": [{"name": "n", "type": {"type": "integer"}}],
                    "returnType": {
                        "items": [
                            {"items": {"type": "string"}, "type": "array"},
                            {"type": ["string", "null"]},
                        ],
                        "type": "array",
                    },
                },
                "inputs": [{"id": "n", "property": "value"}],
                "outputs": [
                    {"id": "select", "property": "options"},
                    {"id": "select", "property": "value"},
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
            " 'my_callback': expected 5, but got 0",
        ):
            Callback.from_decorator("test", (), my_callback)

    def test_too_many_inputs(self):
        with pytest.raises(
            TypeError,
            match="too many inputs in decorator 'test' for function"
            " 'my_callback': expected 5, but got 7",
        ):
            Callback.from_decorator(
                "test", tuple(Input(c) for c in "abcdefg"), my_callback
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
            match=(
                "arguments for decorator 'test' must be of type"
                " Input, State, or Output, but got 'int'"
            ),
        ):
            Callback.from_decorator("test", (13,), my_callback)

        with pytest.raises(
            TypeError,
            match=(
                "arguments for decorator 'test' must be of type State, but got 'int'"
            ),
        ):
            Callback.from_decorator("test", (13,), my_callback, states_only=True)
