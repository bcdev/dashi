import pandas as pd
import altair as alt

from chartlets.components import Plot


from tests.component_test import make_base


class PlotTest(make_base(Plot)):

    def test_with_chart(self):
        source = pd.DataFrame(
            {"x": ["A", "B", "C", "D", "E"], "a": [28, 55, 43, 91, 81]}
        )
        self.chart = (
            alt.Chart(source)
            .mark_bar()
            .encode(
                x=alt.X("x:N", title="x"),
                y=alt.Y("a:Q", title="a"),
            )
        )

        self.assert_is_json_serializable(
            self.cls(id="plot", theme="dark", chart=self.chart),
            {
                "type": "Plot",
                "id": "plot",
                "theme": "dark",
                "chart": {
                    "$schema": "https://vega.github.io/schema/vega-lite/v5.20.1.json",
                    "config": {
                        "view": {"continuousHeight": 300, "continuousWidth": 300}
                    },
                    "data": {"name": "data-2780b27b376c14369bf3f449cf25f092"},
                    "datasets": {
                        "data-2780b27b376c14369bf3f449cf25f092": [
                            {"a": 28, "x": "A"},
                            {"a": 55, "x": "B"},
                            {"a": 43, "x": "C"},
                            {"a": 91, "x": "D"},
                            {"a": 81, "x": "E"},
                        ]
                    },
                    "encoding": {
                        "x": {"field": "x", "title": "x", "type": "nominal"},
                        "y": {"field": "a", "title": "a", "type": "quantitative"},
                    },
                    "mark": {"type": "bar"},
                },
            },
        )

    def test_without_chart(self):
        self.assert_is_json_serializable(
            self.cls(id="plot", style={"width": 100}),
            {"type": "Plot", "id": "plot", "style": {"width": 100}},
        )
