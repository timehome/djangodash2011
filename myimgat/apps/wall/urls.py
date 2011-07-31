#!/usr/bin/python
# -*- coding: utf-8 -*-

from django.conf.urls.defaults import patterns, url
from django.views.generic.list_detail import object_detail

from wall.views import index, albums
from wall.models import CroppedPhoto, Photo

urlpatterns = patterns('',

    url('^$', index),

    url('^api/(?P<username>[\w.-_]+).(?P<extension>(json|jsonp))$', albums),

    url('^(?P<object_id>\d+)[.](?:jpe?g|gif|png)$', object_detail, {
            'queryset': CroppedPhoto.objects.all(),
            'template_object_name': 'photo',
        }, name="cropped_photo_url"),

    url('^(?P<username>[\w.-_]+)$', index),

    url('^photo/(?P<object_id>\d+)$', object_detail, {
            'queryset': Photo.objects.all(),
            'template_object_name': 'photo',
        }, name="photo_url"),

)
