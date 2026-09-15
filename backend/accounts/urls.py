"""
accounts app URL routes — admin JWT login (docs/05-security-rbac.md §4).
"""

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import AdminTokenObtainPairView, MeView

urlpatterns = [
    path("login/", AdminTokenObtainPairView.as_view(), name="admin-login"),
    path("refresh/", TokenRefreshView.as_view(), name="admin-refresh"),
    path("me/", MeView.as_view(), name="admin-me"),
]
