import importlib
from typing import Any

from chartlets import Extension, Contribution


class ExtensionContext:
    def __init__(self, app_ctx: Any, extensions: list[Extension]):
        self._app_ctx = app_ctx
        self._extensions = extensions
        contributions_map: dict[str, list[Contribution]] = {}
        for contrib_point_name in Extension.get_contrib_point_names():
            # noinspection PyTypeChecker
            contributions: list[Contribution] = []
            for extension in extensions:
                contributions.extend(extension.get(contrib_point_name))
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
    def load(
        cls,
        app_ctx: Any,
        extension_refs: list[str],
    ) -> "ExtensionContext":
        """Create a new extension context from the given application context
        and list of extension references.

        Args:
            app_ctx: Application context object passed to a contribution's
                layout factory and callback functions.
            extension_refs: Extension references where each item must
                have the form ``"module.attribute"``.
        Returns:
            A new extension context.
        """
        extensions: list[Extension] = []
        for ext_ref in extension_refs:
            try:
                module_name, attr_name = ext_ref.rsplit(".", maxsplit=1)
            except (ValueError, AttributeError):
                raise ValueError(f"contribution syntax error: {ext_ref!r}")
            module = importlib.import_module(module_name)
            extension = getattr(module, attr_name)
            if not isinstance(extension, Extension):
                raise TypeError(
                    f"extension reference {ext_ref!r} is not referring to an"
                    f" instance of chartlets.Extension"
                )
            extensions.append(extension)
        return ExtensionContext(app_ctx, extensions)
