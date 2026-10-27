from datetime import datetime, timezone

from django.utils import timezone as django_timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import RevokedAccessToken
from .serializers import AdminTokenObtainPairSerializer


class LoginRateThrottle(AnonRateThrottle):
    """Per-IP brute-force limit on the admin login, kept separate from the
    general anonymous budget so it can be tuned on its own."""

    scope = "login"


class AdminTokenObtainPairView(TokenObtainPairView):
    serializer_class = AdminTokenObtainPairSerializer
    throttle_classes = [LoginRateThrottle]


class MeView(APIView):
    """Used by the Next.js Navbar/admin shell to check whether the current
    session belongs to a staff user — re-verifies against the DB on every
    call rather than trusting the JWT payload alone."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({"id": user.id, "email": user.email, "is_staff": user.is_staff})


class LogoutView(APIView):
    """Revokes the access token the request was made with, so a copy of it
    (from a shared machine, a proxy log, a stolen cookie) stops working now
    rather than when it expires. Other sessions of the same admin are left
    alone."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        token = request.auth
        expires_at = datetime.fromtimestamp(token["exp"], tz=timezone.utc)
        RevokedAccessToken.objects.get_or_create(jti=token["jti"], defaults={"expires_at": expires_at})
        # A revoked token past its expiry is rejected on `exp` alone.
        RevokedAccessToken.objects.filter(expires_at__lt=django_timezone.now()).delete()
        return Response({"success": True})
