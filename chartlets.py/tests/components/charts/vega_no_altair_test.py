import importlib
import pathlib
import sys

import pytest


def test_no_altair(monkeypatch: pytest.MonkeyPatch):
    """Test that the VegaChart component handles the absense
    of "altair" gracefully.
    """
    project_root = pathlib.Path(__file__).absolute().parent
    while (
        project_root.parent != project_root
        and not (project_root / "chartlets" / "__init__.py").exists()
    ):
        project_root = project_root.parent

    # Simulate the absence of the 'altair' module
    print("project_root:", project_root)
    monkeypatch.setattr(sys, "path", [f"{project_root}"])
    if "altair" in sys.modules:
        monkeypatch.delitem(sys.modules, "altair")

    # Import the code that handles the missing "altair" package
    importlib.invalidate_caches()
    vega_module = importlib.import_module("chartlets.components.charts.vega")
    importlib.reload(vega_module)

    # Assert "chartlets.components.charts.vega" handles the
    # missing package appropriately by using an "altair" dummy.
    altair = vega_module.altair
    assert altair is not None
    assert altair.Chart is int
