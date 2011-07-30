#!/usr/bin/python
# -*- coding: utf-8 -*-

from os.path import join
import random

import gdata.photos.service
import gdata.media
import gdata.geo
from django.conf import settings
from libthumbor import CryptoURL

from myimgat.providers.base import ImageProvider, Album, Photo

THUMBOR_SECURITY_KEY = getattr(settings, 'THUMBOR_SECURITY_KEY', 'my-security-key')

def format_url(url):
    return url.replace('http://', '').replace('https://', '')

class GoogleImageProvider(ImageProvider):
    def load_albums(self):
        parsed_albums = []
        gd_client = gdata.photos.service.PhotosService()
        albums = gd_client.GetUserFeed(user=self.username)
        for album in albums.entry:
            parsed_album = Album(identifier=album.gphoto_id.text, url=album.id.text, title=album.title.text)
            parsed_albums.append(parsed_album)

        return parsed_albums

    def load_photos(self, album):
        crypto = CryptoURL(key=THUMBOR_SECURITY_KEY)
        gd_client = gdata.photos.service.PhotosService()
        photos = gd_client.GetFeed(
            '/data/feed/api/user/%s/albumid/%s?kind=photo' % (
                self.username, album.identifier))
        for photo in photos.entry:
            url = format_url(photo.content.src)
            thumb = '/unsafe/%dx%d/smart/%s' % (self.thumb_size[0], self.thumb_size[1], format_url(photo.media.thumbnail[-1].url))
            #thumb = crypto.generate(
                #width=self.thumb_size[0],
                #height=self.thumb_size[1],
                #smart=True,
                #image_url=url
            #)
            server = '%d' in self.thumbor_server and self.thumbor_server % random.choice([1,2,3]) or self.thumbor_server
            photo = Photo(url=url, title=photo.title.text, thumbnail=join(server.rstrip('/'), thumb.lstrip('/')),
                          width=int(photo.width.text), height=int(photo.height.text))
            album.photos.append(photo)
