import unittest
from abc import abstractmethod
from typing import Type

import pytest

from chartlets.channel import Channel, Input, State, Output


def make_base():
    class ChannelTest(unittest.TestCase):
        channel_cls: Type[Channel]

        def test_component(self):
            obj = self.channel_cls("dataset_select", "options")
            self.assertEqual("dataset_select", obj.id)
            self.assertEqual("options", obj.property)

        def test_component_no_property(self):
            obj = self.channel_cls("dataset_select")
            self.assertEqual("dataset_select", obj.id)
            self.assertEqual("value", obj.property)

        @abstractmethod
        def test_component_empty_property(self):
            pass

        def test_app(self):
            obj = self.channel_cls("@app", "datasetId")
            self.assertEqual("@app", obj.id)
            self.assertEqual("datasetId", obj.property)

        def test_app_no_property(self):
            with pytest.raises(
                ValueError,
                match="value for 'property' must be given",
            ):
                self.channel_cls("@app")

        def test_container(self):
            obj = self.channel_cls("@container", "title")
            self.assertEqual("@container", obj.id)
            self.assertEqual("title", obj.property)

        def test_container_no_property(self):
            with pytest.raises(
                ValueError,
                match="value for 'property' must be given",
            ):
                self.channel_cls("@container")

        def test_unknown_id(self):
            with pytest.raises(
                ValueError,
                match=(
                    r"value of 'id' must be one of \('@app', '@container'\), but was '@horst'"
                ),
            ):
                self.channel_cls("@horst")

        def test_to_dict(self):
            obj = self.channel_cls("test_id")
            if isinstance(obj, State):
                self.assertEqual(
                    {
                        "id": "test_id",
                        "property": "value",
                        "noTrigger": True,
                    },
                    obj.to_dict(),
                )
            else:
                self.assertEqual(
                    {
                        "id": "test_id",
                        "property": "value",
                    },
                    obj.to_dict(),
                )

        def test_no_arguments(self):
            with pytest.raises(
                TypeError, match="missing 1 required positional argument: 'id'"
            ):
                # noinspection PyArgumentList
                obj = self.channel_cls()

        def test_keyword_arguments(self):
            obj = self.channel_cls(property="color", id="dataset_select")
            self.assertEqual("dataset_select", obj.id)
            self.assertEqual("color", obj.property)

    return ChannelTest


class InputTest(make_base(), unittest.TestCase):
    channel_cls = Input

    def test_component_empty_property(self):
        with pytest.raises(ValueError, match="value for 'property' must be given"):
            self.channel_cls("dataset_select", "")


class StateTest(make_base(), unittest.TestCase):
    channel_cls = State

    def test_component_empty_property(self):
        with pytest.raises(ValueError, match="value for 'property' must be given"):
            self.channel_cls("dataset_select", "")


class OutputTest(make_base(), unittest.TestCase):
    channel_cls = Output

    def test_component_empty_property(self):
        obj = self.channel_cls("dataset_select", "")
        self.assertEqual("dataset_select", obj.id)
        self.assertEqual("", obj.property)
