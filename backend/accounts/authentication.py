from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.settings import api_settings

from .models import RevokedAccessToken


class RevocableJWTAuthentication(JWTAuthentication):
    """JWT authentication that also rejects tokens signed out via
    /api/auth/logout/. SimpleJWT's own blacklist app only covers refresh
    tokens, and this project issues none."""

    def get_validated_token(self, raw_token):
        token = super().get_validated_token(raw_token)
        jti = token.get(api_settings.JTI_CLAIM)
        if jti is None or RevokedAccessToken.objects.filter(jti=jti).exists():
            raise InvalidToken({"detail": "Token has been revoked.", "code": "token_revoked"})
        return token
