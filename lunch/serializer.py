from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from rest_framework.exceptions import ValidationError


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('pk', 'username', 'password', 'email', 'first_name', 'last_name', 'is_active')
        read_only_fields = ('pk', )
        extra_kwargs = {
            "password": {"required": False, "write_only": True},
            "username":{"required":False}
        }

    def create(self, validated_data):
        password = validated_data.get('password')
        username = validated_data.get('username')
        if not (password or username):
            raise ValidationError(dict(password='This field is required for create request'))
        validated_data['password'] = make_password(password)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        password = validated_data.get('password')
        if password:
            validated_data['password'] = make_password(password)
        return super().update(instance, validated_data)
