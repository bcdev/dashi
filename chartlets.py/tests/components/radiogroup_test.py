from chartlets.components import RadioGroup, Radio
from tests.component_test import make_base


class RadioGroupTest(make_base(RadioGroup)):

    def test_is_json_serializable(self):
        self.assert_is_json_serializable(
            self.cls(
                label="Gender",
                tooltip="Select your gender",
                children=[
                    Radio(value="f", label="Female"),
                    Radio(value="m", label="Male"),
                    Radio(value="o", label="Other"),
                ],
            ),
            {
                "type": "RadioGroup",
                "label": "Gender",
                "tooltip": "Select your gender",
                "children": [
                    {"type": "Radio", "value": "f", "label": "Female"},
                    {"type": "Radio", "value": "m", "label": "Male"},
                    {"type": "Radio", "value": "o", "label": "Other"},
                ],
            },
        )
