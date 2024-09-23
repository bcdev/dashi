class Context:
    def __init__(self):
        self.datasets: dict[int, list[int]] = {
            0: [10, 20, 30],
            1: [20, 30, 10],
            2: [30, 10, 20],
        }
