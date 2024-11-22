from chartlets.components import Box
from tests.component_test import make_base


class BoxTest(make_base(Box)):

    def test_is_json_serializable(self):
        self.assert_is_json_serializable(
            self.cls(
                children=[
                    Box(id="b1"),
                    Box(id="b2"),
                ],
                style={"color": "grey", "display": "flex"},
            ),
            {
                "type": "Box",
                "children": [
                    {"children": [], "id": "b1", "type": "Box"},
                    {"children": [], "id": "b2", "type": "Box"},
                ],
                "style": {"color": "grey", "display": "flex"},
            },
        )
