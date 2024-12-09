import unittest

import pytest

from chartlets import Contribution, Extension, ExtensionContext


class Panel(Contribution):
    pass


class ToolbarItem(Contribution):
    pass


test_ext = Extension("test", "0.1.4")


class ExtensionContextTest(unittest.TestCase):
    def setUp(self):
        Extension.reset_contrib_points()

    def tearDown(self):
        Extension.reset_contrib_points()

    def test_attributes(self):
        Extension.add_contrib_point("panels", Panel)
        Extension.add_contrib_point("toolbarItems", ToolbarItem)

        ext0 = Extension("ext0")
        ext0.add(Panel("panel0"))
        ext0.add(ToolbarItem("tbi0"))
        ext1 = Extension("ext1")
        ext1.add(Panel("panel1"))
        ext1.add(ToolbarItem("tbi1"))

        app_ctx = object()
        ext_ctx = ExtensionContext(app_ctx, [ext0, ext1])

        self.assertIs(app_ctx, ext_ctx.app_ctx)
        self.assertIsInstance(ext_ctx.extensions, list)
        self.assertEqual(2, len(ext_ctx.extensions))
        self.assertIsInstance(ext_ctx.contributions, dict)
        self.assertEqual(2, len(ext_ctx.contributions))


# noinspection PyMethodMayBeStatic
class ExtensionContextLoadTest(unittest.TestCase):
    def setUp(self):
        Extension.reset_contrib_points()

    def tearDown(self):
        Extension.reset_contrib_points()

    def test_load_ok(self):
        Extension.add_contrib_point("panels", Panel)
        test_ext.add(Panel("panel0"))
        test_ext.add(Panel("panel1"))
        test_ext.add(Panel("panel2"))

        app_ctx = object()
        ext_ctx = ExtensionContext.load(app_ctx, [f"{__name__}.test_ext"])

        self.assertIs(app_ctx, ext_ctx.app_ctx)
        self.assertEqual(1, len(ext_ctx.extensions))
        ext = ext_ctx.extensions[0]
        self.assertIsInstance(ext, Extension)
        self.assertEqual("test", ext.name)
        self.assertEqual("0.1.4", ext.version)
        panels = ext.get("panels")
        self.assertIsInstance(panels, list)
        self.assertEqual(3, len(panels))

    def test_load_invalid_ext_ref(self):
        app_ctx = object()
        with pytest.raises(ValueError, match="contribution syntax error: 'test_ext'"):
            ExtensionContext.load(app_ctx, [f"test_ext"])

    def test_load_invalid_ext_type(self):
        app_ctx = object()
        with pytest.raises(
            TypeError,
            match=(
                "extension reference 'tests.extensioncontext_test.ExtensionContextLoadTest'"
                " is not referring to an instance of chartlets.Extension"
            ),
        ):
            ExtensionContext.load(app_ctx, [f"{__name__}.ExtensionContextLoadTest"])
