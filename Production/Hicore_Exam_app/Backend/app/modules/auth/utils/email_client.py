# app/modules/auth/utils/email_client.py

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.logger import logger

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587

SMTP_USERNAME = "hicoresofttraining@gmail.com"
SMTP_PASSWORD = "xzlnmoldvkzpfadw"


def send_email(to_email: str, subject: str, plain: str, html: str) -> bool:
    """Send an email using SMTP."""
    try:
        msg = MIMEMultipart("alternative")
        msg["From"] = SMTP_USERNAME
        msg["To"] = to_email
        msg["Subject"] = subject

        msg.attach(MIMEText(plain, "plain"))
        msg.attach(MIMEText(html, "html"))

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(msg)

        logger.info(f"[EmailClient] Email sent to {to_email}")
        return True

    except Exception as e:
        logger.error(f"[EmailClient] Failed to send email to {to_email}: {e}")
        return False
