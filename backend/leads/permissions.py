from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import BasePermission
from rest_framework.request import Request


class IsAdminStaff(BasePermission):
    """Layer 2 (docs/ARCHITECTURE-DEVIATION.md): the DRF-level gate on every
    admin endpoint. `is_staff` is this project's single admin role — see the
    deviation doc for why there's no separate roles table."""

    def has_permission(self, request: Request, view) -> bool:
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)


def require_admin(request: Request) -> None:
    """Layer 3: explicit re-check inside a view body, independent of the
    `permission_classes` gate above — never trust a single checkpoint alone
    (same principle as docs/05-security-rbac.md §2's Layer 3)."""
    if not (request.user and request.user.is_authenticated and request.user.is_staff):
        raise PermissionDenied("Admin role required.")
