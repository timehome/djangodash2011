#!/usr/bin/python
# -*- coding: utf-8 -*-

from myimgat.providers.base import ImageProvider, Album
from myimgat.providers.google import GoogleImageProvider

def test_should_be_a_provider():
    provider = GoogleImageProvider('heynemann')
    assert isinstance(provider, ImageProvider)

def test_album_has_proper_defaults():
    album = Album(1, 'url', 'album')
    assert album.identifier == 1
    assert album.title == 'album'
    assert album.url == 'url'
    assert not album.photos

def test_should_load_albums():
    provider = GoogleImageProvider('heynemann')
    albums = provider.load_albums()
    assert albums

def test_albums_have_title_and_id():
    provider = GoogleImageProvider('heynemann')

    albums = provider.load_albums()
    for album in albums:
        assert album.identifier
        assert album.title
        assert album.url

def test_albums_can_load_their_photos():
    provider = GoogleImageProvider('heynemann')

    albums = provider.load_albums()

    album = albums[1]
    provider.load_photos(album=album)

    assert album.photos


