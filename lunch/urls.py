from django.contrib import admin
from django.urls import path

from lunch.views import test

urlpatterns = [
    path('', test),
]
