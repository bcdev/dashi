import unittest
from typing import Any

import pytest

from chartlets.util.assertions import assert_is_not_none
from chartlets.util.assertions import assert_is_not_empty
from chartlets.util.assertions import assert_is_one_of
from chartlets.util.assertions import assert_is_instance_of


# noinspection PyMethodMayBeStatic
class AssertIsNotNoneTest(unittest.TestCase):

    def test_ok(self):
        assert_is_not_none("x", 0)
        assert_is_not_none("x", "")
        assert_is_not_none("x", [])

    def test_raises(self):
        with pytest.raises(ValueError, match="value for 'x' must not be None"):
            assert_is_not_none("x", None)


# noinspection PyMethodMayBeStatic
class AssertIsNotEmptyTest(unittest.TestCase):

    def test_ok(self):
        assert_is_not_empty("x", "Hallo")
        assert_is_not_empty("x", 0)
        assert_is_not_empty("x", 1)
        assert_is_not_empty("x", True)
        assert_is_not_empty("x", False)

    def test_raises(self):
        with pytest.raises(ValueError, match="value for 'x' must be given"):
            assert_is_not_empty("x", None)
        with pytest.raises(ValueError, match="value for 'x' must not be empty"):
            assert_is_not_empty("x", "")
        with pytest.raises(ValueError, match="value for 'x' must not be empty"):
            assert_is_not_empty("x", [])


# noinspection PyMethodMayBeStatic
class AssertIsOneOfTest(unittest.TestCase):

    def test_ok(self):
        assert_is_one_of("x", "a", ("a", 2, True))
        assert_is_one_of("x", 2, ("a", 2, True))
        assert_is_one_of("x", True, ("a", 2, True))

    def test_raises(self):
        with pytest.raises(
            ValueError,
            match="value of 'x' must be one of \\('a', 2, True\\), but was 'b'",
        ):
            assert_is_one_of("x", "b", ("a", 2, True))


# noinspection PyMethodMayBeStatic
class AssertIsInstanceOfTest(unittest.TestCase):

    def test_ok(self):
        assert_is_instance_of("x", "a", (int, str))
        assert_is_instance_of("x", 2, (int, str))
        assert_is_instance_of("x", True, bool)

    def test_raises(self):
        with pytest.raises(
            TypeError, match="value of 'x' must be of type str, but was int"
        ):
            assert_is_instance_of("x", 2, str)

        with pytest.raises(
            TypeError, match="value of 'x' must be of type int or str, but was object"
        ):
            assert_is_instance_of("x", object(), (int, str))

        with pytest.raises(
            TypeError, match="value of 'x' must be of type str, but was None"
        ):
            assert_is_instance_of("x", None, str)
