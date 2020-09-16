from django.contrib.auth import get_user_model
from django.db import models


# Create your models here.

User = get_user_model()


class Restaurant(models.Model):
    name = models.CharField(max_length=255, unique=True)
    notes = models.CharField(max_length=255, blank=True, default='')
    logo = models.ImageField(blank=True, default='Total-logo-earth.png')

    def __str__(self):
        return self.name


class Proposal(models.Model):
    restaurant = models.ForeignKey(Restaurant, related_name='proposal', on_delete=models.CASCADE)
    menu = models.CharField(max_length=255)
    notes = models.CharField(max_length=255, blank=True, default='')
    created_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return 'Restaurant: {} menu:{}'.format(self.restaurant.name, self.menu)


class Voting(models.Model):
    date = models.DateField(auto_now_add=True, unique=True)
    proposal = models.ManyToManyField(Proposal)

    def __str__(self):
        return str(self.date)


class Vote(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    proposal = models.ForeignKey(Proposal, on_delete=models.CASCADE)
    voting = models.ForeignKey(Voting, on_delete=models.CASCADE)





