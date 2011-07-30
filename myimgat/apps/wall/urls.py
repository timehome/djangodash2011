#!/usr/bin/python
# -*- coding: utf-8 -*-

from django.conf.urls.defaults import patterns, url
from myimgat.apps.wall.views import index

urlpatterns = patterns('',
    url('^$', index),
    url('(?P<username>[\w.]+)/?$', index),
)
