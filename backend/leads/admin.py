from django.contrib import admin

from .models import ContactSubmission, NewsletterSubscriber, QuoteRequest


@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "subject", "source", "status", "created_at")
    list_filter = ("status", "source")
    search_fields = ("name", "email", "subject", "message")


@admin.register(QuoteRequest)
class QuoteRequestAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "service_type", "status", "created_at")
    list_filter = ("status", "service_type")
    search_fields = ("name", "email", "business", "service_type", "description")


@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
    list_display = ("email", "confirmed", "created_at")
    search_fields = ("email",)
