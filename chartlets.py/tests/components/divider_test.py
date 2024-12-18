from chartlets.components import Divider
from tests.component_test import make_base


class DividerTest(make_base(Divider)):

    def test_is_json_serializable(self):
        self.assert_is_json_serializable(
            self.cls(
                textAlign="center",
                variant="middle",
                flexItem=True,
                children=["Options"],
            ),
            {
                "type": "Divider",
                "textAlign": "center",
                "variant": "middle",
                "flexItem": True,
                "children": ["Options"],
            },
        )
