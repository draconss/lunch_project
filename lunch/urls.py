from django.urls import path
from django.contrib.auth.views import LoginView,LogoutView
from django.urls import path
from django.views.generic import TemplateView
from django.views.generic.base import View
from rest_framework import routers

from lunch.views import UserModelViewSet, AdminPanelView, RestaurantViewSet, ProposalViewSet, RestaurantOnlyReadViewSet, \
    VotingViewSet, VoteViewSet, TodayVotingViewSet, ResultsVotingView

router = routers.SimpleRouter()
router.register('users', UserModelViewSet)
router.register('restaurant', RestaurantViewSet)
router.register('proposal', ProposalViewSet)
router.register('restaurant-data', RestaurantOnlyReadViewSet)
router.register('voting', VotingViewSet)
router.register('vote', VoteViewSet)

urlpatterns = [
    path('', TemplateView.as_view(template_name='main_page.html'), name='main_page'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('admin/', AdminPanelView.as_view(), name='admin_panel'),
    path('current-voting/', TodayVotingViewSet.as_view()),
    path('results-voting/', ResultsVotingView.as_view()),
]

urlpatterns += router.urls
