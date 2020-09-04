from django.http import Http404
from django.shortcuts import render, redirect
from django.views.generic.base import TemplateView, View
from rest_framework.viewsets import ModelViewSet
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAdminUser
from lunch.serializer import UserSerializer
# from django.contrib.auth.models import User


class AdminPanelView(View):
    template_name = 'admin.html'

    def get(self, request, *args, **kwargs):
        if request.user.is_superuser:
            return render(request, self.template_name)
        raise Http404()


class Test(TemplateView):
    template_name = 'first.html'


class UserModelViewSet(ModelViewSet):
    queryset = get_user_model().objects.all().order_by("pk")
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]
