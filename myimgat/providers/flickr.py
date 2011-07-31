#!/usr/bin/python
# -*- coding: utf-8 -*-

import random
from os.path import join
from urllib2 import urlopen
from json import loads

from django.conf import settings

from myimgat.providers.base import ImageProvider, Album, Photo


class FlickrProvider(ImageProvider):
    def __init__(self, user_id):
        super(FlickrProvider, self).__init__()
        self.user_id = user_id

    def album_url(self, user_id, photoset_id):
        url = 'http://www.flickr.com/photos/%(user_id)s/sets/%(photoset_id)s' % {
            'user_id': user_id,
            'photoset_id': photoset_id
        }

        return url

    def photo_url(self, farm_id, server_id, photo_id, photo_secret, size='m', photo_format='jpg'):
        if size == 'o':
            size = ''

        url = 'http://farm%(farm_id)s.static.flickr.com/%(server_id)s/%(photo_id)s_%(photo_secret)s%(size)s.%(photo_format)s' % {
            'farm_id': farm_id,
            'server_id': server_id,
            'photo_id': photo_id,
            'photo_secret': photo_secret,
            'size': size and ('_%s' % size) or size,
            'photo_format': photo_format
        }
        return url

    def load_albums(self):
        albums = [
            Album(identifier='default', url='default', title='No Gallery')
        ]

        url = 'http://api.flickr.com/services/rest/?method=flickr.photosets.getList&api_key=%(api_key)s&user_id=%(user_id)s&format=json&nojsoncallback=1'
        url = url % {
            'api_key': settings.FLICKR_API_KEY,
            'user_id': self.user_id
        }

        result = urlopen(url).read()
        result = loads(result)

        for item in result['photosets']['photoset']:
            albums.append(Album(identifier=item['id'], url=self.album_url(self.user_id, item['id']), title=item['title']['_content']))

        return albums

    def load_photos(self, album):
        if album.identifier == 'default':
            self.load_default_photos(album)
            return album.photos

        url = 'http://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=%(api_key)s&photoset_id=%(photoset_id)s&per_page=200&page=%(page)d&format=json&nojsoncallback=1'

        page_url = url % {
            'api_key': settings.FLICKR_API_KEY,
            'photoset_id': album.identifier,
            'page': 1
        }

        result = urlopen(page_url).read()
        result = loads(result)

        def parse_results(items):
            for item in items['photoset']['photo']:
                url = self.get_absolute_url(self.photo_url(item['farm'], item['server'], item['id'], item['secret'], size='o'))
                thumb = self.get_absolute_url(self.photo_url(item['farm'], item['server'], item['id'], item['secret'], size='m'))
                thumb = self.get_thumb_url(thumb)
                server = '%d' in self.thumbor_server and self.thumbor_server % random.choice([1,2,3]) or self.thumbor_server
                photo = Photo(url=url, title=item['title'], thumbnail=join(server.rstrip('/'), thumb.lstrip('/')),
                              width=None, height=None)
                album.photos.append(photo)

        parse_results(result)

        total_pages = int(result['photoset']['pages'])
        if total_pages > 0:
            for page in range(total_pages - 1):
                page_url = url % {
                    'api_key': settings.FLICKR_API_KEY,
                    'photoset_id': album.identifier,
                    'page': page + 1
                }

                result = urlopen(page_url).read()
                result = loads(result)
                parse_results(result)

        return album.photos

    def load_default_photos(self, album):
        url = 'http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=%(api_key)s&user_id=%(user_id)s&per_page=200&page=%(page)d&format=json&nojsoncallback=1'
        page_url = url % {
            'api_key': settings.FLICKR_API_KEY,
            'user_id': self.user_id,
            'page': 1
        }

        result = urlopen(page_url).read()
        result = loads(result)

        def parse_results(items):
            for item in items['photos']['photo']:
                if not item['ispublic']: continue

                url = self.get_absolute_url(self.photo_url(item['farm'], item['server'], item['id'], item['secret'], size='o'))
                thumb = self.get_absolute_url(self.photo_url(item['farm'], item['server'], item['id'], item['secret'], size='m'))
                thumb = self.get_thumb_url(thumb)
                server = '%d' in self.thumbor_server and self.thumbor_server % random.choice([1,2,3]) or self.thumbor_server
                photo = Photo(url=url, title=item['title'], thumbnail=join(server.rstrip('/'), thumb.lstrip('/')),
                              width=None, height=None)
                album.photos.append(photo)

        parse_results(result)

        total_pages = int(result['photos']['pages'])
        if total_pages > 1:
            for page in range(total_pages - 1):
                page_url = url % {
                    'api_key': settings.FLICKR_API_KEY,
                    'user_id': self.user_id,
                    'page': page + 1
                }

                result = urlopen(page_url).read()
                result = loads(result)
 
                parse_results(result)
