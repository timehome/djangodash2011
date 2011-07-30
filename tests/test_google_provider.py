#!/usr/bin/python
# -*- coding: utf-8 -*-

from myimgat.providers.base import ImageProvider
from myimgat.providers.google import GoogleImageProvider

def should_be_a_provider():
    provider = GoogleImageProvider()
    assert isinstance(provider, ImageProvider)
