import json
import unittest

import plotly.graph_objects as go
from plotly.graph_objs import Layout

from dashipy.components import Plot


class PlotTest(unittest.TestCase):

    def test_is_json_serializable(self):
        figure = go.Figure(layout=Layout(title="Bar Chart", autosize=True))
        figure.add_trace(go.Bar(x=["A", "B", "C"], y=[0.2, 0.3, 0.4]))
        plot = Plot(figure=figure)

        d = plot.to_dict()
        self.assertIsInstance(d, dict)
        self.assertIsInstance(d.get("figure"), dict)
        json_text = json.dumps(d)
        self.assertEqual("{", json_text[0])
        self.assertEqual("}", json_text[-1])
