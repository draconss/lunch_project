from django.db.models import Count
from django.http import Http404
from django.shortcuts import render, redirect
from django.utils import timezone
from django.views.generic.base import TemplateView, View
from rest_framework import status, mixins
from rest_framework.exceptions import ValidationError
from rest_framework.generics import get_object_or_404, GenericAPIView, RetrieveAPIView, ListAPIView
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet, GenericViewSet
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from lunch.serializer import UserSerializer, RestaurantSerializer, CreateUserSerializer, ProposalSerializer, \
    ProposalSerializerUpdateCreate, RestaurantSerializerData, VotingSerializer, VoteSerializer, CurrentVotingSerializer, \
     ResultsVotingSerializer
from lunch.models import Restaurant, Proposal, Voting, Vote


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
    queryset = Voting.objects.all().order_by('-date')
    serializer_class = VotingSerializer
    permission_classes = [IsAdminUser]

    def create(self, request, *args, **kwargs):
        if Voting.objects.filter(date=timezone.now().date()).exists():
            raise ValidationError({'voting': 'you can not create voting today'})
        return super().create(request, *args, **kwargs)


class TodayVotingViewSet(RetrieveAPIView):
    queryset = Voting.objects.filter(date=timezone.now().date()).prefetch_related('proposal__restaurant')
    serializer_class = CurrentVotingSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(self.get_queryset())


class VoteViewSet(mixins.CreateModelMixin, mixins.ListModelMixin, GenericViewSet):
    queryset = Vote.objects.filter(voting__date=timezone.now().date())
    serializer_class = VoteSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        if Vote.objects.filter(voting__date=timezone.now().date(), user=request.user.pk).exists():
            raise ValidationError({'voting': 'you can\'t vote today anymore'})
        return super().create(request, *args, **kwargs)


class ResultsVotingView(ListAPIView):
    queryset = Vote.objects.filter(voting__date=timezone.now().date()).select_related('user')
    serializer_class = ResultsVotingSerializer
    permission_classes = [IsAuthenticated]
