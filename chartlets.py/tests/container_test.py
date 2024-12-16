import unittest
from dataclasses import dataclass

from chartlets import Component, Container


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

    def test_add(self):
        g = ItemGroup("g")
        a = Item("a")
        b = Item("b")
        g.add(a)
        g.add(b)
        self.assertEqual(
            {
                "type": "ItemGroup",
                "id": "g",
                "children": [{"type": "Item", "id": "a"}, {"type": "Item", "id": "b"}],
            },
            g.to_dict(),
        )
