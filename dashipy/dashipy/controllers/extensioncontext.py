import importlib
from typing import Any

from dashipy.lib import Extension, Contribution


class ExtensionContext:
    def __init__(self, app_ctx: Any, extensions: list[Extension]):
        self._app_ctx = app_ctx
        self._extensions = extensions
        contributions_map: dict[str, list[Contribution]] = {}
        for contrib_point_name in Extension.get_contrib_point_names():
            # noinspection PyTypeChecker
            contributions: list[Contribution] = []
            for extension in extensions:
                contributions.extend(getattr(extension, contrib_point_name))
            # noinspection PyTypeChecker
            contributions_map[contrib_point_name] = contributions
        self._contributions = contributions_map

    @property
    def app_ctx(self) -> Any:
        return self._app_ctx

    @property
    def extensions(self) -> list[Extension]:
        return self._extensions

    @property
    def contributions(self) -> dict[str, list[Contribution]]:
        return self._contributions

    @classmethod
    def load_extensions(cls, extension_refs: list[str]) -> list[Extension]:
        extensions: list[Extension] = []
        for ext_ref in extension_refs:
            try:
                module_name, attr_name = ext_ref.rsplit(".", maxsplit=2)
            except (ValueError, AttributeError):
                raise TypeError(f"contribution syntax error: {ext_ref!r}")
            module = importlib.import_module(module_name)
            extension = getattr(module, attr_name)
            if not isinstance(extension, Extension):
                raise TypeError(
                    f"extension {ext_ref!r} must refer to an"
                    f" instance of {Extension.__qualname__!r},"
                    f" but was {type(extension).__qualname__!r}"
                )
            extensions.append(extension)
        return extensions
