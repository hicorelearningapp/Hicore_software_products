# app/services/match_service_async.py
import os
import pickle
import asyncio
from typing import Dict, List, Optional, Any
import numpy as np
import re
from app.modules.auth.models.user import RoleEnum

from ..core.config import settings, model
from app.common.utils.text_utils import normalize_text, cosine_similarity

from app.modules.profile.managers.student_profile_service import StudentProfileService
from app.modules.auth.managers.user_manager import UserManager


# ============================================================
# LOAD & SAVE EMBEDDINGS
# ============================================================
def load_embeddings_from_file() -> List[Dict[str, Any]]:
    try:
        if not os.path.exists(settings.PKL_FILE):
            return []
        with open(settings.PKL_FILE, "rb") as f:
            return pickle.load(f)
    except Exception as e:
        print(f"❌ Failed to load embeddings file: {e}")
        return []


def persist_embeddings_to_file(all_data: List[Dict[str, Any]]):
    try:
        with open(settings.PKL_FILE, "wb") as f:
            pickle.dump(all_data, f)
    except Exception as e:
        print(f"❌ Failed to persist embeddings: {e}")


async def encode_text_async(text_or_texts, **kwargs):
    return await asyncio.to_thread(model.encode, text_or_texts, **kwargs)


# ============================================================
# 🔍 JD INFO EXTRACTION
# ============================================================
def extract_jd_info(jd_text: str) -> Dict[str, Any]:
    jd = jd_text.lower()

    # Job Title
    title_match = re.search(r"(?:title|position)[:\-]?\s*(.+)", jd)
    job_title = title_match.group(1).strip() if title_match else ""

    # Location
    loc_match = re.search(r"(?:location)[:\-]?\s*([a-zA-Z,\s]+)", jd)
    location = loc_match.group(1).strip() if loc_match else ""

    # Experience
    exp_match = re.search(r"(\d+)\s*(?:\+?\s*years?|yrs?)", jd)
    required_exp = int(exp_match.group(1)) if exp_match else 0

    return {
        "job_title": job_title,
        "location": location,
        "required_experience": required_exp,
        "skills": extract_skills_from_jd(jd_text),
    }


# ============================================================
# 🔍 SKILL EXTRACTION FROM JD
# ============================================================
def extract_skills_from_jd(jd: str):
    keywords = [
        "python", "java", "react", "node", "django", "fastapi",
        "sql", "mongodb", "aws", "docker", "html", "css",
        "javascript", "typescript", "flask", "git", "github",
        "linux", "devops", "c#", "c++", "angular", "vue",
        "nextjs", "tailwind", "express", "redis"
    ]
    jd_lower = jd.lower()
    return set([kw for kw in keywords if kw in jd_lower])


# ============================================================
# PROFILE FLATTENER → Used for Embedding Generation
# ============================================================
def flatten_profile(profile: Dict[str, Any]) -> str:
    try:
        basic = profile.get("basicInfo", {}) or {}
        job_pref = profile.get("jobPreference", {}) or {}
        work_exp = profile.get("workExperience", []) or []
        edu = profile.get("education", []) or []
        skills = profile.get("skillsResume", {}).get("resume_skills", []) or []
        certs = profile.get("certifications", []) or []
        projects = profile.get("projects", []) or []

        parts = [
            f"{basic.get('first_name','')} {basic.get('last_name','')}, "
            f"{basic.get('professional_title','')} from {basic.get('location','')}.",
            normalize_text(basic.get("professional_bio", "")),
        ]

        if job_pref:
            parts.append(
                f"Prefers {job_pref.get('work_type','')} roles {job_pref.get('job_titles','')}"
            )

        for exp in work_exp:
            parts.append(
                f"{exp.get('job_title','')} at {exp.get('company_name','')} using {exp.get('technologies','')}."
                f" {normalize_text(exp.get('responsibilities',''))}"
            )

        for e in edu:
            parts.append(f"Studied {e.get('field_of_study','')} at {e.get('college_name','')}")

        if skills:
            parts.append("Skills include: " + ", ".join(skills))

        for c in certs:
            parts.append(f"Certified in {c.get('certificate_name','')} by {c.get('issuing_org','')}")

        for p in projects:
            details = p.get("details", {}) or {}
            parts.append(
                f"Project {p.get('project_name','')} using {p.get('technologies','')}."
                f" Role: {details.get('role','')}"
            )

        return normalize_text(" ".join(parts))
    except Exception as e:
        print(f"⚠️ flatten_profile error: {e}")
        return ""


# ============================================================
# FETCH PROFILES FROM DB
# ============================================================
async def fetch_profiles_from_db(user_manager: UserManager):
    """
    Fetch ONLY student + jobseeker profiles from DB.
    """

    # 1. Fetch users by role
    student_users = await user_manager.list_users(role=RoleEnum.student)
    jobseeker_users = await user_manager.list_users(role=RoleEnum.jobseeker)

    student_ids = {u.id for u in student_users}
    jobseeker_ids = {u.id for u in jobseeker_users}

    allowed_user_ids = student_ids | jobseeker_ids

    if not allowed_user_ids:
        print(" No student or jobseeker users found.")
        return []

    # 2. Fetch all full profiles (serialized)
    profile_service = StudentProfileService(user_manager)
    all_profiles = await profile_service.list_profiles()

    # 3. Filter only student + jobseeker profiles
    filtered_profiles = [
        profile for profile in all_profiles
        if profile.get("basicInfo", {}).get("user_id") in allowed_user_ids
    ]

    print(f"Filtered profiles: {len(filtered_profiles)} out of {len(all_profiles)}")

    return filtered_profiles


# ============================================================
# BUILD EMBEDDINGS
# ============================================================
async def build_profile_embeddings(user_manager: UserManager):
    try:
        print("📡 Fetching profiles from DB...")
        profiles = await fetch_profiles_from_db(user_manager)

        if not profiles:
            print("⚠️ No profiles found in DB.")
            return 0

        texts_to_encode = [flatten_profile(p) for p in profiles]

        embeddings = await encode_text_async(texts_to_encode, normalize_embeddings=True)

        all_data = []
        for idx, profile in enumerate(profiles):
            basic = profile.get("basicInfo", {}) or {}
            all_data.append({
                "user_id": basic.get("user_id", idx),
                "name": f"{basic.get('first_name','')} {basic.get('last_name','')}",
                "title": basic.get("professional_title", ""),
                "location": basic.get("location", ""),
                "embedding": embeddings[idx].tolist(),
                "profile": profile,
            })

        persist_embeddings_to_file(all_data)
        print(f"✅ Stored {len(all_data)} profiles in {settings.PKL_FILE}")
        return len(all_data)

    except Exception as e:
        print(f"❌ Failed to build embeddings: {e}")
        return 0


# ============================================================
# MATCH PROFILES — HYBRID WEIGHTED SCORING
# ============================================================
async def match_profiles(query: Optional[str], top_k: int, user_manager: UserManager):
    try:
        profiles = load_embeddings_from_file()
        if not profiles:
            print("❌ No embeddings found — run /match/refresh")
            return []

        results = []

        # If query exists → JD Matching Mode
        if query and query.strip():
            print("🧾 JD Detected → Hybrid Matching...")
            q_vec = await encode_text_async(query, normalize_embeddings=True)
            q_vec = q_vec.tolist()

            jd_info = extract_jd_info(query)
            jd_skills = jd_info["skills"]

            for p in profiles:
                profile = p["profile"]
                basic = profile.get("basicInfo", {})
                work_exp = profile.get("workExperience", [])

                profile_skills = set([s.lower() for s in profile.get("skillsResume", {}).get("resume_skills", [])])

                # ---------------- Hybrid Scoring ----------------
                semantic_score = cosine_similarity(q_vec, p["embedding"])

                skill_overlap = len(profile_skills & jd_skills) / max(1, len(jd_skills))

                profile_exp = _calc_experience(work_exp)
                exp_gap = abs(profile_exp - jd_info["required_experience"])
                exp_score = max(0, 1 - (exp_gap / 5))

                title_score = (
                    1.0 if jd_info["job_title"].lower() in p["title"].lower()
                    else 0.5
                )

                location_score = (
                    1.0 if jd_info["location"].lower() in p["location"].lower()
                    else 0.3
                )

                final_score = (
                    semantic_score * 0.40 +
                    skill_overlap * 0.30 +
                    exp_score * 0.15 +
                    title_score * 0.10 +
                    location_score * 0.05
                )

                results.append({
                    "user_id": p["user_id"],
                    "name": p["name"],
                    "title": p["title"],
                    "location": p["location"],
                    "experience_years": profile_exp,
                    "skills": list(profile_skills),
                    "profile_image": basic.get("profile_image", ""),
                    "professional_bio": basic.get("professional_bio", ""),
                    "match_score": round(final_score * 100, 2),
                })

        # No query → Centroid Recommendation
        else:
            print("🤖 No JD provided → Centroid Recommendation Mode...")

            all_emb = np.array([p["embedding"] for p in profiles])
            avg_vec = np.mean(all_emb, axis=0)

            for p in profiles:
                profile = p["profile"]
                basic = profile.get("basicInfo", {}) or {}
                work_exp = profile.get("workExperience", []) or []

                profile_skills = set([
                    s.lower()
                    for s in profile.get("skillsResume", {}).get("resume_skills", [])
                ])

                profile_exp = _calc_experience(work_exp)

                score = cosine_similarity(avg_vec, p["embedding"])

                results.append({
                    "user_id": p["user_id"],
                    "name": p["name"],
                    "title": p["title"],
                    "location": p["location"],
                    "experience_years": profile_exp,
                    "skills": list(profile_skills),
                    "profile_image": basic.get("profile_image", ""),
                    "professional_bio": basic.get("professional_bio", ""),
                    "match_score": round(score * 100, 2)
                })

        results.sort(key=lambda x: x["match_score"], reverse=True)
        return results[:top_k]

    except Exception as e:
        print(f"❌ Unexpected error in match_profiles: {e}")
        return []


# ============================================================
# EXPERIENCE CALCULATOR
# ============================================================
def _calc_experience(work_experiences):
    total = 0
    from datetime import datetime
    now = datetime.now().year

    for exp in work_experiences:
        try:
            start = int(exp.get("start_year", now))
            end = int(exp.get("end_year", now) or now)
            total += max(0, end - start)
        except:
            continue

    return round(total, 1)
