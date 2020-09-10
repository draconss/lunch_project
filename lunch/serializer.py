from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from rest_framework.exceptions import ValidationError
from rest_framework.validators import UniqueValidator

from lunch.models import Restaurant, Proposal


class UserSerializer(serializers.ModelSerializer):

    email = serializers.EmailField(required=True, validators=[UniqueValidator(queryset=get_user_model().objects.all())])

    class Meta:
        abstract = True
        model = get_user_model()
        fields = ('pk', 'username', 'email', 'first_name', 'last_name', 'is_active')
        read_only_fields = ('pk', )
        # extra_kwargs = {
        #     "email": {'allow_blank': False},
        # }

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


class ProposalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proposal
        fields = ('menu', 'notes', 'created_date')


class RestaurantSerializer(serializers.ModelSerializer):

    class Meta:
        model = Restaurant
        fields = ('pk', 'name', 'notes', 'logo')
        # extra_kwargs = {
        #     "logo": {'blank': True},
        # }
