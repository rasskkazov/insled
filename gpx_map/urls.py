from django.urls import path
from gpx_map import views

urlpatterns = [
    path('', views.gpx_map, name='gpx_map'),
    path('files/', views.files, name='files'),
    path('gpx_map/tracks/<fileid>', views.trackView, name='trackView')
]