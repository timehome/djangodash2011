#!/usr/bin/python
# -*- coding: utf-8 -*-

from django.test import TestCase

class WallViewTest(TestCase):
    def test_access_the_index(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)

    def test_access_the_specific_user_wall(self):
        response = self.client.get('/rafael.jacinto')
        self.assertEqual(response.status_code, 200)

    def test_access_the_specific_user_wall_as_json(self):
        response = self.client.get('/rafael.jacinto.json')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.content.startswith("["))

    def test_access_the_specific_user_wall_as_jsonp_if_callback_present(self):
        response = self.client.get('/rafael.jacinto.jsonp?callback=True')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.content.startswith("albums_loaded(["))
