#!/usr/bin/python
# -*- coding: utf-8 -*-

from django.conf.urls.defaults import patterns, url
from django.views.generic.list_detail import object_detail

from wall.views import index, albums, save_cropped_photo, shortened_url
from wall.models import Photo, CroppedPhoto

urlpatterns = patterns('',

    url('^$', index),

    url('^api/shorten/?$', save_cropped_photo),
    url('^api/(?P<username>[\w._-]+).(?P<extension>(json|jsonp))$', albums),
    url('^(?P<image_hash>.+?)[.](?:jpe?g|gif|png|JPE?G|GIF|PNG)$', shortened_url),

    url('^(?P<username>[\w._-]+)$', index),

    url('^photo/(?P<object_id>\d+)$', object_detail, {
            'queryset': Photo.objects.all(),
            'template_object_name': 'photo',
        }, name="photo_url"),

    url('^shared_photo/(?P<object_id>\d+)$', object_detail, {
            'queryset': CroppedPhoto.objects.all(),
            'template_object_name': 'photo',
        }, name="photo_url"),

)
