#!/usr/bin/python
# -*- coding: utf-8 -*-

from django.conf import settings
from django.shortcuts import render

from myimgat.providers.google import GoogleImageProvider

DEFAULT_USER_WALL = getattr(settings, "DEFAULT_USER_WALL", "rafael.jacinto")

def index(request, username=None):
    if not username:
        if not request.user.is_authenticated():
            username = DEFAULT_USER_WALL
        else:
            username = request.user.email.split('@')[0]
    provider = GoogleImageProvider(username)
    albums = provider.load_albums()
    for album in albums:
        provider.load_photos(album)
    return render(request, 'wall/index.html', {
        'albums': albums
    })
