#!/usr/bin/python
# -*- coding: utf-8 -*-
import logging
from datetime import datetime, timedelta
from os.path import splitext
from hashlib import md5

from django.db import models
from django.conf import settings
from django.core.urlresolvers import reverse
from django.contrib.auth.models import User
from django.db.models.signals import post_save

from social_auth.models import UserSocialAuth
from social_auth.backends.facebook import FacebookBackend
from social_auth.backends.google import GoogleBackend

from myimgat.providers.google import GoogleImageProvider
from myimgat.providers.fb import FacebookImageProvider

UPDATE_ALBUMS_DAYS_INTERVAL = getattr(settings, 'UPDATE_ALBUMS_DAYS_INTERVAL', 1)
DEFAULT_USER_WALL = getattr(settings, "DEFAULT_USER_WALL", "heynemann")

providers_classes = locals()

class Provider(models.Model):
    username = models.CharField(default=DEFAULT_USER_WALL, blank=True, max_length=100, db_index=True)
    provider_name = models.CharField(max_length=100)
    update_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        return datetime.now() > self.update_at

    def mark_as_updated(self):
        self.update_at = datetime.now() + timedelta(days=UPDATE_ALBUMS_DAYS_INTERVAL)

def create_provider(provider_type):
    def _create_provider(sender, instance, created, **kwargs):
        if created and provider_type.lower() == instance.provider.lower():
            Provider.objects.create(username=instance.user.username, provider_name=provider_type,
                    update_at=datetime.now() + timedelta(days=UPDATE_ALBUMS_DAYS_INTERVAL))
        return True
    return _create_provider

facebook_post_save = create_provider("Facebook")
google_post_save = create_provider("Google")

post_save.connect(facebook_post_save, sender=UserSocialAuth)
post_save.connect(google_post_save, sender=UserSocialAuth)

class ProvidersHelper(object):
    def get_username_and_providers(self, username):
        try:
            user = User.objects.get(username=username)
            username = user.username
            providers = Provider.objects.filter(username=user.username)
        except User.DoesNotExist:
            providers = [Provider(provider_name='Google', update_at=datetime.now() - timedelta(days=1))]
        return username, providers

class AlbumManager(models.Manager, ProvidersHelper):
    def load(self, username, force_update=False):
        username, providers = self.get_username_and_providers(username)
        albums = Album.objects.filter(username=username)
        if not force_update:
            providers = filter(lambda p: p.is_expired(), providers)
        if (not albums or force_update) and providers:
            albums = []
            for provider in providers:
                try:
                    remote_provider = providers_classes['%sImageProvider' % provider.provider_name](username)
                    for album_base in remote_provider.load_albums():
                        album, created = Album.objects.get_or_create(identifier=album_base.identifier, defaults={
                            'username': username,
                            'url': album_base.url,
                            'title': album_base.title,
                        })
                        albums.append(album)
                    provider.mark_as_updated()
                except:
                    logging.error("Problem on loading info from provider [%s]" % str(provider))
        return albums

class Album(models.Model):
    username = models.CharField(default="", blank=True, max_length=100, db_index=True)
    identifier = models.CharField(max_length=200, db_index=True)
    url = models.CharField(max_length=300, null=True, blank=True, db_index=True)
    title = models.CharField(max_length=4000, null=True, blank=True)

class AlbumProxy(Album):
    objects = AlbumManager()

    class Meta:
        proxy = True

class PhotoManager(models.Manager, ProvidersHelper):

    def load(self, album, force_update=False):
        username, providers = self.get_username_and_providers(album.username)
        photos = Photo.objects.filter(album=album)
        if not force_update:
            providers = filter(lambda p: p.is_expired(), providers)
        if (not photos or force_update) and providers:
            photos = []
            for provider in providers:
                try:
                    remote_provider = providers_classes['%sImageProvider' % provider.provider_name](username)
                    for photo_base in remote_provider.load_photos(album):
                        photo, created = Photo.objects.get_or_create(url=photo_base.url, defaults={
                            'title': photo_base.title,
                            'width': photo_base.width,
                            'height': photo_base.height,
                            'thumbnail': photo_base.thumbnail,
                            'album': album,
                        })
                        photos.append(photo)
                    provider.mark_as_updated()
                except:
                    logging.error("Problem on loading photos from provider [%s]" % str(provider.provider_name))
        return photos 


class Photo(models.Model):
    title = models.CharField(max_length=4000, null=True, blank=True)
    url = models.CharField(max_length=500, db_index=True)
    thumbnail = models.CharField(max_length=500, db_index=True)
    album = models.ForeignKey(Album, related_name="photos")
    width = models.IntegerField(blank=True, null=True)
    height = models.IntegerField(blank=True, null=True)

    def get_absolute_url(self):
        return reverse("photo_url", kwargs={'object_id': self.id})

class PhotoProxy(Photo):
    objects = PhotoManager()

    class Meta:
        proxy = True

class CroppedPhoto(models.Model):
    original_photo = models.ForeignKey(Photo, related_name='crops')
    user = models.ForeignKey(User, blank=True, null=True, related_name='cropped_photos')
    url = models.CharField(max_length=500, db_index=True)
    hash = models.CharField(max_length=200, null=True, db_index=True)

    @classmethod
    def get_hash(cls, url):
        return md5(url).hexdigest()

    def get_absolute_url(self):
        return "%s.%s" % (self.hash, splitext(self.url)[-1].lstrip('.'))

