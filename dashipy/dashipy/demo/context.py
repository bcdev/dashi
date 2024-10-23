from typing import Union
import pandas as pd


class Context:
    def __init__(self):
        self.datasets= {
            0: pd.DataFrame({
                'a': ['A', 'B', 'C', 'D', 'E'],
                'b': [28, 55, 43, 91, 81]
            }),
            1: pd.DataFrame({
                'a': ['V', 'W', 'X', 'Y', 'Z'],
                'b': [99, 1, 7, 43, 49]
            })
        }
