from chartlets.components import Tabs
from tests.component_test import make_base


class TabsTest(make_base(Tabs)):

    def test_is_json_serializable(self):
        self.assert_is_json_serializable(
            self.cls(titles=["A", "B", "C"]),
            {"type": "Tabs", "titles": ["A", "B", "C"]},
        )

        self.assert_is_json_serializable(
            self.cls(value=1, titles=["A", "B", "C"]),
            {"type": "Tabs", "value": 1, "titles": ["A", "B", "C"]},
        )
