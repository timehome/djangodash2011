from django import template
from django.conf import settings

from libthumbor import CryptoURL
from providers.base import format_url

THUMBOR_SECURITY_KEY = getattr(settings, 'THUMBOR_SECURITY_KEY', 'my-security-key')
THUMBOR_SERVER = getattr(settings, "THUMBOR_SERVER", 'http://%d.thby.nl')

register = template.Library()

@register.simple_tag
def thumbor_url_unsafe(photo_original_url, endpoint):
    return "%s/unsafe/%s/%s" % (THUMBOR_SERVER, endpoint, format_url(photo_original_url))
