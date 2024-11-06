import unittest
from typing import Type

import pytest

from dashipy.channel import Channel, Input, State, Output


def make_base():
    class ChannelTest(unittest.TestCase):
        channel_cls: Type[Channel]
        link_name: str

        def test_no_args(self):
            obj = self.channel_cls()
            self.assertEqual("component", obj.link)
            self.assertEqual(None, obj.id)
            self.assertEqual(None, obj.property)

        def test_id_given(self):
            obj = self.channel_cls("dataset_select")
            self.assertEqual("component", obj.link)
            self.assertEqual("dataset_select", obj.id)
            self.assertEqual("value", obj.property)

        def test_app(self):
            obj = self.channel_cls(property="datasetId", **{self.link_name: "app"})
            self.assertEqual("app", obj.link)
            self.assertEqual(None, obj.id)
            self.assertEqual("datasetId", obj.property)

        def test_container_with_id(self):
            with pytest.raises(
                TypeError,
                match="value of 'id' must be None, but was 'test_id'",
            ):
                self.channel_cls("test_id", **{self.link_name: "container"})

        def test_app_no_prop(self):
            with pytest.raises(
                TypeError,
                match=(
                    "value of 'property' must be an instance"
                    " of <class 'str'>, but was None"
                ),
            ):
                self.channel_cls(**{self.link_name: "app"})

        def test_wrong_link(self):
            with pytest.raises(
                ValueError,
                match=(
                    f"value of '{self.link_name}' must be one of"
                    f" \\('component', 'container', 'app', None\\),"
                    f" but was 'host'"
                ),
            ):
                self.channel_cls(**{self.link_name: "host"})

        def test_no_trigger(self):
            obj = self.channel_cls()
            if isinstance(obj, State):
                self.assertTrue(obj.no_trigger)
            else:
                self.assertFalse(obj.no_trigger)

        def test_to_dict(self):
            obj = self.channel_cls("test_id")
            if isinstance(obj, State):
                self.assertEqual(
                    {
                        "link": "component",
                        "id": "test_id",
                        "property": "value",
                        "noTrigger": True,
                    },
                    obj.to_dict(),
                )
            else:
                self.assertEqual(
                    {
                        "link": "component",
                        "id": "test_id",
                        "property": "value",
                    },
                    obj.to_dict(),
                )

    return ChannelTest


class InputTest(make_base(), unittest.TestCase):
    channel_cls = Input
    link_name = "source"


class StateTest(make_base(), unittest.TestCase):
    channel_cls = State
    link_name = "source"


class OutputTest(make_base(), unittest.TestCase):
    channel_cls = Output
    link_name = "target"
