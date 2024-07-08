from .models import User, Profile, ImageMedia, Conversation

from rest_framework import serializers

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'date_joined', 'last_login', 'is_admin', 'is_active', 'is_staff', 'is_superuser')
        read_only_fields = ('date_joined', 'is_admin', 'is_active', 'is_staff', 'is_superuser')
        write_only_fields = ('email', 'last_login')
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def update(self, instance, validated_data):
        instance.save()

class ProfileSerializer(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(
        many=False,
        read_only=True,
        slug_field='user'

    )

    class Meta:
        model = Profile
        fields = ('name', 'bio', 'images', 'matches', 'new_matches', 'liked','ai_user',
                  'conversations')

    def create(self, validated_data):
        profile = Profile.objects.create(**validated_data)
        return profile

    def update(self, instance, validated_data):
        instance.first_name = validated_data.get('firstName', instance.first_name)
        instance.last_name = validated_data.get('lastName', instance.last_name)
        instance.active_profile = validated_data.get('activeProfile', instance.active_profile)
        instance.save()