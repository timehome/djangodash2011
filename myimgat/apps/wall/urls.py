#!/usr/bin/python
# -*- coding: utf-8 -*-

from django.conf.urls.defaults import patterns, url
from myimgat.apps.wall.views import index, albums, show_photo

urlpatterns = patterns('',
    url('^$', index),
    url('^api/(?P<username>[\w.]+).(?P<extension>(json|jsonp))$', albums),
    url('^(?P<username>[\w.]+)$', index),
    url('^photo/(?P<photo_id>\d+)$', show_photo, name="photo_url"),
)
