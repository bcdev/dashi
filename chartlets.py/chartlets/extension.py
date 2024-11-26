from typing import Any

from chartlets.contribution import Contribution


class Extension:
    """An extension for a UI application that
    uses the Chartlets JS framework."""

    _contrib_points: dict[type[Contribution], str] = {}

    @classmethod
    def add_contrib_point(cls, name: str, item_type: type[Contribution]):
        """Add a contribution point.

        Args:
            name: The name of the contribution point.
            item_type: The type of items that can be added
                to the new contribution point.
        """
        cls._contrib_points[item_type] = name

    @classmethod
    def get_contrib_point_names(cls) -> tuple[str, ...]:
        """Get names of all known contribution points added
        by the `add_contrib_point()` method.

        Returns: Tuple of registered contribution point names.
        """
        values = cls._contrib_points.values()
        # noinspection PyTypeChecker
        return tuple(values)

    # noinspection PyShadowingBuiltins
    def __init__(self, name: str, version: str = "0.0.0"):
        self.name = name
        self.version = version
        for contrib_point_name in self.get_contrib_point_names():
            setattr(self, contrib_point_name, [])

    def add(self, contribution: Contribution):
        """Add a contribution to this extension.

        Args:
            contribution: The contribution.
                Its type must be an instance of one of the
                registered contribution types.
        """
        contrib_type = type(contribution)
        contrib_point_name = self._contrib_points.get(contrib_type)
        if contrib_point_name is None:
            raise TypeError(
                f"unrecognized contribution of type {contrib_type.__qualname__}"
            )
        contribution.extension = self.name
        contributions: list[Contribution] = getattr(self, contrib_point_name)
        contributions.append(contribution)

    def to_dict(self) -> dict[str, Any]:
        """Convert this extension into a JSON-serializable dictionary.

        Returns: A dictionary representing this extension.
        """
        return dict(
            name=self.name,
            version=self.version,
            contributes=[
                contrib_point_name
                for contrib_point_name in self.get_contrib_point_names()
                if getattr(self, contrib_point_name)
            ],
        )
