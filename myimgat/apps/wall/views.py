#!/usr/bin/python
# -*- coding: utf-8 -*-

from django.shortcuts import render

from myimgat.providers.google import GoogleImageProvider

def index(request, username=None):
    provider = GoogleImageProvider(username)
    albums = provider.load_albums()
    for album in albums:
        provider.load_photos(album)
    return render(request, 'wall/index.html', {
        'albums': albums
    })
