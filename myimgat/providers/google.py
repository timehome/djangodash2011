#!/usr/bin/python
# -*- coding: utf-8 -*-

import gdata.photos.service
import gdata.media
import gdata.geo
from myimgat.providers.base import ImageProvider, Album

class GoogleImageProvider(ImageProvider):
    def load_albums(self, username):
        parsed_albums = []
        gd_client = gdata.photos.service.PhotosService()
        albums = gd_client.GetUserFeed(user=username)
        for album in albums.entry:
            parsed_album = Album(identifier=album.id.text, title=album.title.text)
            parsed_albums.append(parsed_album)
 
        return parsed_albums
