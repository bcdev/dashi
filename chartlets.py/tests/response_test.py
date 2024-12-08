import unittest

from chartlets import Response


class ResponseTest(unittest.TestCase):

    def test_success(self):
        response = Response.success([1, 2, 3])
        self.assertIsInstance(response, Response)
        self.assertEqual(True, response.ok)
        self.assertEqual([1, 2, 3], response.data)
        self.assertEqual(200, response.status)
        self.assertEqual(None, response.reason)

    def test_failed(self):
        response = Response.failed(501, "what the heck")
        self.assertIsInstance(response, Response)
        self.assertEqual(False, response.ok)
        self.assertEqual(None, response.data)
        self.assertEqual(501, response.status)
        self.assertEqual("what the heck", response.reason)
