import logging
import unittest

from chartlets.util.logger import LOGGER


class LoggerTest(unittest.TestCase):

    def test_logger(self):
        self.assertIsInstance(LOGGER, logging.Logger)
        self.assertEqual("chartlets", LOGGER.name)
