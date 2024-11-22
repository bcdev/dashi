from chartlets.components import Typography
from tests.component_test import make_base


class TypographyTest(make_base(Typography)):

    def test_is_json_serializable(self):
        self.assert_is_json_serializable(
            self.cls(
                variant="subtitle2",
                gutterBottom=True,
                component="span",
                children=["Hello", "World"],
            ),
            {
                "type": "Typography",
                "variant": "subtitle2",
                "gutterBottom": True,
                "component": "span",
                "children": ["Hello", "World"],
            },
        )
