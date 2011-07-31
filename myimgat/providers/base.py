#!/usr/bin/python
# -*- coding: utf-8 -*-

from django.conf import settings

DEFAULT_THUMB_SIZE = getattr(settings, "DEFAULT_THUMB_SIZE", (128, 128))
THUMBOR_SERVER = getattr(settings, "THUMBOR_SERVER", 'http://%d.thby.nl')

def format_url(url):
    return url.replace('http://', '').replace('https://', '')

class ImageProvider(object):
    def __init__(self, thumb_size=DEFAULT_THUMB_SIZE):
        self.thumb_size = thumb_size
        self.thumbor_server = THUMBOR_SERVER

    def load_albums(self):
        raise NotImplementedError()

    def load_photos(self, album):
        raise NotImplementedError()

    def get_absolute_url(self, url):
        return format_url(url)

    def get_thumb_url(self, url):
        return '/unsafe/%dx%d/smart/%s' % (self.thumb_size[0], self.thumb_size[1], format_url(url))


class Album(object):
    def __init__(self, identifier, url, title):
        self.identifier = identifier
        self.url = url
        self.title = title
        self.photos = []


class Photo(object):
    def __init__(self, url, title, thumbnail, width, height):
        self.url = url
        self.title = title
        self.thumbnail = thumbnail
        self.width = width
        self.height = height
