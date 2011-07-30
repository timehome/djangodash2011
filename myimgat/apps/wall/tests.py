#!/usr/bin/python
# -*- coding: utf-8 -*-

from django.test import TestCase
from django import template
from django.template import Context
from django.conf import settings

from wall.models import Photo, Album

class WallViewTest(TestCase):
    def test_access_the_index(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)

    def test_access_the_specific_user_wall(self):
        response = self.client.get('/rafael.jacinto')
        self.assertEqual(response.status_code, 200)

    def test_access_the_specific_user_wall_as_json(self):
        response = self.client.get('/api/rafael.jacinto.json')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.content.startswith("["))

    def test_access_the_specific_user_wall_as_jsonp_if_callback_present(self):
        response = self.client.get('/api/rafael.jacinto.jsonp')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.content.startswith("albums_loaded(["))

class PhotoAbsoluteUrlsAndViews(TestCase):

    def setUp(self):
        self.photo = Photo.objects.create(title="My photo.",
            url = "http://balbalabla",
            thumbnail = "http://hauhaiua",
            album = Album.objects.create(username="rafaelcaricio", identifier="boaboa"),
            width = 128,
            height = 128
        )

    def test_accessing_photo_directly_urls(self):
        response = self.client.get('/photo/0')
        self.assertEqual(response.status_code, 404)

    def test_gerating_photo_absolute_url(self):
        url = self.photo.get_absolute_url()
        self.assertEqual(url, "/photo/1")

    def test_url_absolute_url_exists(self):
        url = self.photo.get_absolute_url()
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

class TestTampletaTag(TestCase):
    def setUp(self):
        settings.THUMBOR_SERVER = "http://thby.nl"

    def render(self, t, **c):
        return template.Template('{% load thumbor_tags %}'+t).render(Context(c))

    def test_creatin_url(self):
        self.assertEqual("http://thby.nl/unsafe/100x100/myimgurl.jpg",
                            self.render('{% thumbor_url_unsafe "https://myimgurl.jpg" "100x100" %}'))

