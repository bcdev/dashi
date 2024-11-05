from abc import ABC
from typing import Any


class InputOutput(ABC):
    # noinspection PyShadowingBuiltins
    def __init__(
        self,
        id: str | None = None,
        property: str | None = None,
    ):
        self.id = id
        self.property = property

    def to_dict(self) -> dict[str, Any]:
        d = {"type": self.__class__.__name__}
        d.update({
            k: v
            for k, v in self.__dict__.items()
            if not k.startswith("_") and v is not None
        })
        return d


class Input(InputOutput):
    """An input value read from component state.
    A component state change may trigger callback invocation.
    """

    # noinspection PyShadowingBuiltins
    def __init__(self, id: str, property: str = "value"):
        super().__init__(id, property)


class State(InputOutput):
    """An input value read from component state.
    Does not trigger callback invocation.
    """

    # noinspection PyShadowingBuiltins
    def __init__(self, id: str, property: str = "value"):
        super().__init__(id, property)


class Output(InputOutput):
    """Callback output."""

    # noinspection PyShadowingBuiltins
    def __init__(self, id: str, property: str = "value"):
        super().__init__(id, property)


class AppInput(InputOutput):
    """An input value read from application state.
    An application state change may trigger callback invocation.
    """

    # noinspection PyShadowingBuiltins
    def __init__(self, property: str):
        super().__init__(property=property)


class AppOutput(InputOutput):
    """An output written to application state."""

    # noinspection PyShadowingBuiltins
    def __init__(self, property: str):
        super().__init__(property=property)
