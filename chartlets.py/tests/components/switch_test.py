from chartlets.components import Switch
from tests.component_test import make_base


class SwitchTest(make_base(Switch)):

    def test_is_json_serializable(self):
        self.assert_is_json_serializable(
            self.cls(value=True, label="Auto-safe"),
            {"type": "Switch", "value": True, "label": "Auto-safe"},
        )
