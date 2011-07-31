#!/usr/bin/python
# -*- coding: utf-8 -*-

from myimgat.providers.base import ImageProvider
from myimgat.providers.flickr import FlickrProvider

def test_should_be_a_provider():
    provider = FlickrProvider(user_id='11830608@N05')
    assert isinstance(provider, ImageProvider)

def test_should_load_albums():
    provider = FlickrProvider(user_id='11830608@N05')
    albums = provider.load_albums()
    assert albums

def test_albums_have_title_and_id():
    provider = FlickrProvider(user_id='11830608@N05')

    albums = provider.load_albums()
    for album in albums:
        assert album.identifier
        assert album.title
        assert album.url

def test_albums_can_load_their_photos():
    provider = FlickrProvider(user_id='11830608@N05')

    albums = provider.load_albums()

    for album in albums:
        provider.load_photos(album=album)

        for photo in album.photos:
            assert photo.title
            assert photo.url
            assert photo.thumbnail


