import json
import difflib
import smtplib
from email.mime.text import MIMEText
from fastapi import HTTPException, status
from sqlalchemy.future import select
from datetime import datetime, timezone

from app.core.managers.sql_manager import SQLManager
from app.modules.applications.models.application_model import Application
from app.modules.applications.schemas.application_schema import ApplicationCreate
from app.modules.internships.models.internship_model import InternshipPosting
from app.modules.jobs.models.job_model import JobPosting
from app.modules.profile.models.models import UserProfile
from app.modules.auth.managers.user_manager import UserManager



class ApplicationService:
    """
    Handles Job / Internship applications using new JSON-based UserProfile model.
    """

    def __init__(self, user_manager: UserManager):
        self.user_manager = user_manager
        self.session = user_manager.session
        self.manager = SQLManager(self.session, Application)

    # ==============================================================
    # MAIN APPLY FUNCTION
    # ==============================================================
    async def apply(self, payload: ApplicationCreate):

        print(f"[APPLY] user={payload.applyer_id}, posting={payload.job_id}, type={payload.posting_type}")

        # 1️⃣ Validate user exists
        user = await self.user_manager.get_user_by_id(payload.applyer_id)
        if not user:
            raise HTTPException(404, "User not found")

        # 2️⃣ Get resume skills from new JSON profile
        resume_skills = await self._get_resume_skills(payload.applyer_id)
        print("Resume Skills:", resume_skills)

        # 3️⃣ Fetch Posting
        posting_type = payload.posting_type.lower().strip()
        posting = await self._get_posting_by_type(posting_type, payload.job_id)
        if not posting:
            raise HTTPException(404, f"{posting_type.title()} not found")

        # 4️⃣ Extract Skills From Posting
        if posting_type == "job":
            required_skills = posting.get("must_have_skills", [])
            preferred_skills = posting.get("preferred_skills", [])
        else:
            required_skills = posting.get("required_skills", [])
            preferred_skills = posting.get("preferred_skills", [])

        # 5️⃣ Calculate Matching Score
        payload.match = self._calculate_match(resume_skills, required_skills, preferred_skills)
        print("Match Score:", payload.match)

        # 6️⃣ Prevent Duplicate Applications
        existing = await self.manager.get_by_attrs(
            applyer_id=payload.applyer_id,
            posting_type=payload.posting_type,
            job_id=payload.job_id
        )
        if existing:
            print("Duplicate Application Found.")
            return existing

        # 7️⃣ Save New Application
        app_data = payload.dict()
        application = await self.manager.create(app_data)
        await self.session.commit()
        await self.session.refresh(application)

        # 8️⃣ Send Confirmation Email
        email = await self._get_email_by_user_id(payload.applyer_id)
        if email:
            subject = f"{posting_type.title()} Application Received"
            message = (
                f"Your application for {posting_type.title()} #{payload.job_id} was received.\n"
                f"Match Score: {payload.match}%"
            )
            await self._send_email(email, subject, message)

        print(f"[SAVED] Application ID={application.id}")
        return application

    # ==============================================================
    # FETCH RESUME SKILLS FROM UserProfile JSON
    # ==============================================================
    async def _get_resume_skills(self, user_id: int):
        try:
            result = await self.session.execute(
                select(UserProfile.profile_data).where(UserProfile.user_id == user_id)
            )
            record = result.scalar_one_or_none()
            if not record:
                return []

            skills_block = record.get("skillsResume", {})
            skills = skills_block.get("resume_skills", [])

            # Proper normalization
            if isinstance(skills, str):
                try:
                    return json.loads(skills)
                except:
                    return [s.strip() for s in skills.split(",") if s.strip()]

            return skills or []

        except Exception as e:
            print("Error fetching resume skills:", e)
            return []

    # ==============================================================
    # FETCH POSTING (Job / Internship)
    # ==============================================================
    async def _get_posting_by_type(self, posting_type: str, job_id: int):
        model = JobPosting if posting_type == "job" else InternshipPosting
        result = await self.session.execute(select(model).where(model.id == job_id))
        record = result.scalar_one_or_none()
        return record.as_dict() if record else None

    # ==============================================================
    # FUZZY MATCHING
    # ==============================================================
    def _calculate_match(self, resume_skills, required_skills, preferred_skills):

        def normalize(s):
            if not s:
                return ""
            s = s.lower().replace("-", " ").replace(".", "").strip()
            if s.endswith("js"): s = s[:-2].strip()
            return s

        resume = {normalize(s) for s in resume_skills}
        req = {normalize(s) for s in required_skills}
        pref = {normalize(s) for s in preferred_skills}

        if not req and not pref:
            return 0.0

        def ratio(a, b):
            return difflib.SequenceMatcher(None, a, b).ratio()

        req_match = sum(any(ratio(r, x) >= 0.65 for x in resume) for r in req)
        pref_match = sum(any(ratio(p, x) >= 0.65 for x in resume) for p in pref)

        req_score = req_match / len(req) if req else 0
        pref_score = pref_match / len(pref) if pref else 0

        return round((req_score * 0.7 + pref_score * 0.3) * 100, 2)

    # ==============================================================
    # UPDATE APPLICATION STAGE + EMAIL
    # ==============================================================
    async def update_stage(self, application_id: int, new_stage: str):
        valid = {"applied", "shortlisted", "interview", "hired", "rejected"}
        if new_stage.lower() not in valid:
            raise HTTPException(400, f"Invalid stage. Must be {list(valid)}")

        application = await self.manager.get_by_id(application_id)
        if not application:
            raise HTTPException(404, "Application not found")

        application.stage = new_stage.lower()
        await self.session.commit()
        await self.session.refresh(application)

        email = await self._get_email_by_user_id(application.applyer_id)
        if email:
            subject = f"Application Updated: {new_stage.title()}"
            msg = f"Your application for posting #{application.job_id} is now '{new_stage.title()}'."
            await self._send_email(email, subject, msg)

        return application

    # ==============================================================
    # EMAIL UTILITIES
    # ==============================================================
    async def _get_email_by_user_id(self, user_id: int):
        result = await self.session.execute(
            select(UserProfile.profile_data).where(UserProfile.user_id == user_id)
        )
        record = result.scalar_one_or_none()
        if not record:
            return None
        return record.get("basicInfo", {}).get("email")

    async def _send_email(self, to, subject, message):
        try:
            sender = "hicoresofttraining@gmail.com"
            password = ""

            msg = MIMEText(message)
            msg["From"] = sender
            msg["To"] = to
            msg["Subject"] = subject

            server = smtplib.SMTP("smtp.gmail.com", 587)
            server.starttls()
            server.login(sender, password)
            server.send_message(msg)
            server.quit()

            print(f"Email sent → {to}")

        except Exception as e:
            print("Email sending failed:", e)

    # ============================================================
    # 📋 LIST APPLICATIONS BY POSTER (Jobs + Internships)
    # ============================================================
    async def get_applications_by_poster(self, poster_user_id: int):
        try:
            session = self.session

            # 1️⃣ Fetch JobPosting IDs created by this user
            job_rows = await session.execute(
                select(JobPosting.id).where(JobPosting.user_id == poster_user_id)
            )
            job_ids = [row[0] for row in job_rows.fetchall()]

            # 2️⃣ Fetch InternshipPosting IDs created by this user
            intern_rows = await session.execute(
                select(InternshipPosting.id).where(InternshipPosting.user_id == poster_user_id)
            )
            intern_ids = [row[0] for row in intern_rows.fetchall()]

            # No postings available
            if not job_ids and not intern_ids:
                return []

            all_ids = job_ids + intern_ids

            # 3️⃣ Fetch all applications mapped to these job_ids
            apps_query = await session.execute(
                select(Application).where(Application.job_id.in_(all_ids))
            )
            return apps_query.scalars().all()

        except Exception as e:
            print(f"[❌ ERROR] get_applications_by_poster => {e}")
            raise


    async def get_applications_by_poster_with_deadline(
            self,
            poster_user_id: int,
            status: str = "active"  # "active", "closed", or "all"
    ):
        """
        Fetch applications for postings created by `poster_user_id`.
        Filter by posting application_deadline:
            - "active": deadline >= now (or no deadline -> treated as active)
            - "closed": deadline < now
            - "all": return both
        Returns a list of dicts: {
            "application": <Application ORM object>,
            "posting": <posting.as_dict() or {}>,
            "posting_status": "active" | "closed"
        }
        """
        try:
            session = self.session
            # 1) Get posting IDs created by the poster
            job_rows = await session.execute(
                select(JobPosting.id).where(JobPosting.user_id == poster_user_id)
            )
            job_ids = [row[0] for row in job_rows.fetchall()]

            intern_rows = await session.execute(
                select(InternshipPosting.id).where(InternshipPosting.user_id == poster_user_id)
            )
            intern_ids = [row[0] for row in intern_rows.fetchall()]

            if not job_ids and not intern_ids:
                return []

            all_ids = job_ids + intern_ids

            # 2) Fetch all applications for these postings
            apps_query = await session.execute(
                select(Application).where(Application.job_id.in_(all_ids))
            )
            applications = apps_query.scalars().all()

            now = datetime.now(timezone.utc)

            results = []
            for app in applications:
                # Determine posting type for the application (fall back to 'job' if missing)
                ptype = getattr(app, "posting_type", None)
                if not ptype:
                    # fallback: infer by ID membership
                    ptype = "job" if app.job_id in job_ids else "internship"

                # Load the correct posting
                posting = None
                if ptype.lower() == "job":
                    posting = await session.get(JobPosting, app.job_id)
                else:
                    posting = await session.get(InternshipPosting, app.job_id)

                # Prepare posting dict
                posting_dict = posting.as_dict() if posting else {}

                # Determine posting status using application_deadline
                posting_deadline = getattr(posting, "application_deadline", None)
                posting_status = "active"
                if posting_deadline:
                    # If deadline has no tzinfo, assume UTC for comparison
                    if posting_deadline.tzinfo is None:
                        posting_deadline = posting_deadline.replace(tzinfo=timezone.utc)
                    posting_status = "active" if posting_deadline >= now else "closed"
                else:
                    # No deadline => treat as active
                    posting_status = "active"

                # Apply requested filter
                if status.lower() == "active" and posting_status != "active":
                    continue
                if status.lower() == "closed" and posting_status != "closed":
                    continue

                results.append({
                    "application": app,
                    "posting": posting_dict,
                    "posting_status": posting_status
                })

            return results

        except Exception as e:
            print(f"[❌ ERROR] get_applications_by_poster_with_deadline => {e}")
            raise
