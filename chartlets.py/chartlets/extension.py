import inspect
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
        if not inspect.isclass(item_type) or not issubclass(item_type, Contribution):
            message = "item_type must be a class derived from chartlets.Contribution"
            raise TypeError(
                f"{message}, but was {item_type.__name__}"
                if hasattr(item_type, "__name__")
                else message
            )
        cls._contrib_points[item_type] = name

    @classmethod
    def reset_contrib_points(cls):
        cls._contrib_points = {}

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
        self._contributions: dict[str, list[Contribution]] = {}

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
        if contrib_point_name in self._contributions:
            self._contributions[contrib_point_name].append(contribution)
        else:
            self._contributions[contrib_point_name] = [contribution]

    def get(self, contrib_point_name: str) -> list[Contribution]:
        return self._contributions.get(contrib_point_name, [])

    def to_dict(self) -> dict[str, Any]:
        """Convert this extension into a JSON-serializable dictionary.

        Returns: A dictionary representing this extension.
        """
        return dict(
            name=self.name,
            version=self.version,
            contributes=sorted(self._contributions.keys()),
        )
