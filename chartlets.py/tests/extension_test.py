import unittest

import pytest

from chartlets import Extension


# noinspection PyMethodMayBeStatic
class ExtensionTest(unittest.TestCase):

    def setUp(self):
        Extension.reset_contrib_points()

    def tearDown(self):
        Extension.reset_contrib_points()

    def test_attributes(self):  #
        ext = Extension("ext")
        self.assertEqual("ext", ext.name)
        self.assertEqual("0.0.0", ext.version)

    def test_to_dict(self):
        ext = Extension("ext")
        self.assertEqual(
            {"contributes": [], "name": "ext", "version": "0.0.0"},
            ext.to_dict(),
        )

    def test_add(self):
        ext = Extension("ext")
        with pytest.raises(TypeError, match="unrecognized contribution of type str"):
            # noinspection PyTypeChecker
            ext.add("x")

    def test_add_contrib_point(self):
        with pytest.raises(
            TypeError,
            match="item_type must be a class derived from chartlets.Contribution",
        ):
            # noinspection PyTypeChecker
            Extension.add_contrib_point("panels", "Panel")

        with pytest.raises(
            TypeError,
            match="item_type must be a class derived from chartlets.Contribution, but was str",
        ):
            # noinspection PyTypeChecker
            Extension.add_contrib_point("panels", str)
