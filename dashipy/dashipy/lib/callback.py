import inspect
from typing import Callable, Any


class Input:
    def __init__(
        self,
        param_name: str,
        component_id: str | None = None,
        component_prop: str | None = None,
    ):
        self.param_name = param_name
        self.component_id = component_id
        self.component_prop = component_prop


class Output:
    def __init__(self, component_id: str, component_prop: str):
        self.component_id = component_id
        self.component_prop = component_prop


class Callback:
    def __init__(
        self,
        function: Callable,
        signature: inspect.Signature,
        inputs: list[Input],
        outputs: list[Output],
    ):
        self.function = function
        self.signature = signature
        self.inputs = inputs
        self.outputs = outputs

    @classmethod
    def from_decorator(
        cls, name: str, function: Callable, args: tuple[Any, ...]
    ) -> "Callback":
        if not callable(function):
            # noinspection PyUnresolvedReferences
            raise TypeError(
                f"decorator {name!r} must be"
                f" used with function, got {function.__class__.__name__!r}"
            )

        signature = inspect.signature(function)

        inputs: list[Input] = []
        outputs: list[Output] = []
        for arg in args:
            if isinstance(arg, Input):
                inputs.append(arg)
            elif isinstance(arg, Output):
                outputs.append(arg)
            else:
                raise TypeError(
                    f"arguments for decorator {name!r} must"
                    f" be of type Input or Output,"
                    f" got {arg.__class__.__name__!r}"
                )

        for inp in inputs:
            if inp.param_name not in signature.parameters:
                raise TypeError(
                    f"input {inp.param_name!r} of decorator {name!r} is not a"
                    f" parameter of function {function.__name__!r}"
                )

        inputs_map = {inp.param_name: inp for inp in inputs}
        inputs: list[Input] = []
        for param_name in signature.parameters.keys():
            inputs.append(
                inputs_map[param_name]
                if param_name in inputs_map
                else Input(param_name=param_name)
            )

        return Callback(function, signature, inputs, outputs)

    def get_param(self, param_name: str) -> inspect.Parameter:
        return self.signature.parameters[param_name]
