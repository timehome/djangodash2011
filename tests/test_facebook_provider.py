#!/usr/bin/python
# -*- coding: utf-8 -*-

from myimgat.providers.base import ImageProvider, Album
from myimgat.providers.fb import FacebookProvider

token = '145634995501895|2.AQAvL7Skbj-kL4lF.3600.1312074000.1-584129827|1ygEPCV1rdUCxOr8CWyqoW89OGI'

def test_should_be_a_provider():
    provider = FacebookProvider(token)
    assert isinstance(provider, ImageProvider)

def test_should_load_albums():
    provider = FacebookProvider(token)
    albums = provider.load_albums()
    assert albums

def test_albums_have_title_and_id():
    provider = FacebookProvider(token)

    albums = provider.load_albums()
    for album in albums:
        assert album.identifier
        assert album.title
        assert album.url

#def test_albums_can_load_their_photos():
    #provider = GoogleImageProvider('heynemann')

    #albums = provider.load_albums()

    #album = albums[1]
    #assert provider.load_photos(album=album)


