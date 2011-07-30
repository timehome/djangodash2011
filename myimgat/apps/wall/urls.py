#!/usr/bin/python
# -*- coding: utf-8 -*-

from django.conf.urls.defaults import patterns, url
from myimgat.apps.wall.views import index, albums

urlpatterns = patterns('',
    url('^$', index),
    url('(?P<username>[\w.]+?).(?P<extension>jsonp?)$', albums),
    url('(?P<username>[\w.]+?)/?$', index),
)
