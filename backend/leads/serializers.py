from rest_framework import serializers

from .models import ContactSubmission, NewsletterSubscriber, QuoteRequest


class ContactSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactSubmission
        fields = [
            "id", "name", "email", "phone", "subject", "message",
            "source", "status", "created_at",
        ]
        read_only_fields = ["id", "status", "created_at"]


class ContactSubmissionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactSubmission
        fields = ["name", "email", "phone", "subject", "message"]

    def validate_name(self, value: str) -> str:
        return value.strip()


HANDOVER_CHOICES = [
    ("drop-off", "Customer will bring it to the Graniteside office"),
    ("on-site", "On-site visit requested"),
    ("not-sure", "Not sure yet"),
]


class SoftwareServiceRequestCreateSerializer(serializers.Serializer):
    """Maps the M3 "Request Software Service" form onto ContactSubmission,
    tagged by `source` — docs/08-api-design.md §3."""

    name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    # Optional: most support enquiries are easiest to follow up by phone or WhatsApp.
    phone = serializers.CharField(max_length=30, required=False, allow_blank=True, allow_null=True)
    service_category = serializers.CharField(max_length=150)
    # Optional repair-booking details. Folded into the message rather than
    # stored in new columns, so the admin inbox shows them with no migration.
    device = serializers.CharField(max_length=100, required=False, allow_blank=True, allow_null=True)
    handover = serializers.ChoiceField(choices=HANDOVER_CHOICES, required=False, allow_blank=True, allow_null=True)
    details = serializers.CharField(min_length=10, max_length=2000)

    def create(self, validated_data) -> ContactSubmission:
        lines = []
        if validated_data.get("device"):
            lines.append(f"Device or system: {validated_data['device']}")
        if validated_data.get("handover"):
            lines.append(f"Getting to it: {dict(HANDOVER_CHOICES)[validated_data['handover']]}")
        message = "\n".join(lines + ["", validated_data["details"]]) if lines else validated_data["details"]
        return ContactSubmission.objects.create(
            name=validated_data["name"],
            email=validated_data["email"],
            phone=validated_data.get("phone") or None,
            subject=f"[Software Service Request] {validated_data['service_category']}",
            message=message,
            source=ContactSubmission.Source.SOFTWARE_SERVICE,
        )


class QuoteRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuoteRequest
        fields = [
            "id", "name", "business", "email", "phone", "service_type",
            "description", "preferred_contact_method", "status", "created_at",
        ]
        read_only_fields = ["id", "status", "created_at"]


class QuoteRequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuoteRequest
        fields = ["name", "business", "email", "phone", "service_type", "description", "preferred_contact_method"]


class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = ["id", "email", "confirmed", "created_at"]
        read_only_fields = ["id", "confirmed", "created_at"]


class NewsletterSubscribeSerializer(serializers.Serializer):
    email = serializers.EmailField()
