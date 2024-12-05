import pandas as pd


class Context:
    def __init__(self):
        self.datasets = {
            "ds0": pd.DataFrame(
                {
                    "x": ["A", "B", "C", "D", "E"],
                    "a": [28, 55, 43, 91, 81],
                    "b": [50, 32, 56, 44, 8],
                    "c": [50, 40, 30, 20, 10],
                }
            ),
            "ds1": pd.DataFrame(
                {
                    "x": ["V", "W", "X", "Y", "Z"],
                    "u": [99, 1, 7, 43, 49],
                    "v": [23, 35, 45, 39, 18],
                    "w": [10, 0, 30, 35, 40],
                }
            ),
        }
