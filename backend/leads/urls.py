"""
leads app URL routes (docs/08-api-design.md). Only ever called
server-to-server from Next.js Route Handlers — never directly by the
browser (docs/ARCHITECTURE-DEVIATION.md).
"""

from django.urls import path

from .admin_views import (
    AdminAnalyticsView,
    AdminNotificationPreferencesView,
    AdminReplyView,
    AdminSubmissionBulkView,
    AdminSubmissionDetailView,
    AdminSubmissionListView,
)
from .views import (
    ContactSubmissionCreateView,
    NewsletterSubscribeView,
    QuoteRequestCreateView,
    SoftwareServiceRequestCreateView,
)

urlpatterns = [
    # Public submission endpoints
    path("submissions/contact/", ContactSubmissionCreateView.as_view(), name="submit-contact"),
    path("submissions/software-service/", SoftwareServiceRequestCreateView.as_view(), name="submit-software-service"),
    path("submissions/quote/", QuoteRequestCreateView.as_view(), name="submit-quote"),
    path("newsletter/", NewsletterSubscribeView.as_view(), name="submit-newsletter"),
    # Admin endpoints
    path("admin/submissions/", AdminSubmissionListView.as_view(), name="admin-submission-list"),
    path("admin/submissions/bulk/", AdminSubmissionBulkView.as_view(), name="admin-submission-bulk"),
    path("admin/submissions/<int:pk>/", AdminSubmissionDetailView.as_view(), name="admin-submission-detail"),
    path("admin/reply/", AdminReplyView.as_view(), name="admin-reply"),
    path("admin/analytics/", AdminAnalyticsView.as_view(), name="admin-analytics"),
    path(
        "admin/notification-preferences/",
        AdminNotificationPreferencesView.as_view(),
        name="admin-notification-preferences",
    ),
]
