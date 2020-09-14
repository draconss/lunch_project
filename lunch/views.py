from django.http import Http404
from django.shortcuts import render, redirect
from django.views.generic.base import TemplateView, View
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.renderers import JSONRenderer
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAdminUser
from lunch.serializer import UserSerializer, RestaurantSerializer, CreateUserSerializer, ProposalSerializer, ProposalSerializerUpdateCreate, RestaurantSerializerData, VotingSerializer
from lunch.models import Restaurant, Proposal, Voting


class MultipleSerializersMixin(object):
    serializer_classes = dict()

    def get_serializer_class(self):
        try:
            return self.serializer_classes[self.action]
        except (KeyError, AttributeError):
            return super(MultipleSerializersMixin, self).get_serializer_class()

    def get_default_serializer_class(self):
        return self.serializer_class

    def get_default_serializer(self, *args, **kwargs):
        """
        Return the serializer instance that should be used for validating and
        deserializing input, and for serializing output.
        """
        serializer_class = self.get_default_serializer_class()
        kwargs['context'] = self.get_serializer_context()
        return serializer_class(*args, **kwargs)


class AdminPanelView(View):
    template_name = 'admin.html'

    def get(self, request, *args, **kwargs):
        if request.user.is_superuser:
            return render(request, self.template_name)
        raise Http404()


class Test(TemplateView):
    template_name = 'first.html'


class UserModelViewSet(MultipleSerializersMixin, ModelViewSet):
    queryset = get_user_model().objects.exclude(is_superuser=True).order_by("pk")
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]
    serializer_classes = dict(create=CreateUserSerializer)


class RestaurantViewSet(ModelViewSet):
    queryset = Restaurant.objects.all().order_by("pk")
    serializer_class = RestaurantSerializer
    permission_classes = [IsAdminUser]


class ProposalViewSet(MultipleSerializersMixin, ModelViewSet):
    queryset = Proposal.objects.all().order_by("pk")
    serializer_class = ProposalSerializer
    permission_classes = [IsAdminUser]
    serializer_classes = dict(create=ProposalSerializerUpdateCreate, update=ProposalSerializerUpdateCreate)


class RestaurantOnlyReadViewSet(ReadOnlyModelViewSet):
    queryset = Restaurant.objects.all().order_by("pk")
    serializer_class = RestaurantSerializerData
    permission_classes = [IsAdminUser]


class VotingViewSet(ModelViewSet):
    queryset = Voting.objects.all().order_by('pk')
    serializer_class = VotingSerializer
    permission_classes = [IsAdminUser]

