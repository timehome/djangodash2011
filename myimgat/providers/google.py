#!/usr/bin/python
# -*- coding: utf-8 -*-

from os.path import join
import random

import gdata.photos.service
import gdata.media
import gdata.geo
from django.conf import settings

from myimgat.providers.base import ImageProvider, Album, Photo

THUMBOR_SECURITY_KEY = getattr(settings, 'THUMBOR_SECURITY_KEY', 'my-security-key')

class GoogleImageProvider(ImageProvider):
    def __init__(self, username, thumb_size=(128,128)):
        super(GoogleImageProvider, self).__init__(thumb_size)
        self.username = username

    def load_albums(self):
        parsed_albums = []
        gd_client = gdata.photos.service.PhotosService()
        try:
            albums = gd_client.GetUserFeed(user=self.username)
            for album in albums.entry:
                parsed_album = Album(identifier=album.gphoto_id.text, url=album.id.text, title=album.title.text)
                parsed_albums.append(parsed_album)
        except gdata.photos.service.GooglePhotosException:
            return []

        return parsed_albums

    def load_photos(self, album):
        photos_result = []
        gd_client = gdata.photos.service.PhotosService()
        photos = gd_client.GetFeed(
            '/data/feed/api/user/%s/albumid/%s?kind=photo' % (
                self.username, album.identifier))
        for photo in photos.entry:
            url = self.get_absolute_url(photo.content.src)
            thumb = self.get_thumb_url(photo.media.thumbnail[-1].url)
            server = '%d' in self.thumbor_server and self.thumbor_server % random.choice([1,2,3]) or self.thumbor_server
            photo = Photo(url=url, title=photo.title.text, thumbnail=join(server.rstrip('/'), thumb.lstrip('/')),
                          width=int(photo.width.text), height=int(photo.height.text))
            photos_result.append(photo)
        return photos_result
