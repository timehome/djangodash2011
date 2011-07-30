#!/usr/bin/python
# -*- coding: utf-8 -*-

import re
from os.path import join

from facebook import GraphAPI

from myimgat.providers.base import ImageProvider, Album, Photo

def format_url(url):
    return url.replace('http://', '').replace('https://', '')

class FacebookProvider(ImageProvider):
    def __init__(self, token):
        super(FacebookProvider, self).__init__()
        self.token = token

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
        pass
