#!/usr/bin/python
# -*- coding: utf-8 -*-

from django.conf import settings

DEFAULT_THUMB_SIZE = getattr(settings, "DEFAULT_THUMB_SIZE", (128, 128))

class ImageProvider(object):
    def __init__(self, username, thumb_size=DEFAULT_THUMB_SIZE):
        self.username = username
        self.thumb_size = thumb_size

    def load_albums(self):
        raise NotImplementedError()

    def load_photos(self, album):
        raise NotImplementedError()


class Album(object):
    def __init__(self, identifier, url, title):
        self.identifier = identifier
        self.url = url
        self.title = title
        self.photos = []


class Photo(object):
    def __init__(self, url, title, thumbnail):
        self.url = url
        self.title = title
        self.thumbnail = thumbnail
