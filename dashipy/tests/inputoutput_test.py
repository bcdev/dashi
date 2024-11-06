import unittest
from typing import Type

import pytest

from dashipy.inputoutput import Input, State, Output


def make_base():
    class Base(unittest.TestCase):
        kind_attr: str
        cls: Type[Input] | Type[State] | Type[Output]

        def kind(self, obj):
            return getattr(obj, self.kind_attr)

        def test_no_args(self):
            obj = self.cls()
            self.assertEqual("component", self.kind(obj))
            self.assertEqual(None, obj.id)
            self.assertEqual(None, obj.property)

        def test_id_given(self):
            obj = self.cls("dataset_select")
            self.assertEqual("component", self.kind(obj))
            self.assertEqual("dataset_select", obj.id)
            self.assertEqual("value", obj.property)

        def test_app(self):
            obj = self.cls(property="datasetId", **{self.kind_attr: "app"})
            self.assertEqual("app", self.kind(obj))
            self.assertEqual(None, obj.id)
            self.assertEqual("datasetId", obj.property)

        def test_app_no_prop(self):
            with pytest.raises(
                ValueError,
                match=(
                    "value of 'property' must be an instance"
                    " of <class 'str'>, but was None"
                ),
            ):
                self.cls(**{self.kind_attr: "app"})

        def test_wrong_kind(self):
            with pytest.raises(
                ValueError,
                match=(
                    f"value of '{self.kind_attr}' must be one of"
                    f" \\('component', 'container', 'app', None\\),"
                    f" but was 'host'"
                ),
            ):
                self.cls(**{self.kind_attr: "host"})

    return Base


class InputTest(make_base(), unittest.TestCase):
    cls = Input
    kind_attr = "source"


class StateTest(make_base(), unittest.TestCase):
    cls = State
    kind_attr = "source"


class OutputTest(make_base(), unittest.TestCase):
    cls = Output
    kind_attr = "target"
