
from django.conf import settings
from django.conf.urls.defaults import patterns, include, url
from django.contrib import admin
from django.views.generic.simple import redirect_to

admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'myimgat.views.home', name='home'),
    url(r'^$', include('wall.urls')),
    url('^favicon.ico$', redirect_to, {'url': '%s/favicon.ico' % settings.STATIC_URL}),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)
