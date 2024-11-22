from dataclasses import dataclass
import json
import unittest
from typing import Any


from chartlets import Component


def make_base(component_cls: type):
    class ComponentTestBase(unittest.TestCase):

        cls = component_cls

        def assert_is_json_serializable(
            self, component: Component, expected_dict: dict[str, Any]
        ):
            self.assertIsInstance(component, Component)

            actual_dict = component.to_dict()
            self.assertIsInstance(actual_dict, dict)

            serialized = json.dumps(actual_dict)
            deserialized = json.loads(serialized)
            self.assertEqual(expected_dict, deserialized)

        def test_type_is_class_name(self):
            component = self.cls()
            self.assertIsInstance(component, Component)
            self.assertEqual(self.cls.__name__, component.type)

    return ComponentTestBase


@dataclass(frozen=True)
class Pin(Component):
    text: str = ""


# noinspection PyMethodMayBeStatic
class ComponentTest(make_base(Pin)):

    def test_is_json_serializable(self):
        self.assert_is_json_serializable(
            self.cls(id="p12", text="hello!", style={"color": "red"}),
            {"type": "Pin", "id": "p12", "text": "hello!", "style": {"color": "red"}},
        )
