from datetime import datetime

APP_NAME = "Exam App"
TAGLINE = "Smart Exam Preparation"


def otp_email_template(otp: str, expiry_minutes: int):
    year = datetime.utcnow().year

    plain = (
        f"{APP_NAME} — OTP Verification\n\n"
        f"Your One-Time Password (OTP) is: {otp}\n"
        f"This code will expire in {expiry_minutes} minutes.\n\n"
        f"If you didn’t try to sign in, you can safely ignore this email.\n\n"
        f"© {year} {APP_NAME}"
    )

    html = f"""
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>{APP_NAME} OTP</title>
    </head>
    <body style="margin:0;padding:0;font-family:Arial,Roboto,Helvetica;background:#f4f6fb;">
      <table width="100%" cellpadding="0" cellspacing="0"
        style="max-width:660px;margin:36px auto;background:#ffffff;border-radius:10px;
        box-shadow:0 6px 16px rgba(0,0,0,0.05);">
        <tr>
          <td style="padding:24px 30px;">
            <h2 style="margin:0 0 12px;color:#102a43;">{APP_NAME}</h2>
            <p style="color:#627d98;font-size:14px;">OTP Verification</p>

            <p style="color:#334e68;font-size:14px;">
              Use the OTP below to continue. This code expires in
              <b>{expiry_minutes} minutes</b>.
            </p>

            <div style="text-align:center;margin:24px 0;">
              <div style="background:#f1f7ff;border:1px solid #e6f0ff;padding:18px 22px;
                  border-radius:10px;display:inline-block;">
                <div style="font-size:28px;letter-spacing:6px;font-weight:800;
                    color:#0b3a7a;font-family:'Courier New',monospace;">
                  {otp}
                </div>
              </div>
            </div>

            <p style="color:#627d98;font-size:13px;">
              If you did not request this, you can ignore this message.
            </p>

            <p style="margin-top:22px;font-size:13px;color:#7a889a;">
              Thanks,<br>
              <b>{APP_NAME} Team</b>
            </p>
          </td>
        </tr>
      </table>

      <div style="text-align:center;color:#9aa6bb;font-size:12px;margin-top:10px;">
        © {year} {APP_NAME} — {TAGLINE}
      </div>
    </body>
    </html>
    """

    return plain, html


def meeting_email_template(mentor_name, student_name, date, start, end, meet_link, session_type):
    year = datetime.utcnow().year

    plain = (
        f"Hi {student_name},\n\n"
        f"Your {session_type} session is scheduled.\n\n"
        f"Mentor: {mentor_name}\n"
        f"Date: {date}\n"
        f"Time: {start} — {end}\n"
        f"Meeting Link: {meet_link}\n\n"
        f"Please join a few minutes early.\n\n"
        f"Regards,\n{APP_NAME}\n© {year}"
    )

    html = f"""
    <html>
    <body style="font-family:Arial;background:#f4f6fb;padding:20px;">
        <table width="100%" style="max-width:650px;margin:auto;background:#ffffff;
            border-radius:12px;padding:24px;box-shadow:0 4px 14px rgba(0,0,0,0.06);">
            <tr><td>
                <h2 style="color:#0b2545;">Your Session is Confirmed 🎯</h2>
                <p style="font-size:14px;color:#445566;">
                    Hi <b>{student_name}</b>, your session has been successfully scheduled.
                </p>

                <h3 style="color:#0b3a7a;margin-top:18px;">Session Details</h3>
                <p style="font-size:14px;color:#333;">
                    <b>Session Type:</b> {session_type}<br>
                    <b>Mentor:</b> {mentor_name}<br>
                    <b>Date:</b> {date}<br>
                    <b>Time:</b> {start} – {end}
                </p>

                <a href="{meet_link}"
                    style="background:#0b66c3;color:white;padding:12px 22px;border-radius:8px;
                    text-decoration:none;font-size:15px;font-weight:bold;display:inline-block;margin-top:20px;">
                    Join Session
                </a>

                <p style="margin-top:28px;font-size:12px;color:#7a889a;">
                    Thanks,<br><b>{APP_NAME} Team</b>
                </p>
            </td></tr>
        </table>

        <p style="text-align:center;color:#9aa6bb;font-size:12px;margin-top:12px;">
            © {year} {APP_NAME} — {TAGLINE}
        </p>
    </body>
    </html>
    """

    return plain, html
