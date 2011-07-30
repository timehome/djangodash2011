
from django.conf import settings
from django.conf.urls.defaults import patterns, include, url
from django.contrib import admin
from django.views.generic.simple import redirect_to

admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', include('wall.urls')),
    url('^favicon.ico$', redirect_to, {'url': '%s/favicon.ico' % settings.STATIC_URL}),

    # admin
    url(r'^admin/', include(admin.site.urls)),
)
