#!/usr/bin/python
# -*- coding: utf-8 -*-

from django.test import TestCase


class WallViewTest(TestCase):
    def test_access_the_specific_user_wall(self):
        response = self.client.get('/bernardo')
        self.assertEqual(response.status_code, 200)
