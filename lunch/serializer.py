import operator
from abc import ABC

from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.utils import timezone
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.generics import get_object_or_404
from rest_framework.validators import UniqueValidator

from lunch.models import Restaurant, Proposal, Voting, Vote, VotingResults


class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True, validators=[UniqueValidator(queryset=get_user_model().objects.all())])

    class Meta:
        abstract = True
        model = get_user_model()
        fields = ('pk', 'username', 'email', 'first_name', 'last_name', 'is_active')
        read_only_fields = ('pk',)

    def update(self, instance, validated_data):
        password = validated_data.get('password')
        if password:
            validated_data['password'] = make_password(password)
        return super().update(instance, validated_data)


class CreateUserSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    email = serializers.EmailField(required=True, validators=[UniqueValidator(queryset=get_user_model().objects.all())])

    class Meta:
        model = get_user_model()
        fields = ('pk', 'username', 'password', 'email', 'first_name', 'last_name', 'is_active')
        read_only_fields = ('is_active',)

    def create(self, validated_data):
        password = validated_data.get('password')
        validated_data['password'] = make_password(password)
        return super().create(validated_data)


class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = ('pk', 'name', 'notes', 'logo')
        read_only_fields = ('pk',)


class RestaurantSerializerData(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = ('pk', 'name', 'logo')
        read_only_fields = ('pk', 'name', 'logo')


class ProposalSerializer(serializers.ModelSerializer):
    restaurant = RestaurantSerializerData(read_only=True)

    class Meta:
        model = Proposal
        fields = ('pk', 'menu', 'notes', 'restaurant', 'created_date')
        read_only_fields = ('pk', 'created_date')


class ProposalToCurrentVotingSerializer(serializers.ModelSerializer):
    restaurant = RestaurantSerializerData(read_only=True)

    class Meta:
        model = Proposal
        fields = ('pk', 'menu', 'notes', 'restaurant')
        read_only_fields = ('pk', 'created_date')


class ProposalSerializerUpdateCreate(serializers.ModelSerializer):
    class Meta:
        model = Proposal
        fields = ('pk', 'menu', 'notes', 'restaurant', 'created_date')


class VotingSerializer(serializers.ModelSerializer):
    def validate(self, attrs):
        proposals = attrs.get('proposal')
        if len(set(map(operator.attrgetter('restaurant_id'), proposals))) != len(proposals):
            raise ValidationError({'Restaurant': 'the restaurant cannot be repeated in the vote'})
        return attrs

    class Meta:
        model = Voting
        fields = ('pk', 'date', 'proposal')
        read_only_fields = ('pk', 'date')


class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = ('pk', 'proposal')

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        validated_data['voting'] = get_object_or_404(
            Voting, date=timezone.now().date(), proposal=validated_data.get('proposal').id
        )
        return super().create(validated_data)


class CurrentVotingSerializer(serializers.ModelSerializer):
    proposal = ProposalToCurrentVotingSerializer(read_only=True, many=True)

    class Meta:
        model = Voting
        fields = ('pk', 'date', 'proposal')


class UserReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('username', 'first_name', 'last_name')


class ResultsVotingSerializer(serializers.Serializer):
    proposal = serializers.PrimaryKeyRelatedField(read_only=True)
    user = UserReadSerializer(read_only=True)


class AllVotingSerializer(serializers.ModelSerializer):
    restaurant = RestaurantSerializerData(read_only=True, allow_null=True)

    class Meta:
        model = VotingResults
        fields = ('pk', 'date', 'count_vote', 'restaurant')
