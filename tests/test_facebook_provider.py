#!/usr/bin/python
# -*- coding: utf-8 -*-

from myimgat.providers.base import ImageProvider
from myimgat.providers import FacebookImageProvider

token = '145634995501895|2.AQAvL7Skbj-kL4lF.3600.1312074000.1-584129827|1ygEPCV1rdUCxOr8CWyqoW89OGI'

def test_should_be_a_provider():
    provider = FacebookImageProvider(token)
    assert isinstance(provider, ImageProvider)

def test_should_load_albums():
    provider = FacebookImageProvider(token)
    albums = provider.load_albums()
    assert albums

def test_albums_have_title_and_id():
    provider = FacebookImageProvider(token)

    albums = provider.load_albums()
    for album in albums:
        assert album.identifier
        assert album.title
        assert album.url

def test_albums_can_load_their_photos():
    provider = FacebookImageProvider(token)

    albums = provider.load_albums()

    album = albums[1]
    provider.load_photos(album=album)

    assert album.photos

    for photo in album.photos:
        assert photo.title
        assert photo.url
        assert photo.width > 0
        assert photo.height > 0


