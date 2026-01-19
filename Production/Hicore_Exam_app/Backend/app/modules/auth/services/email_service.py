# app/modules/auth/utils/email_service.py

from app.core.logger import logger
from ..utils.otp_generator import generate_otp
from ..utils.otp_store import otp_store
from ..utils.email_client import send_email
from ..utils.email_templates import otp_email_template, meeting_email_template


class EmailOtpService:

    # ---------------- OTP ----------------
    def generate_and_store_otp(self, email: str, expiry_minutes: int = 5) -> str:
        otp = generate_otp()
        otp_store.store(email, otp, expiry_minutes)
        logger.info(f"[EmailOtpService] OTP stored for {email}")
        return otp

    def verify_otp(self, email: str, otp: str) -> bool:
        result = otp_store.verify(email, otp)
        logger.info(f"[EmailOtpService] OTP verification for {email}: {result}")
        return result

    # ---------------- DIRECT EMAIL SENDING (sync) ----------------
    def send_otp_email(self, email: str, otp: str, expiry_minutes: int = 5):
        plain, html = otp_email_template(otp, expiry_minutes)
        return send_email(email, " Your Verification Code", plain, html)

    def send_meeting_email(
        self, email, mentor, student, date, start, end, link,
        session_type="Mentorship Session"
    ):
        plain, html = meeting_email_template(
            mentor, student, date, start, end, link, session_type
        )
        subject = f" Your Session is Confirmed – {session_type}"
        return send_email(email, subject, plain, html)

    # ---------------------------------------------------------------
    # BACKGROUND EMAIL SENDING (Recommended for FastAPI)
    # ---------------------------------------------------------------

    def send_otp_background(self, email: str, otp: str, expiry_minutes: int = 5):
        """Background-sent OTP email."""
        plain, html = otp_email_template(otp, expiry_minutes)
        send_email(email, "Your Verification Code", plain, html)
        logger.info(f"[EmailOtpService] Background OTP email sent → {email}")

    def send_meeting_background(
        self, email, mentor, student, date, start, end, link,
        session_type="Mentorship Session"
    ):
        """Background meeting email."""
        plain, html = meeting_email_template(
            mentor, student, date, start, end, link, session_type
        )
        subject = f" Your Session is Confirmed – {session_type}"
        send_email(email, subject, plain, html)
        logger.info(f"[EmailOtpService] Background meeting email sent → {email}")
