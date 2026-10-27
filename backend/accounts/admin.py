from django.contrib import admin

from .models import AdminNotificationPreference, RevokedAccessToken


@admin.register(AdminNotificationPreference)
class AdminNotificationPreferenceAdmin(admin.ModelAdmin):
    list_display = ("user", "event_type", "enabled", "updated_at")
    list_filter = ("event_type", "enabled")


@admin.register(RevokedAccessToken)
class RevokedAccessTokenAdmin(admin.ModelAdmin):
    list_display = ("jti", "expires_at", "created_at")
