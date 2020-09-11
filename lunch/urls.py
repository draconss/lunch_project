from django.urls import path
from django.contrib.auth.views import LoginView
from django.urls import path
from django.views.generic import TemplateView
from rest_framework import routers

from lunch.views import UserModelViewSet, AdminPanelView, RestaurantViewSet, ProposalViewSet

router = routers.SimpleRouter()
router.register('users', UserModelViewSet)
router.register('restaurant', RestaurantViewSet)
router.register('proposal', ProposalViewSet)

urlpatterns = [
    # path('', Test.as_view(), name='first'),
    path('login/', LoginView.as_view(), name='login'),
    path('admin/', AdminPanelView.as_view(), name='admin_panel'),
]

urlpatterns += router.urls
