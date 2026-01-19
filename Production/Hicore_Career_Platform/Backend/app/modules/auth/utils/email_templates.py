from datetime import datetime

def otp_email_template(otp: str, expiry_minutes: int):
    year = datetime.utcnow().year

    plain = (
        f"Hicore AI Career Platform — OTP Verification\n\n"
        f"Your OTP: {otp}\n"
        f"This code expires in {expiry_minutes} minutes.\n\n"
        f"If you did not request this, please ignore.\n"
        f"© {year} Hicore AI Career Platform"
    )

    html = f"""
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>Your Hicore AI OTP</title>
    </head>
    <body style="margin:0;padding:0;font-family:'Segoe UI',Roboto,Arial;background:#f4f6fb;">
      <table width="100%" cellpadding="0" cellspacing="0" 
        style="max-width:680px;margin:40px auto;background:#fff;border-radius:12px;
        box-shadow:0 6px 18px rgba(34,47,90,0.06);">
        <tr>
          <td style="padding:24px 32px;">
            <table width="100%">
              <tr>
                <td style="font-size:18px;font-weight:700;color:#0b2545;">Hicore AI Career Platform</td>
                <td style="text-align:right;font-size:12px;color:#9aa6bb;">OTP Verification</td>
              </tr>
            </table>
            <h2 style="color:#0b2545;">Your verification code</h2>
            <p style="color:#40506a;font-size:14px;">
              Enter the OTP below to continue. This code expires in <b>{expiry_minutes} minutes</b>.
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

            <p style="color:#40506a;font-size:13px;">
              If you didn’t request this code, please ignore this email.
            </p>

            <p style="margin-top:24px;font-size:13px;color:#7a889a;">
              Thanks,<br>
              <b>Hicore AI Career Platform Team</b>
            </p>
          </td>
        </tr>
      </table>

      <div style="text-align:center;color:#9aa6bb;font-size:12px;margin-top:12px;">
        © {year} Hicore AI Career Platform — Learn. Build. Land.
      </div>
    </body>
    </html>
    """

    return plain, html



def meeting_email_template(mentor_name, student_name, date, start, end, meet_link, session_type):
    year = datetime.utcnow().year

    plain = (
        f"Hi {student_name},\n\n"
        f"Your {session_type} is confirmed!\n\n"
        f"Mentor: {mentor_name}\n"
        f"Date: {date}\n"
        f"Time: {start} - {end}\n"
        f"Google Meet Link: {meet_link}\n\n"
        f"Please join on time.\n\n"
        f"Thanks,\nHicore AI Career Platform\n"
        f"© {year}"
    )

    html = f"""
    <html>
    <body style="font-family:Arial;background:#f4f6fb;padding:20px;">
        <table width="100%" style="max-width:650px;margin:auto;background:#fff;
            border-radius:12px;padding:25px;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
            <tr><td>
                <h2 style="color:#0b2545;">Your Hicore Mentorship Session is Confirmed 🎉</h2>
                <p style="font-size:14px;color:#445566;">
                    Hi <b>{student_name}</b>, your session has been scheduled successfully.
                </p>

                <h3 style="color:#0b3a7a;margin-top:20px;">Session Details</h3>
                <p style="font-size:14px;color:#333;">
                    <b>Session Type:</b> {session_type}<br>
                    <b>Mentor:</b> {mentor_name}<br>
                    <b>Date:</b> {date}<br>
                    <b>Time:</b> {start} – {end}
                </p>

                <a href="{meet_link}" 
                    style="background:#0b66c3;color:white;padding:12px 24px;border-radius:8px;
                    text-decoration:none;font-size:15px;font-weight:bold;display:inline-block;margin-top:20px;">
                    Join Google Meet
                </a>

                <p style="margin-top:30px;font-size:12px;color:#7a889a;">
                    Thanks,<br><b>Hicore AI Career Platform Team</b>
                </p>
            </td></tr>
        </table>

        <p style="text-align:center;color:#9aa6bb;font-size:12px;margin-top:12px;">
            © {year} Hicore AI Career Platform — Learn. Build. Land.
        </p>
    </body>
    </html>
    """

    return plain, html

