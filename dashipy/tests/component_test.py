import unittest
from dataclasses import dataclass

from dashipy import Component


@dataclass(frozen=True)
class Pin(Component):
    text: str = ""


# noinspection PyMethodMayBeStatic
class ComponentTest(unittest.TestCase):
    pin = Pin(id="p12", text="hello!", style={"color": "red"})

    def test_attributes(self):
        pin = self.pin
        self.assertEqual("Pin", pin.type)
        self.assertEqual("p12", pin.id)
        self.assertEqual("hello!", pin.text)
        self.assertEqual({"color": "red"}, pin.style)

    def test_to_dict(self):
        pin = self.pin
        self.assertEqual(
            {"type": "Pin", "id": "p12", "text": "hello!", "style": {"color": "red"}},
            pin.to_dict(),
        )
