#!/usr/bin/python
# -*- coding: utf-8 -*-

from json import dumps
from os.path import join

from django.conf import settings
from django.shortcuts import render
from django.http import Http404, HttpResponse, HttpResponsePermanentRedirect
from django.core.urlresolvers import reverse

from providers.base import format_url

from models import AlbumProxy, PhotoProxy, Photo, CroppedPhoto

DEFAULT_USER_WALL = getattr(settings, "DEFAULT_USER_WALL", "heynemann")
THUMBOR_SERVER = getattr(settings, "THUMBOR_SERVER", 'http://%d.thby.nl')

def load_username(func):
    def _load_username(*args, **kwargs):
        request = args[0]
        if not request.user.is_authenticated():
            username = DEFAULT_USER_WALL
        else:
            username = request.user.username
        kwargs['username'] = kwargs.get('username', username)
        return func(*args, **kwargs)
    return _load_username

@load_username
def index(request, username=None):
    still_unassociated = [
        {
            "class": "facebook",
            "label": "Associate with Facebook",
            "url": reverse("socialauth_associate_begin", args=["facebook"])
        },
        {
            "class": "google",
            "label": "Associate with Picasa",
            "url": reverse("socialauth_associate_begin", args=["google"])
        }
    ]
    if request.user.is_authenticated():
        for social_auth in request.user.social_auth.all():
            still_unassociated = filter(lambda x: x['class'] != social_auth.provider, still_unassociated)
    return render(request, 'wall/index.html', {'username': username, 
                               'still_unassociated': still_unassociated})

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
                'id': photo.id,
                'url': photo.url,
                'title': photo.title,
                'thumbnail': photo.thumbnail,
                'crop_url': "%s/unsafe/%s/%s" % (THUMBOR_SERVER, 'fit-in/600x400', format_url(photo.url)),
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

@load_username
def save_cropped_photo(request, username=None):
    identifier = request.POST['id']
    photo = Photo.objects.get(id=int(identifier))

    left = request.POST['left']
    top = request.POST['top']
    width = request.POST['width']
    height = request.POST['height']

    fake_original = "%s/unsafe/%s/%s" % (THUMBOR_SERVER, 'fit-in/600x400', format_url(photo.url))

    url = '/unsafe/%dx%d:%dx%d/smart/%s' % (
        int(left),
        int(top),
        int(left) + int(width),
        int(top) + int(height),
        fake_original
    )

    cropped = CroppedPhoto.objects.get_or_create(
        original_photo=photo,
        url=url,
        hash=CroppedPhoto.get_hash(url)
    )

    return HttpResponse(request.build_absolute_uri('../' + cropped.get_absolute_url()))

def shortened_url(request, image_hash):
    obj = CroppedPhoto.objects.get(hash=image_hash)
    if not obj:
        raise Http404()
    return HttpResponsePermanentRedirect(join(settings.THUMBOR_SERVER.rstrip('/'), obj.url.lstrip('/')))

