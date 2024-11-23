import unittest
from typing import Type

import pytest

from chartlets.channel import Channel, Input, State, Output


def make_base():
    class ChannelTest(unittest.TestCase):
        channel_cls: Type[Channel]

        def test_no_args_given(self):
            with pytest.raises(
                TypeError, match="missing 1 required positional argument: 'id'"
            ):
                # noinspection PyArgumentList
                obj = self.channel_cls()

        def test_id_given(self):
            obj = self.channel_cls("dataset_select")
            self.assertEqual("dataset_select", obj.id)
            self.assertEqual("value", obj.property)

        def test_app_ok(self):
            obj = self.channel_cls("@app", "datasetId")
            self.assertEqual("@app", obj.id)
            self.assertEqual("datasetId", obj.property)

        def test_container_with_id(self):
            with pytest.raises(
                ValueError,
                match="value for 'property' must be given",
            ):
                self.channel_cls("@container")

        def test_app_no_prop(self):
            with pytest.raises(
                ValueError,
                match="value for 'property' must be given",
            ):
                self.channel_cls("@app")

        def test_wrong_link(self):
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

    return ChannelTest


class InputTest(make_base(), unittest.TestCase):
    channel_cls = Input

    def test_disallow_empty_property(self):
        with pytest.raises(ValueError, match="value for 'property' must be given"):
            self.channel_cls("some_id", "")


class StateTest(make_base(), unittest.TestCase):
    channel_cls = State


class OutputTest(make_base(), unittest.TestCase):
    channel_cls = Output

    def test_allow_empty_property(self):
        obj = self.channel_cls("some_id", "")
        self.assertEqual("some_id", obj.id)
        self.assertEqual("", obj.property)
