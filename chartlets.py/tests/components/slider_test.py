from chartlets.components import Slider
from tests.component_test import make_base


class SliderTest(make_base(Slider)):
    def test_is_json_serializable(self):
        self.assert_is_json_serializable(
            self.cls(
                aria_label="Temperature",
                color="primary",
                min=0,
                max=50,
                step=5,
                marks=[5, 15, 50],
                tooltip="Choose a temperature",
                valueLabelDisplay="on",
            ),
            {
                "type": "Slider",
                "aria_label": "Temperature",
                "color": "primary",
                "min": 0,
                "max": 50,
                "step": 5,
                "marks": [5, 15, 50],
                "tooltip": "Choose a temperature",
                "valueLabelDisplay": "on",
            },
        )
