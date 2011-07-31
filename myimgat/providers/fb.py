#!/usr/bin/python
# -*- coding: utf-8 -*-

import re
import random
from os.path import join

from social_auth.models import UserSocialAuth
from facebook import GraphAPI

from myimgat.providers.base import ImageProvider, Album, Photo

def format_url(url):
    return url.replace('http://', '').replace('https://', '')

class FacebookImageProvider(ImageProvider):
    def __init__(self, username, token=None):
        super(FacebookProvider, self).__init__()
        self.username = username
        self.token = token
        if not self.token:
            user_auth = UserSocialAuth.objects.get(username=self.username)
            self.token = user_auth.extra_data['access_token']

    def load_albums(self):
        albums = []
        api = GraphAPI(self.token)

        result = api.request('me/albums')
        until_re = re.compile('until=(\d+)')

        while result['data']:
            for item in result['data']:
                album = Album(identifier=item['id'], url=item['link'], title=item['name'])
                albums.append(album)
            until = until_re.search(result['paging']['next']).groups()[0]
            result = api.request('me/albums', {'limit': 25, 'until': until})

        return albums

    def load_photos(self, album):
        url = '%s/photos' % album.identifier

        api = GraphAPI(self.token)

        result = api.request(url)
        until_re = re.compile('until=(\d+)')

        while result and result['data']:
            for item in result['data']:
                image_url = self.get_absolute_url(item['source'])
                thumb = self.get_thumb_url(item['source'])
                server = '%d' in self.thumbor_server and self.thumbor_server % random.choice([1,2,3]) or self.thumbor_server
                photo = Photo(url=image_url, title=item['name'], thumbnail=join(server.rstrip('/'), thumb.lstrip('/')),
                          width=int(item['width']), height=int(item['height']))
                album.photos.append(photo)
 
            if 'paging' in result:
                until = until_re.search(result['paging']['next']).groups()[0]
                result = api.request(url, {'limit': 25, 'until': until})
            else:
                result = None


