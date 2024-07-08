from . import views
from django.urls import path, include, re_path

urlpatterns = [
    path('dj-rest-auth/', include('dj_rest_auth.urls')),
    path('dj-rest-auth/registration/', include('dj_rest_auth.registration.urls')),
    path('user/profile/', views.ProfileView.as_view(), name='profile'),
    path('user/data/', views.UserView.as_view(), name='user data'),
    path('user/serv/get-media-file', views.GetMediaFile.as_view(), name='Get media file'),
    path('user/swipe/', views.SwipeView.as_view(), name='swipe'),
    path('user/conversations/', views.ConversationView.as_view(), name='conversations'),

]