import inspect
import unittest
from dataclasses import dataclass
from typing import Any

import pytest

from dashipy.lib import Component, Container
from dashipy.lib.callback import Input, Callback


@dataclass(frozen=True)
class Item(Component):
    pass


@dataclass(frozen=True)
class ItemGroup(Container):
    pass


# noinspection PyMethodMayBeStatic
class ContainerTest(unittest.TestCase):
    group = ItemGroup(
        id="ig13", style={"color": "red"}, children=[Item(id="i1"), Item(id="i2")]
    )

    def test_attributes(self):
        group = self.group
        self.assertEqual("ItemGroup", group.type)
        self.assertEqual("ig13", group.id)
        self.assertEqual({"color": "red"}, group.style)
        self.assertIsInstance(group.children, list)
        self.assertEqual(2, len(group.children))

    def test_to_dict(self):
        group = self.group
        self.assertEqual(
            {
                "type": "ItemGroup",
                "id": "ig13",
                "style": {"color": "red"},
                "children": [
                    {"type": "Item", "id": "i1"},
                    {"type": "Item", "id": "i2"},
                ],
            },
            group.to_dict(),
        )
