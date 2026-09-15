from rest_framework.exceptions import ValidationError

# Must match src/lib/honeypot.ts's HONEYPOT_FIELD_NAME.
HONEYPOT_FIELD_NAME = "website"


def check_honeypot(data: dict) -> None:
    """Server-side re-check — the client-side empty value is never trusted
    alone (docs/05-security-rbac.md §6)."""
    value = data.get(HONEYPOT_FIELD_NAME)
    if isinstance(value, str) and value.strip():
        raise ValidationError({"error": "Submission rejected."})
