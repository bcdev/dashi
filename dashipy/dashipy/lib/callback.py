import inspect
import types
from abc import ABC
from typing import Callable, Any, Literal

from .component import Component

ComponentKind = Literal["Component"]
AppStateKind = Literal["AppState"]
StateKind = Literal["State"]
InputOutputKind = ComponentKind | StateKind | AppStateKind


class InputOutput(ABC):
    # noinspection PyShadowingBuiltins
    def __init__(
        self,
        id: str,
        property: str | None = None,
        kind: InputOutputKind | None = None,
    ):
        property = "value" if property is None else property
        kind = "Component" if kind is None else kind
        assert id is None or (isinstance(id, str) and id != "")
        assert isinstance(property, str) and property != ""
        assert kind in ("AppState", "State", "Component")
        self.id = id
        self.property = property
        self.kind = kind

    def to_dict(self) -> dict[str, Any]:
        return {
            k: v
            for k, v in self.__dict__.items()
            if not k.startswith("_") and v is not None
        }


class Input(InputOutput):
    """Callback input."""


class Output(InputOutput):
    """Callback output."""


class Callback:
    """A callback is a server-side function
    whose 1st parameter is always a context object.
    All other parameters must be described by
    input objects.
    """

    @classmethod
    def from_decorator(
        cls,
        decorator_name: str,
        decorator_args: tuple[Any, ...],
        function: Any,
        outputs_allowed: bool = False,
    ) -> "Callback":
        try:
            signature = inspect.signature(function)
        except TypeError:
            raise TypeError(
                f"decorator {decorator_name!r} must be"
                f" used with a callable, but got"
                f" {function.__class__.__name__!r}"
            )

        function_name = function.__qualname__

        if len(signature.parameters) == 0:
            raise TypeError(
                f"function {function_name!r} decorated with"
                f" {decorator_name!r} must have at least one"
                f" context parameter"
            )

        inputs: list[Input] = []
        outputs: list[Output] = []
        for arg in decorator_args:
            if isinstance(arg, Input):
                inputs.append(arg)
            elif outputs_allowed and isinstance(arg, Output):
                outputs.append(arg)
            elif outputs_allowed:
                raise TypeError(
                    f"arguments for decorator {decorator_name!r}"
                    f" must be of type Input or Output,"
                    f" but got {arg.__class__.__name__!r}"
                )
            else:
                raise TypeError(
                    f"arguments for decorator {decorator_name!r}"
                    f" must be of type Input,"
                    f" but got {arg.__class__.__name__!r}"
                )

        num_params = len(signature.parameters) - 1
        num_inputs = len(inputs)
        delta = num_inputs - num_params
        if delta != 0:
            raise TypeError(
                f"too {'few' if delta < 0 else 'many'} inputs"
                f" in decorator {decorator_name!r} for"
                f" function {function_name!r}:"
                f" expected {num_params},"
                f" but got {num_inputs}"
            )

        return Callback(function, inputs, outputs, signature=signature)

    def __init__(
        self,
        function: Callable,
        inputs: list[Input],
        outputs: list[Output],
        signature: inspect.Signature | None = None,
    ):
        """Private constructor.
        Use `from_decorator` to instantiate callback objects.
        """
        signature = signature if signature is not None else inspect.signature(function)
        self.function = function
        self.signature = signature
        self.param_names = tuple(signature.parameters.keys())
        self.inputs = inputs
        self.outputs = outputs

    def invoke(self, context: Any, input_values: list | tuple):
        args, kwargs = self.make_function_args(context, input_values)
        return self.function(*args, **kwargs)

    def to_dict(self) -> dict[str, Any]:
        # skip ctx parameter:
        parameters = list(self.signature.parameters.values())[1:]
        d = {
            "function": {
                "name": self.function.__qualname__,
                "parameters": [_parameter_to_dict(p) for p in parameters],
                "returnType": _annotation_to_str(self.signature.return_annotation),
            }
        }
        if self.inputs:
            d.update({"inputs": [inp.to_dict() for inp in self.inputs]})
        if self.outputs:
            d.update({"outputs": [out.to_dict() for out in self.outputs]})
        return d

    def make_function_args(
        self, context: Any, values: tuple | list
    ) -> tuple[tuple, dict]:
        num_inputs = len(self.inputs)
        num_values = len(values)
        delta = num_inputs - num_values
        if delta != 0:
            raise TypeError(
                f"too {'few' if delta < 0 else 'many'} input values"
                f" given for function {self.function.__qualname__!r}:"
                f" expected {num_inputs},"
                f" but got {num_values}"
            )

        param_names = self.param_names[1:]
        args = [context]
        kwargs = {}
        for i, param_value in enumerate(values):
            param_name = param_names[i]
            param = self.signature.parameters[param_name]
            if param.kind == param.POSITIONAL_ONLY:
                args.append(param_value)
            else:
                kwargs[param_name] = param_value

        return tuple(args), kwargs


def _parameter_to_dict(parameter: inspect.Parameter) -> dict[str, Any]:
    empty = inspect.Parameter.empty
    d = {"name": parameter.name}
    if parameter.annotation is not empty:
        d |= {"type": _annotation_to_str(parameter.annotation)}
    if parameter.default is not empty:
        d |= {"default": parameter.default}
    return d


_scalar_types = {
    "None": "null",
    "NoneType": "null",
    "bool": "boolean",
    "int": "integer",
    "float": "float",
    "str": "string",
    "Component": "Component",
}

_array_types = {
    "list[bool]": "boolean[]",
    "list[int]": "integer[]",
    "list[float]": "float[]",
    "list[str]": "string[]",
    "list[Component]": "Component[]",
}

_object_types = {
    "Figure": "Figure",
    "Component": "Component",
}


def _annotation_to_str(annotation: Any) -> str | list[str]:
    if isinstance(annotation, types.UnionType):
        type_name = str(annotation)
        try:
            return [_scalar_types[t] for t in type_name.split(" | ")]
        except KeyError:
            pass
    elif isinstance(annotation, types.GenericAlias):
        type_name = str(annotation)
        try:
            return _array_types[type_name]
        except KeyError:
            pass
    else:
        type_name = (
            annotation.__name__ if hasattr(annotation, "__name__") else str(annotation)
        )
        try:
            return _scalar_types[type_name]
        except KeyError:
            pass
        try:
            return _object_types[type_name]
        except KeyError:
            pass
    raise TypeError(f"unsupported type: {type_name}")
