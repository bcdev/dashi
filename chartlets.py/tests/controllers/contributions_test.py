import unittest

from chartlets import Response
from chartlets import Contribution, Extension, ExtensionContext
from chartlets.controllers import get_contributions


class Panel(Contribution):
    pass


Extension.add_contrib_point("panels", Panel)

ext0 = Extension("ext0")
ext0.add(Panel("panel00"))
ext0.add(Panel("panel01"))

ext1 = Extension("ext1")
ext1.add(Panel("panel10"))
ext1.add(Panel("panel11"))


class GetContributionsTest(unittest.TestCase):

    def test_success(self):
        app_ctx = object()
        ext_ctx = ExtensionContext(app_ctx, [ext0, ext1])
        response = get_contributions(ext_ctx)
        self.assertIsInstance(response, Response)
        self.assertEqual(200, response.status)
        self.assertEqual(
            {
                "extensions": [
                    {"contributes": ["panels"], "name": "ext0", "version": "0.0.0"},
                    {"contributes": ["panels"], "name": "ext1", "version": "0.0.0"},
                ],
                "contributions": {
                    "panels": [
                        {"extension": "ext0", "initialState": {}, "name": "panel00"},
                        {"extension": "ext0", "initialState": {}, "name": "panel01"},
                        {"extension": "ext1", "initialState": {}, "name": "panel10"},
                        {"extension": "ext1", "initialState": {}, "name": "panel11"},
                    ]
                },
            },
            response.data,
        )
