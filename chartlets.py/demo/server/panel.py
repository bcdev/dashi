from chartlets import Contribution


class Panel(Contribution):
    """A Panel UI contribution.

    It is up to the application UI to render its UI contributions
    in an appropriate form.
    """

    def __init__(self, name: str, title: str | None = None):
        super().__init__(name, title=title)
