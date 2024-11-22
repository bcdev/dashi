from chartlets.components import Button
from tests.component_test import make_base


class ButtonTest(make_base(Button)):

    def test_is_json_serializable(self):
        self.assert_is_json_serializable(
            self.cls(text="Update"),
            {"type": "Button", "text": "Update"},
        )
