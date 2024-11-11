import json
import unittest

import pandas as pd
import altair as alt

from dashipy.components import Plot


class PlotTest(unittest.TestCase):
    def setUp(self):
        dataset = pd.DataFrame(
            {"x": ["A", "B", "C", "D", "E"], "a": [28, 55, 43, 91, 81]}
        )
        self.chart = (
            alt.Chart(dataset)
            .mark_bar()
            .encode(
                x=alt.X("x:N", title="x"),
                y=alt.Y("a:Q", title="a"),
            )
        )

    def test_is_json_serializable(self):

        plot = Plot(id="plot", chart=self.chart)
        p = plot.to_dict()

        print(p)
        self.assertIsInstance(p, dict)
        self.assertEqual(p["type"], "Plot")
        self.assertIsInstance(p["chart"], dict)
        self.assertEqual(p["chart"]["mark"], {"type": "bar"})
        json_text = json.dumps(p)
        self.assertEqual("{", json_text[0])
        self.assertEqual("}", json_text[-1])
