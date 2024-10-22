from typing import Union
import pandas as pd


class Context:
    def __init__(self):
        self.datasets= {0: pd.DataFrame(({'a': 'A', 'b': 28},
                                          {'a': 'B', 'b': 55},
                                          {'a': 'C', 'b': 43},
                                          {'a': 'D', 'b': 91},
                                          {'a': 'E', 'b': 81})),
                        1: pd.DataFrame(({'a': 'V', 'b': 99},
                                         {'a': 'W', 'b': 1},
                                         {'a': 'X', 'b': 7},
                                         {'a': 'Y', 'b': 43},
                                         {'a': 'Z', 'b': 49}))
                        }
