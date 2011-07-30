#!/usr/bin/python
# -*- coding: utf-8 -*-

from json import dumps

from django.conf import settings
from django.shortcuts import render
from django.http import HttpResponse

from myimgat.providers.google import GoogleImageProvider

DEFAULT_USER_WALL = getattr(settings, "DEFAULT_USER_WALL", "heynemann")

def load_username(func):
    def _load_username(*args, **kwargs):
        request = args[0]
        if not request.user.is_authenticated():
            username = DEFAULT_USER_WALL
        else:
            username = request.user.email.split('@')[0]
        kwargs['username'] = kwargs.get('username', username)
        return func(*args, **kwargs)
    return _load_username

@load_username
def index(request, username=None):
    return render(request, 'wall/index.html', {'username': username})

@load_username
def albums(request, username=None, extension="json"):
    provider = GoogleImageProvider(username)
    albums = provider.load_albums()
    for album in albums:
        provider.load_photos(album)

    data = []
    for album in albums:
        album_data = ({
            'identifier': album.identifier,
            'url': album.url,
            'title': album.title,
            'photos': []
        })
        for photo in album.photos:
            album_data['photos'].append({
                'url': photo.url,
                'title': photo.title,
                'thumbnail': photo.thumbnail,
                'width': photo.width,
                'height': photo.height
            })
        data.append(album_data)
    data = dumps(data)

    if extension == "json":
        return HttpResponse(data, mimetype="application/json")
    callback = 'callback' in request.GET and 'albums_loaded'
    return HttpResponse('%s(%s)' % (callback, data), mimetype="application/json")

