from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .emails import notify_newsletter_signup, notify_submission
from .models import NewsletterSubscriber
from .serializers import (
    ContactSubmissionCreateSerializer,
    ContactSubmissionSerializer,
    NewsletterSubscribeSerializer,
    QuoteRequestCreateSerializer,
    QuoteRequestSerializer,
    SoftwareServiceRequestCreateSerializer,
)
from .throttles import SubmissionRateThrottle
from .validators import check_honeypot


class ContactSubmissionCreateView(APIView):
    """Public. Only ever called server-to-server from the Next.js Route
    Handler at /app/api/submissions/contact — never directly by the
    browser (docs/ARCHITECTURE-DEVIATION.md)."""

    permission_classes = [AllowAny]
    throttle_classes = [SubmissionRateThrottle]

    def post(self, request):
        check_honeypot(request.data)
        serializer = ContactSubmissionCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        submission = serializer.save()
        notify_submission(submission)
        return Response(ContactSubmissionSerializer(submission).data, status=status.HTTP_201_CREATED)


class SoftwareServiceRequestCreateView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [SubmissionRateThrottle]

    def post(self, request):
        check_honeypot(request.data)
        serializer = SoftwareServiceRequestCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        submission = serializer.save()
        notify_submission(submission)
        return Response(ContactSubmissionSerializer(submission).data, status=status.HTTP_201_CREATED)


class QuoteRequestCreateView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [SubmissionRateThrottle]

    def post(self, request):
        check_honeypot(request.data)
        serializer = QuoteRequestCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        quote = serializer.save()
        notify_submission(quote)
        return Response(QuoteRequestSerializer(quote).data, status=status.HTTP_201_CREATED)


class NewsletterSubscribeView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [SubmissionRateThrottle]

    def post(self, request):
        check_honeypot(request.data)
        serializer = NewsletterSubscribeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]

        subscriber, created = NewsletterSubscriber.objects.get_or_create(email=email)
        if created:
            notify_newsletter_signup(email)
        else:
            # Friendly message on duplicate, not a 500 — docs/08-api-design.md §3.
            return Response({"success": True, "message": "You're already subscribed."})

        return Response(
            {"success": True, "message": "Subscribed."}, status=status.HTTP_201_CREATED
        )
