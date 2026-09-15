from django.db import models


class SubmissionStatus(models.TextChoices):
    NEW = "new", "New"
    READ = "read", "Read"
    REPLIED = "replied", "Replied"


class ContactSubmission(models.Model):
    class Source(models.TextChoices):
        CONTACT = "contact", "Contact"
        SOFTWARE_SERVICE = "software_service", "Software Service Request"

    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=30, blank=True, null=True)
    subject = models.CharField(max_length=150)
    message = models.TextField()
    source = models.CharField(max_length=20, choices=Source.choices, default=Source.CONTACT)
    status = models.CharField(max_length=10, choices=SubmissionStatus.choices, default=SubmissionStatus.NEW)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.name} <{self.email}> — {self.subject}"


class QuoteRequest(models.Model):
    class PreferredContact(models.TextChoices):
        EMAIL = "email", "Email"
        PHONE = "phone", "Phone"
        WHATSAPP = "whatsapp", "WhatsApp"

    name = models.CharField(max_length=100)
    business = models.CharField(max_length=150, blank=True, null=True)
    email = models.EmailField()
    phone = models.CharField(max_length=30, blank=True, null=True)
    service_type = models.CharField(max_length=100)
    description = models.TextField()
    preferred_contact_method = models.CharField(
        max_length=10, choices=PreferredContact.choices, blank=True, null=True
    )
    status = models.CharField(max_length=10, choices=SubmissionStatus.choices, default=SubmissionStatus.NEW)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.name} <{self.email}> — {self.service_type}"


class NewsletterSubscriber(models.Model):
    email = models.EmailField(unique=True)
    confirmed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.email
