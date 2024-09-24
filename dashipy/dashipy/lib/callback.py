import inspect
from typing import Callable


class Input:
    def __init__(self, arg_name: str):
        self.param_name = arg_name


class Output:
    def __init__(self, component_id: str, component_prop: str):
        self.component_id = component_id
        self.component_prop = component_prop


class Callback:
    def __init__(
        self, cb_function: Callable, inputs: list[Input], outputs: list[Output]
    ):
        cb_signature = inspect.signature(cb_function)
        for inp in inputs:
            if inp.param_name not in cb_signature.parameters:
                raise ValueError(
                    f"input {inp.param_name!r} is not a"
                    f" parameter of function {cb_function.__name__!r}"
                )

        input_names = set(inp.param_name for inp in inputs)
        for param_name in cb_signature.parameters.keys():
            if param_name not in input_names:
                raise ValueError(
                    f"missing input for parameter {param_name!r} of function"
                    f" {cb_function.__name__!r}"
                )

        param_names = tuple(cb_signature.parameters.keys())
        self.cb_function = cb_function
        self.cb_signature = cb_signature
        self.inputs = sorted(inputs, key=lambda key: param_names.index(key.param_name))
        self.outputs = outputs
