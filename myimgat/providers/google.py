#!/usr/bin/python
# -*- coding: utf-8 -*-

from django.conf import settings

import gdata.photos.service
import gdata.media
import gdata.geo

from libthumbor import CryptoURL

from myimgat.providers.base import ImageProvider, Album, Photo

THUMBOR_SECURITY_KEY = getattr(settings, 'THUMBOR_SECURITY_KEY', 'my-security-key')

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
            url = photo.content.src
            thumb = crypto.generate(
                width=self.thumb_size[0],
                height=self.thumb_size[1],
                smart=True,
                image_url=url
            )
            album.photos.append(Photo(url=url, title=photo.title.text, thumbnail=thumb))
