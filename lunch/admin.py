from django.contrib import admin
from lunch.models import Restaurant, Voting, Vote

# Register your models here.
admin.site.register(Restaurant)
admin.site.register(Voting)
admin.site.register(Vote)
