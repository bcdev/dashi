import inspect
from typing import Callable, Any


class IOBase:
    # noinspection PyShadowingBuiltins
    def __init__(
        self,
        id: str,
        property: str,
    ):
        assert isinstance(id, str) and id != ""
        assert isinstance(property, str) and property != ""
        self.id = id
        self.property = property

    def to_dict(self) -> dict[str, Any]:
        return {
            k: v
            for k, v in self.__dict__.items()
            if not k.startswith("_") and v is not None
        }


class Input(IOBase):
    # noinspection PyShadowingBuiltins
    def __init__(self, id: str, property: str = "value", source: str = "component"):
        super().__init__(id, property)
        assert isinstance(source, str) and source != ""
        self.source = source


class Output(IOBase):
    # noinspection PyShadowingBuiltins
    def __init__(self, id: str, property: str = "value", target: str = "component"):
        super().__init__(id, property)
        assert isinstance(target, str) and target != ""
        self.target = target


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

    def __call__(self, *args, **kwargs):
        return self.function(*args, **kwargs)

    def to_dict(self) -> dict[str, Any]:
        d = dict(function=self.function.__qualname__)
        if self.inputs:
            d.update(inputs=[inp.to_dict() for inp in self.inputs])
        if self.outputs:
            d.update(outputs=[out.to_dict() for out in self.outputs])
        return d

    @classmethod
    def from_decorator(
        cls,
        decorator_name: str,
        decorator_args: tuple[Any, ...],
        function: Callable,
        outputs_allowed: bool = False,
    ) -> "Callback":
        if not callable(function):
            # noinspection PyUnresolvedReferences
            raise TypeError(
                f"decorator {decorator_name!r} must be"
                f" used with a callable, but got"
                f" {function.__class__.__name__!r}"
            )

        signature = inspect.signature(function)
        function_name = function.__name__

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

        num_inputs = len(inputs)
        num_params = len(signature.parameters)
        delta = num_inputs - num_params
        if delta != 0:
            raise TypeError(
                f"too {'few' if delta < 0 else 'many'} inputs"
                f" in decorator {decorator_name!r} for"
                f" function {function_name!r}:"
                f" expected {num_params},"
                f" but got {num_inputs}"
            )

        return Callback(function, signature, inputs, outputs)

    def get_param(self, param_name: str) -> inspect.Parameter:
        return self.signature.parameters[param_name]

    def make_args(self, layout_inputs: list) -> tuple[tuple, dict]:
        # TODO
        return (), {}
