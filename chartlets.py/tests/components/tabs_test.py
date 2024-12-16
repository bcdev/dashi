from chartlets.components import Tabs, Tab
from tests.component_test import make_base


class TabsTest(make_base(Tabs)):

    def test_is_json_serializable(self):
        self.assert_is_json_serializable(
            self.cls(children=["A", "B", "C"]),
            {"type": "Tabs", "children": ["A", "B", "C"]},
        )

        self.assert_is_json_serializable(
            self.cls(
                value=1,
                children=[
                    Tab(label="A"),
                    Tab(icon="favorite"),
                    Tab(label="C", disabled=True),
                ],
            ),
            {
                "type": "Tabs",
                "value": 1,
                "children": [
                    {"type": "Tab", "label": "A"},
                    {"type": "Tab", "icon": "favorite"},
                    {"type": "Tab", "label": "C", "disabled": True},
                ],
            },
        )
