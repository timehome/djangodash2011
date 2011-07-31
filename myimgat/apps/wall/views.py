#!/usr/bin/python
# -*- coding: utf-8 -*-

from json import dumps

from django.conf import settings
from django.shortcuts import render
from django.http import Http404, HttpResponse

from providers.base import format_url

from models import AlbumProxy, PhotoProxy

DEFAULT_USER_WALL = getattr(settings, "DEFAULT_USER_WALL", "heynemann")
THUMBOR_SERVER = getattr(settings, "THUMBOR_SERVER", 'http://%d.thby.nl')

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
    data = []
    for album in AlbumProxy.objects.load(username):
        album_data = {
            'identifier': album.identifier,
            'url': album.url,
            'title': album.title,
            'photos': []
        }
        for photo in PhotoProxy.objects.load(album):
            album_data['photos'].append({
                'url': photo.url,
                'title': photo.title,
                'thumbnail': photo.thumbnail,
                'crop_url': "%s/unsafe/%s/%s" % (THUMBOR_SERVER, 'fit-in/600x500', format_url(photo.url)),
                'width': photo.width,
                'height': photo.height
            })
        data.append(album_data)
    data = dumps(data)

    if extension == "json":
        return HttpResponse(data, mimetype="application/json")
    elif extension == "jsonp":
        return HttpResponse('albums_loaded(%s)' % data, mimetype="application/json")
    else:
        raise Http404
