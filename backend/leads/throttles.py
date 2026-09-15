from rest_framework.throttling import AnonRateThrottle


class SubmissionRateThrottle(AnonRateThrottle):
    """Applied to every public POST endpoint in Stage 8 (contact, quote,
    software-service, newsletter) — docs/05-security-rbac.md §6."""

    scope = "submission"
