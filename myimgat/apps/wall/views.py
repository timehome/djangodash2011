#!/usr/bin/python
# -*- coding: utf-8 -*-

from json import dumps

from django.conf import settings
from django.shortcuts import render
from django.http import HttpResponse

from myimgat.providers.google import GoogleImageProvider

DEFAULT_USER_WALL = getattr(settings, "DEFAULT_USER_WALL", "heynemann")

def index(request, username=DEFAULT_USER_WALL):
    return render(request, 'wall/index.html')

def albums(request, username=DEFAULT_USER_WALL, extension="json"):
    provider = GoogleImageProvider(username)
    albums = provider.load_albums()
    #for album in albums:
    provider.load_photos(albums[5])

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
                'thumbnail': photo.thumbnail
            })
        data.append(album_data)
    data = dumps(data)

    if extension == "json":
        return HttpResponse(data, mimetype="application/json")
    callback = 'callback' in request.GET and request.GET['callback'] or 'albums_loaded'
    return HttpResponse('%s(%s)' % (callback, data), mimetype="application/json")

