#!/usr/bin/python
# -*- coding: utf-8 -*-

from django.db import models

class Album(models.Model):
    identifier = models.CharField(max_length=200, db_index=True)
    url = models.CharField(max_length=500, required=False, blank=True, db_index=True)
    title = models.CharField(max_length=200, required=False, blank=True)

class Photo(models.Model):
    title = models.CharField(max_length=200, required=False, blank=True)
    url = models.CharField(max_length=500, db_index=True)
    thumbnail = models.CharField(max_length=500, db_index=True)
    album = models.ForegeinKey(Album, related_name="photos")
