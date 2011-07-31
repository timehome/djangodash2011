
from django.conf import settings
from django.conf.urls.defaults import patterns, include, url
from django.contrib import admin
from django.views.generic.simple import redirect_to

admin.autodiscover()

urlpatterns = patterns('',
    url(r'', include('social_auth.urls')),
    url(r'^favicon.ico$', redirect_to, {'url': '%sfavicon.ico' % settings.STATIC_URL}),
    url(r'^logout/$', 'django.contrib.auth.views.logout', {"next_page": "/"}, name="logout"),
    url(r'^privacy-policy', redirect_to, {'url': '/'}),

    # admin
    url(r'^admin/', include(admin.site.urls)),
    url(r'', include('wall.urls')),
)
