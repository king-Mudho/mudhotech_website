from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import AdminTokenObtainPairSerializer


class AdminTokenObtainPairView(TokenObtainPairView):
    serializer_class = AdminTokenObtainPairSerializer


class MeView(APIView):
    """Used by the Next.js Navbar/admin shell to check whether the current
    session belongs to a staff user — re-verifies against the DB on every
    call rather than trusting the JWT payload alone."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({"id": user.id, "email": user.email, "is_staff": user.is_staff})
