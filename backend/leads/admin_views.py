"""Admin lead-management API (docs/08-api-design.md §4). Every view is
gated by IsAdminStaff (Layer 2) AND re-verifies via require_admin (Layer 3)
— see docs/ARCHITECTURE-DEVIATION.md."""

from datetime import timedelta

from django.db.models import Count, Q
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import AdminNotificationPreference

from .emails import send_reply
from .models import ContactSubmission, QuoteRequest, SubmissionStatus
from .permissions import IsAdminStaff, require_admin
from .serializers import ContactSubmissionSerializer, QuoteRequestSerializer

PAGE_SIZE = 10


def _model_for(submission_type: str):
    return ContactSubmission if submission_type == "contact" else QuoteRequest


def _serializer_for(submission_type: str):
    return ContactSubmissionSerializer if submission_type == "contact" else QuoteRequestSerializer


def _search_filter(submission_type: str, search: str) -> Q:
    if submission_type == "contact":
        return (
            Q(name__icontains=search)
            | Q(email__icontains=search)
            | Q(subject__icontains=search)
            | Q(message__icontains=search)
        )
    return (
        Q(name__icontains=search)
        | Q(email__icontains=search)
        | Q(service_type__icontains=search)
        | Q(description__icontains=search)
        | Q(business__icontains=search)
    )


class AdminSubmissionListView(APIView):
    permission_classes = [IsAdminStaff]

    def get(self, request):
        require_admin(request)

        submission_type = request.query_params.get("type", "contact")
        queryset = _model_for(submission_type).objects.all()

        status_filter = request.query_params.get("status")
        if status_filter and status_filter != "all":
            queryset = queryset.filter(status=status_filter)

        date_from = request.query_params.get("from")
        if date_from:
            queryset = queryset.filter(created_at__gte=date_from)

        date_to = request.query_params.get("to")
        if date_to:
            queryset = queryset.filter(created_at__lte=date_to)

        search = request.query_params.get("search")
        if search:
            queryset = queryset.filter(_search_filter(submission_type, search))

        total = queryset.count()
        try:
            page = max(1, int(request.query_params.get("page", 1)))
        except ValueError:
            page = 1
        offset = (page - 1) * PAGE_SIZE
        rows = queryset[offset : offset + PAGE_SIZE]

        return Response(
            {
                "results": _serializer_for(submission_type)(rows, many=True).data,
                "total": total,
                "page": page,
                "page_size": PAGE_SIZE,
            }
        )


class AdminSubmissionDetailView(APIView):
    permission_classes = [IsAdminStaff]

    def patch(self, request, pk):
        require_admin(request)

        submission_type = request.query_params.get("type", "contact")
        new_status = request.data.get("status")
        if new_status not in SubmissionStatus.values:
            return Response({"error": {"message": "Invalid status."}}, status=status.HTTP_400_BAD_REQUEST)

        updated = _model_for(submission_type).objects.filter(pk=pk).update(status=new_status)
        if not updated:
            return Response({"error": {"message": "Not found."}}, status=status.HTTP_404_NOT_FOUND)

        return Response({"success": True})

    def delete(self, request, pk):
        require_admin(request)

        submission_type = request.query_params.get("type", "contact")
        deleted, _ = _model_for(submission_type).objects.filter(pk=pk).delete()
        if not deleted:
            return Response({"error": {"message": "Not found."}}, status=status.HTTP_404_NOT_FOUND)

        return Response({"success": True})


class AdminSubmissionBulkView(APIView):
    permission_classes = [IsAdminStaff]

    def post(self, request):
        require_admin(request)

        ids = request.data.get("ids") or []
        action = request.data.get("action")
        submission_type = request.data.get("type", "contact")

        if not ids or action not in {"markRead", "markReplied", "delete"}:
            return Response({"error": {"message": "Invalid request."}}, status=status.HTTP_400_BAD_REQUEST)

        queryset = _model_for(submission_type).objects.filter(pk__in=ids)

        if action == "delete":
            count, _ = queryset.delete()
        else:
            new_status = SubmissionStatus.READ if action == "markRead" else SubmissionStatus.REPLIED
            count = queryset.update(status=new_status)

        return Response({"success": True, "affected": count})


class AdminReplyView(APIView):
    permission_classes = [IsAdminStaff]

    def post(self, request):
        require_admin(request)

        to = request.data.get("to")
        subject = request.data.get("subject")
        message = request.data.get("message")
        submission_type = request.data.get("submissionType")
        submission_id = request.data.get("submissionId")

        if not (to and subject and message):
            return Response(
                {"error": {"message": "to, subject, and message are required."}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        send_reply(to, subject, message)

        if submission_type and submission_id:
            _model_for(submission_type).objects.filter(pk=submission_id).update(status=SubmissionStatus.REPLIED)

        return Response({"success": True})


class AdminAnalyticsView(APIView):
    permission_classes = [IsAdminStaff]

    def get(self, request):
        require_admin(request)

        try:
            days = int(request.query_params.get("days", 30))
        except ValueError:
            days = 30
        since = timezone.now() - timedelta(days=days)

        contacts = ContactSubmission.objects.filter(created_at__gte=since)
        quotes = QuoteRequest.objects.filter(created_at__gte=since)

        def status_counts(queryset):
            rows = queryset.values("status").annotate(count=Count("id"))
            return {row["status"]: row["count"] for row in rows}

        def daily_counts(queryset):
            rows = (
                queryset.extra(select={"day": "date(created_at)"})
                .values("day")
                .annotate(count=Count("id"))
                .order_by("day")
            )
            return {str(row["day"]): row["count"] for row in rows}

        return Response(
            {
                "totals": {
                    "contacts": ContactSubmission.objects.count(),
                    "quotes": QuoteRequest.objects.count(),
                    "new_contacts": ContactSubmission.objects.filter(status=SubmissionStatus.NEW).count(),
                    "new_quotes": QuoteRequest.objects.filter(status=SubmissionStatus.NEW).count(),
                },
                "range_days": days,
                "contact_status": status_counts(contacts),
                "quote_status": status_counts(quotes),
                "contacts_daily": daily_counts(contacts),
                "quotes_daily": daily_counts(quotes),
            }
        )


class AdminNotificationPreferencesView(APIView):
    permission_classes = [IsAdminStaff]

    def get(self, request):
        require_admin(request)

        existing = {
            pref.event_type: pref.enabled
            for pref in AdminNotificationPreference.objects.filter(user=request.user)
        }
        # No row means enabled — matches the notify-submission default.
        return Response(
            {
                event.value: existing.get(event.value, True)
                for event in AdminNotificationPreference.EventType
            }
        )

    def put(self, request):
        require_admin(request)

        for event_type, enabled in request.data.items():
            if event_type not in AdminNotificationPreference.EventType.values:
                continue
            AdminNotificationPreference.objects.update_or_create(
                user=request.user,
                event_type=event_type,
                defaults={"enabled": bool(enabled)},
            )

        return Response({"success": True})
