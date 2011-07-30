#!/usr/bin/python
# -*- coding: utf-8 -*-

class ImageProvider(object):
    pass

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
