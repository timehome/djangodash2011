#!/usr/bin/python
# -*- coding: utf-8 -*-

from myimgat.providers.base import ImageProvider
from myimgat.providers.google import GoogleImageProvider

def test_should_be_a_provider():
    provider = GoogleImageProvider()
    assert isinstance(provider, ImageProvider)

def test_should_load_albums():
    provider = GoogleImageProvider()
    albums = provider.load_albums(username='heynemann')
    assert albums

def test_albums_have_title_and_id():
    provider = GoogleImageProvider()

    albums = provider.load_albums(username='heynemann')
    for album in albums:
        assert album.identifier
        assert album.title
