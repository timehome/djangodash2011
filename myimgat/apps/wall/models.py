#!/usr/bin/python
# -*- coding: utf-8 -*-

from django.db import models
from django.core.urlresolvers import reverse

from myimgat.providers.google import GoogleImageProvider

class AlbumManager(models.Manager):
    def load(self, username):
        albums = Album.objects.filter(username=username)
        if not albums:
            albums = []
            provider = GoogleImageProvider(username)
            for album_base in provider.load_albums():
                album = Album()
                album.username = username
                album.identifier = album_base.identifier
                album.url = album_base.url
                album.title = album_base.title
                album.save()
                albums.append(album)
        return albums

class Album(models.Model):
    username = models.CharField(default="", blank=True, max_length=100, db_index=True)
    identifier = models.CharField(max_length=200, db_index=True)
    url = models.CharField(max_length=500, null=True, blank=True, db_index=True)
    title = models.CharField(max_length=200, null=True, blank=True)

class AlbumProxy(Album):
    objects = AlbumManager()

    class Meta:
        proxy = True

class PhotoManager(models.Manager):

    def load(self, album):
        photos = Photo.objects.filter(album=album)
        if not photos:
            photos = []
            provider = GoogleImageProvider(album.username)
            for photo_base in provider.load_photos(album):
                photo = Photo()
                photo.title = photo_base.title
                photo.thumbnail = photo_base.thumbnail
                photo.width = photo_base.width
                photo.height = photo_base.height
                photo.url = photo_base.url
                photo.album = album
                photo.save()
                photos.append(photo)
        return photos 


class Photo(models.Model):
    title = models.CharField(max_length=200, null=True, blank=True)
    url = models.CharField(max_length=500, db_index=True)
    thumbnail = models.CharField(max_length=500, db_index=True)
    album = models.ForeignKey(Album, related_name="photos")
    width = models.IntegerField(blank=True, null=True)
    height = models.IntegerField(blank=True, null=True)

    def get_absolute_url(self):
        return reverse("photo_url", kwargs={'photo_id': self.id})

class PhotoProxy(Photo):
    objects = PhotoManager()

    class Meta:
        proxy = True
