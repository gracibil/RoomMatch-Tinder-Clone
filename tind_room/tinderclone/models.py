import os
import uuid

from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from .managers import CustomUserManager
from django.dispatch import receiver
from django.db.models.signals import post_save, post_delete

# Create your models here.

class User(AbstractBaseUser):
    email = models.EmailField(verbose_name='email', max_length=60, unique=True)
    date_joined = models.DateTimeField(verbose_name='date joined', auto_now_add=True)
    last_login = models.DateTimeField(verbose_name='last login', auto_now=True)
    profile_created = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return True

    def user_created(self):
        post_save.connect(initialize_user)


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=12, default='')
    birthdate = models.DateField(default='2000-01-01')
    bio = models.TextField(default='', max_length=500)
    goal = models.CharField(default='roommates', max_length=9)
    gender = models.CharField(default='man', max_length=5)
    images = models.JSONField(default=list)
    matches = models.JSONField(default=list)
    new_matches = models.JSONField(default=list)
    liked = models.JSONField(default=list)
    conversations = models.JSONField(default=list)
    ai_user = models.BooleanField(default=False)


class Conversation(models.Model):
    profile_1 = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='user_1')
    profile_2 = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='user_2')

    messages = models.JSONField(default=list)

class ImageMedia(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='images/')

    def remove_file(self):
        post_delete.connect(delete_image_from_disk)



# Create your models here.
@receiver(post_save, sender=User)
def initialize_user(sender, instance, created, **kwargs):
    if(created):
        print(instance)
        instance.save()


@receiver(post_delete, sender=ImageMedia)
def delete_image_from_disk(sender, instance, **kwargs):
    if instance.image:
        if os.path.isfile(instance.image.path):
            os.remove(instance.image.path)