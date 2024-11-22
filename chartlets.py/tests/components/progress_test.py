from chartlets.components import CircularProgress
from chartlets.components import CircularProgressWithLabel
from chartlets.components import LinearProgress
from chartlets.components import LinearProgressWithLabel
from tests.component_test import make_base


class CircularProgressTest(make_base(CircularProgress)):

    def test_is_json_serializable(self):
        self.assert_is_json_serializable(
            self.cls(color="success", value=10),
            {"type": "CircularProgress", "color": "success", "value": 10},
        )


class CircularProgressWithLabelTest(make_base(CircularProgressWithLabel)):

    def test_is_json_serializable(self):
        self.assert_is_json_serializable(
            self.cls(color="primary", value=12),
            {"type": "CircularProgressWithLabel", "color": "primary", "value": 12},
        )


class LinearProgressTest(make_base(LinearProgress)):

    def test_is_json_serializable(self):
        self.assert_is_json_serializable(
            self.cls(color="success", value=40),
            {"type": "LinearProgress", "color": "success", "value": 40},
        )


class LinearProgressWithLabelTest(make_base(LinearProgressWithLabel)):

    def test_is_json_serializable(self):
        self.assert_is_json_serializable(
            self.cls(color="secondary", value=42),
            {"type": "LinearProgressWithLabel", "color": "secondary", "value": 42},
        )
