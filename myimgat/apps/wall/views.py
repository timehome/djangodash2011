#!/usr/bin/python
# -*- coding: utf-8 -*-

from django.shortcuts import render

from myimgat.providers.google import GoogleImageProvider

def index(request):
    provider = GoogleImageProvider('heynemann')
    albums = provider.load_albums()
    provider.load_photos(albums[5])
    return render(request, 'wall/index.html', {
        'albums': albums
    })
