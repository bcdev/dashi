import unittest
from typing import Any

import pytest

from chartlets.callback import Callback, annotation_to_json_schema
from chartlets.channel import Input, State, Output
from chartlets.components import VegaChart, Checkbox, Button


# noinspection PyUnusedLocal
def my_callback(
    ctx,
    a: int,
    /,
    b: str | int = "",
    c: bool | None = False,
    d: list[str] = (),
    e: dict[str, Any] | None = None,
) -> str:
    return f"{a}-{b}-{c}-{d}-{e}"


def my_callback_2(ctx, n: int) -> tuple[list[str], str | None]:
    return list(map(str, range(1, n + 1))), str(1)


def no_args_callback():
    pass


def no_annotations_callback(ctx, a, b):
    pass


class CallbackToDictTest(unittest.TestCase):

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
                        {"name": "a", "schema": {"type": "integer"}},
                        {
                            "name": "b",
                            "schema": {"type": ["string", "integer"]},
                            "default": "",
                        },
                        {
                            "name": "c",
                            "schema": {"type": ["boolean", "null"]},
                            "default": False,
                        },
                        {
                            "name": "d",
                            "schema": {"items": {"type": "string"}, "type": "array"},
                            "default": (),
                        },
                        {
                            "name": "e",
                            "schema": {"type": ["object", "null"]},
                            "default": None,
                        },
                    ],
                    "return": {"schema": {"type": "string"}},
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
                    "parameters": [{"name": "n", "schema": {"type": "integer"}}],
                    "return": {
                        "schema": {
                            "items": [
                                {"items": {"type": "string"}, "type": "array"},
                                {"type": ["string", "null"]},
                            ],
                            "type": "array",
                        }
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
class CallbackInvokeTest(unittest.TestCase):
    def test_works(self):
        callback = Callback(my_callback, [Input(c) for c in "abcde"], [Output("x")])
        ctx = object()
        result = callback.invoke(ctx, [12, "Wow", True, list("abc"), dict(x=14)])
        self.assertEqual("12-Wow-True-['a', 'b', 'c']-{'x': 14}", result)

    def test_too_few_input_values(self):
        callback = Callback(my_callback, [Input(c) for c in "abcde"], [Output("x")])
        ctx = object()
        result = callback.invoke(ctx, [12, "Wow", True])
        self.assertEqual("12-Wow-True-None-None", result)

    def test_too_many_input_values(self):
        callback = Callback(my_callback, [Input(c) for c in "abcde"], [Output("x")])
        ctx = object()
        with pytest.raises(
            TypeError,
            match=(
                "too many input values given for function"
                " 'my_callback': expected 5, but got 6"
            ),
        ):
            callback.make_function_args(
                ctx, [11, "Wow", False, list("xyz"), dict(x=17), None]
            )


# noinspection PyMethodMayBeStatic
class FromDecoratorTest(unittest.TestCase):

    def test_ok(self):
        cb = Callback.from_decorator(
            "test", [Input(c) for c in "abcde"] + [Output("x")], my_callback
        )
        self.assertIsInstance(cb, Callback)

    def test_no_args(self):
        with pytest.raises(
            TypeError,
            match=(
                "function 'no_args_callback' decorated with"
                " 'test' must have at least one context parameter"
            ),
        ):
            Callback.from_decorator(
                "test",
                (),
                no_args_callback,
            )

    def test_too_few_inputs(self):
        with pytest.raises(
            TypeError,
            match=(
                "too few inputs in decorator 'test' for function"
                " 'my_callback': expected 5, but got 0"
            ),
        ):
            Callback.from_decorator("test", (), my_callback)

    def test_too_many_inputs(self):
        with pytest.raises(
            TypeError,
            match=(
                "too many inputs in decorator 'test' for function"
                " 'my_callback': expected 5, but got 7"
            ),
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

    def test_no_annotation(self):
        cb = Callback.from_decorator(
            "test", (Input("x"), Input("y"), Output("z")), no_annotations_callback
        )


# noinspection PyMethodMayBeStatic
class AnnotationToJsonSchemaTest(unittest.TestCase):
    def test_any_type(self):
        self.assertEqual({}, annotation_to_json_schema(Any))

    def test_simple_types(self):
        self.assertEqual({"type": "null"}, annotation_to_json_schema(None))
        self.assertEqual({"type": "null"}, annotation_to_json_schema(type(None)))
        self.assertEqual({"type": "boolean"}, annotation_to_json_schema(bool))
        self.assertEqual({"type": "integer"}, annotation_to_json_schema(int))
        self.assertEqual({"type": "number"}, annotation_to_json_schema(float))
        self.assertEqual({"type": "string"}, annotation_to_json_schema(str))
        self.assertEqual({"type": "array"}, annotation_to_json_schema(list))
        self.assertEqual({"type": "array"}, annotation_to_json_schema(tuple))
        self.assertEqual({"type": "object"}, annotation_to_json_schema(dict))

    def test_generic_alias(self):
        self.assertEqual(
            {"type": "array"},
            annotation_to_json_schema(list[Any]),
        )
        self.assertEqual(
            {"type": "array", "items": {"type": "integer"}},
            annotation_to_json_schema(list[int]),
        )
        self.assertEqual(
            {"type": "array", "items": [{"type": "array"}]},
            annotation_to_json_schema(tuple[list]),
        )
        self.assertEqual(
            {"type": "array", "items": [{"type": "string"}, {"type": "integer"}]},
            annotation_to_json_schema(tuple[str, int]),
        )
        self.assertEqual(
            {"type": "object"},
            annotation_to_json_schema(dict[str, Any]),
        )
        self.assertEqual(
            {
                "type": "object",
                "additionalProperties": {"type": "boolean"},
            },
            annotation_to_json_schema(dict[str, bool]),
        )

    def test_union_type(self):
        self.assertEqual(
            {"type": ["string", "null"]}, annotation_to_json_schema(str | None)
        )
        self.assertEqual(
            {"type": ["string", "null"]}, annotation_to_json_schema(str | None)
        )
        self.assertEqual(
            {
                "oneOf": [
                    {"type": "boolean"},
                    {
                        "type": "array",
                        "items": [{"type": "string"}, {"type": "boolean"}],
                    },
                    {"type": "null"},
                ]
            },
            annotation_to_json_schema(bool | tuple[str, bool] | None),
        )

    def test_component_type(self):
        self.assertEqual(
            {"type": "object", "class": "VegaChart"},
            annotation_to_json_schema(VegaChart),
        )
        self.assertEqual(
            {"type": "object", "class": "Button"}, annotation_to_json_schema(Button)
        )

    def test_not_supported(self):
        with pytest.raises(
            TypeError, match="unsupported type annotation: <class 'object'>"
        ):
            annotation_to_json_schema(object)

        with pytest.raises(
            TypeError, match="unsupported type annotation: <class 'set'>"
        ):
            annotation_to_json_schema(set)

        with pytest.raises(
            TypeError, match="unsupported type annotation: set\\[str\\]"
        ):
            annotation_to_json_schema(set[str])

        with pytest.raises(
            TypeError, match="unsupported type annotation: dict\\[int, str\\]"
        ):
            annotation_to_json_schema(dict[int, str])
