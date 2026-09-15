from django.contrib import admin

from .models import AdminNotificationPreference


@admin.register(AdminNotificationPreference)
class AdminNotificationPreferenceAdmin(admin.ModelAdmin):
    list_display = ("user", "event_type", "enabled", "updated_at")
    list_filter = ("event_type", "enabled")
