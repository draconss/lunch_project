from django.contrib import admin
from django.urls import path
from django.contrib.auth.views import LoginView
from lunch.views import Test

urlpatterns = [
    path('', Test.as_view(), name='first'),
    path('login/', LoginView.as_view(), name='login'),
]
