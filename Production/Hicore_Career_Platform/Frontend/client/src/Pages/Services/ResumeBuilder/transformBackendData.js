// src/Pages/Services/ResumeBuilder/transformBackendData.js

export default function transformBackendData(apiData) {
  if (!apiData) return null;

  const basic = apiData.basicInfo || {};

  return {
    personalInfo: {
      firstName: basic.first_name || "",
      lastName: basic.last_name || "",
      email: basic.email || "",
      phone: basic.mobile_number || "",
      title: basic.professional_title || "",
      linkedin: basic.linkedin_profile || "",
      website: basic.portfolio_website || "",
      location: basic.location || "",
    },

    summary: basic.professional_bio || "",

    workExperiences: (apiData.workExperience || []).map((exp) => ({
      company: exp.company_name || "",
      title: exp.job_title || "",
      location: exp.job_location || "",
      startDate: exp.start_year ? `${exp.start_year}-01-01` : "", // ✅ date input friendly
      endDate: exp.currently_working
        ? ""
        : exp.end_year
        ? `${exp.end_year}-01-01`
        : "",
      current: exp.currently_working || false,
      responsibilities: exp.responsibilities || "",
    })),

    education: (apiData.education || []).map((edu) => ({
      level:
        edu.education_level === "Bachelor's"
          ? "BE/BTech"
          : edu.education_level === "High School"
          ? "Intermediate"
          : edu.education_level || "",
      field: edu.field_of_study || "",
      college: edu.college_name || "",
      startYear: edu.edu_start_year || "",
      endYear: edu.edu_end_year || "",
    })),

    skills: apiData.skillsResume?.resume_skills || [],

    certifications: (apiData.certifications || []).map((cert) => ({
      name: cert.certificate_name || "",
      org: cert.issuing_org || "",
      issue: cert.issue_year || "",
      expiry: cert.expiry_year || "",
      credentialUrl: cert.credential_url || "",
    })),
  };
}
