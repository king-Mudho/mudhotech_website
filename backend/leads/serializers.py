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


class SoftwareServiceRequestCreateSerializer(serializers.Serializer):
    """Maps the M3 "Request Software Service" form onto ContactSubmission,
    tagged by `source` — docs/08-api-design.md §3."""

    name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    service_category = serializers.CharField(max_length=150)
    details = serializers.CharField(min_length=10, max_length=2000)

    def create(self, validated_data) -> ContactSubmission:
        return ContactSubmission.objects.create(
            name=validated_data["name"],
            email=validated_data["email"],
            subject=f"[Software Service Request] {validated_data['service_category']}",
            message=validated_data["details"],
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
