from django.urls import path
from django.contrib.auth.views import LoginView
from django.urls import path
from django.views.generic import TemplateView
from rest_framework import routers

from lunch.views import UserModelViewSet, AdminPanelView, RestaurantViewSet, ProposalViewSet, RestaurantOnlyReadViewSet, VotingViewSet, VoteViewSet, TodayVotingViewSet

router = routers.SimpleRouter()
router.register('users', UserModelViewSet)
router.register('restaurant', RestaurantViewSet)
router.register('proposal', ProposalViewSet)
router.register('proposal-data', RestaurantOnlyReadViewSet)
router.register('voting', VotingViewSet)
router.register('vote', VoteViewSet)
# router.register('current-voting', TodayVotingViewSet)

urlpatterns = [
    # path('', Test.as_view(), name='first'),
    path('login/', LoginView.as_view(), name='login'),
    path('admin/', AdminPanelView.as_view(), name='admin_panel'),
    path('current-voting/', TodayVotingViewSet.as_view()),
]

urlpatterns += router.urls
