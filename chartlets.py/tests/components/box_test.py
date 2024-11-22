import json
import unittest

from chartlets.components import Box


class BoxTest(unittest.TestCase):

    def test_is_json_serializable(self):
        box = Box(
            children=[
                Box(id="b1"),
                Box(id="b2"),
            ]
        )

        d = box.to_dict()
        self.assertIsInstance(d, dict)
        self.assertIsInstance(d.get("children"), list)
        json_text = json.dumps(d)
        self.assertEqual("{", json_text[0])
        self.assertEqual("}", json_text[-1])
