import React from "react";
import previewIcon from "../../../assets/preview-icon.png";
import { FiMail, FiPhone, FiGlobe } from "react-icons/fi";
import { AiFillLinkedin } from "react-icons/ai";

const ResumePreview = ({ collapsed, onToggle, formData }) => {
  const {
    personalInfo = {},
    summary = "",
    workExperiences = [],
    skills = [],
    education = [],
    certifications = [],
  } = formData || {};

  // Format Date to "MMM YYYY"
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr; // send original if invalid
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div
      style={{
        transition: "all 0.3s",
        height: "100%",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        border: "1px solid #e5e7eb",
        borderRadius: "0.5rem",
        width: collapsed ? "70px" : "100%",
        position: "relative",
        background: "white",
      }}
    >
      {/* Toggle Button */}
      <div
        className="no-pdf"
        onClick={onToggle}
        title={collapsed ? "Expand Preview" : "Collapse Preview"}
        style={{
          position: "absolute",
          top: "0.5rem",
          left: collapsed ? undefined : "0.5rem",
          right: collapsed ? "0.25rem" : undefined,
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          cursor: "pointer",
          padding: "0.25rem 0.5rem",
          zIndex: 10,
        }}
      >
        <img
          src={previewIcon}
          alt="Toggle Preview"
          style={{ width: "3rem", height: "3rem" }}
        />
        {!collapsed && (
          <span
            style={{ fontSize: "1.125rem", fontWeight: 600, color: "#1e3a8a" }}
          >
            Instant Preview
          </span>
        )}
      </div>

      {!collapsed && (
        <div
          style={{
            padding: "6rem 1.5rem 1rem",
            overflowY: "auto",
            maxHeight: "100%",
            fontFamily: "sans-serif",
            color: "#1f2937",
          }}
        >
          {/* Personal Info */}
          {(personalInfo.firstName || personalInfo.lastName) && (
            <div style={{ marginBottom: "2rem" }}>
              <h1
                style={{
                  fontSize: "1.6rem",
                  fontWeight: "bold",
                  color: "#4f46e5",
                }}
              >
                {personalInfo.firstName || ""} {personalInfo.lastName || ""}
              </h1>
              <h2
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  color: "#1e3a8a",
                  marginTop: "0.25rem",
                }}
              >
                {personalInfo.title || ""}
              </h2>

              <p style={{ color: "#1e3a8a", marginTop: "0.5rem" }}>
                {personalInfo.location || ""}
              </p>

              <div
                style={{
                  marginTop: "0.75rem",
                  fontSize: "0.95rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.35rem",
                }}
              >
                {personalInfo.email && (
                  <p
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      color: "#1e3a8a",
                    }}
                  >
                    <FiMail size={16} />
                    <span>{personalInfo.email}</span>
                  </p>
                )}
                {personalInfo.phone && (
                  <p
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      color: "#1e3a8a",
                    }}
                  >
                    <FiPhone size={16} />
                    <span>{personalInfo.phone}</span>
                  </p>
                )}
                {personalInfo.linkedin && (
                  <p
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      color: "#1e3a8a",
                    }}
                  >
                    <AiFillLinkedin size={18} />
                    <span>{personalInfo.linkedin}</span>
                  </p>
                )}
                {personalInfo.website && (
                  <p
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      color: "#1e3a8a",
                    }}
                  >
                    <FiGlobe size={16} />
                    <span>{personalInfo.website}</span>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Summary */}
          {summary && (
            <div style={{ marginBottom: "2rem" }}>
              <h3
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  color: "#1e3a8a",
                  borderBottom: "2px solid #4f46e5",
                  paddingBottom: "0.25rem",
                  marginBottom: "1rem",
                }}
              >
                Professional Summary
              </h3>
              <p
                style={{
                  fontSize: "0.95rem",
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                  color: "#1e3a8a",
                }}
              >
                {summary}
              </p>
            </div>
          )}

          {/* Work Experience */}
          {workExperiences.length > 0 && (
            <div style={{ marginBottom: "1.5rem" }}>
              <h3
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  color: "#1e3a8a",
                  borderBottom: "2px solid #4f46e5",
                  paddingBottom: "0.25rem",
                  marginBottom: "1.25rem",
                }}
              >
                Work Experience
              </h3>

              {workExperiences.map((job, idx) => (
                <div key={idx} style={{ marginBottom: "1.2rem" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h4
                      style={{
                        fontWeight: 600,
                        fontSize: "1rem",
                        color: "#1e3a8a",
                      }}
                    >
                      {job.title || "-"}
                    </h4>
                    <p style={{ fontSize: "0.85rem", color: "#1e3a8a" }}>
                      {formatDate(job.startDate)} -{" "}
                      {job.current ? "Present" : formatDate(job.endDate)}
                    </p>
                  </div>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 500,
                      color: "#1e3a8a",
                    }}
                  >
                    {job.company || "-"}{" "}
                    {job.location ? `• ${job.location}` : ""}
                  </p>
                  <ul
                    style={{
                      listStyleType: "disc",
                      paddingLeft: "1.25rem",
                      fontSize: "0.9rem",
                      lineHeight: 1.5,
                      color: "#1e3a8a",
                    }}
                  >
                    {(job.responsibilities || "")
                      .split("\n")
                      .filter(Boolean)
                      .map((res, i) => (
                        <li key={i}>{res.trim()}</li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div style={{ marginBottom: "1.5rem" }}>
              <h3
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  color: "#1e3a8a",
                  borderBottom: "2px solid #4f46e5",
                  paddingBottom: "0.25rem",
                  marginBottom: "1.25rem",
                }}
              >
                Skills
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    style={{
                      backgroundColor: "#eef2ff",
                      color: "#4f46e5",
                      padding: "0.4rem 0.8rem",
                      fontSize: "0.85rem",
                      borderRadius: "9999px",
                      border: "1px solid #c7d2fe",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div style={{ marginBottom: "1.5rem" }}>
              <h3
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  color: "#1e3a8a",
                  borderBottom: "2px solid #4f46e5",
                  paddingBottom: "0.25rem",
                  marginBottom: "1.25rem",
                }}
              >
                Education
              </h3>
              {education.map((edu, idx) => (
                <div key={idx} style={{ marginBottom: "0.75rem" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <h4
                      style={{
                        fontWeight: 600,
                        fontSize: "1rem",
                        color: "#1e3a8a",
                      }}
                    >
                      {edu.level || "-"}
                    </h4>
                    <p style={{ fontSize: "0.85rem", color: "#1e3a8a" }}>
                      {edu.startYear || "?"} - {edu.endYear || "?"}
                    </p>
                  </div>
                  <p style={{ fontSize: "0.9rem", color: "#1e3a8a" }}>
                    {edu.field || "-"}
                  </p>
                  <p style={{ fontSize: "0.9rem", color: "#1e3a8a" }}>
                    {edu.college || "-"}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div style={{ marginBottom: "1.5rem" }}>
              <h3
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  color: "#1e3a8a",
                  borderBottom: "2px solid #4f46e5",
                  paddingBottom: "0.25rem",
                  marginBottom: "1.25rem",
                }}
              >
                Certifications
              </h3>
              {certifications.map((cert, idx) => (
                <div key={idx} style={{ marginBottom: "0.75rem" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <h4
                      style={{
                        fontWeight: 600,
                        fontSize: "1rem",
                        color: "#1e3a8a",
                      }}
                    >
                      {cert.name || "-"}
                    </h4>
                    <p style={{ fontSize: "0.85rem", color: "#1e3a8a" }}>
                      {cert.issue || "-"} - {cert.expiry || "-"}
                    </p>
                  </div>

                  <p style={{ fontSize: "0.9rem", color: "#1e3a8a" }}>
                    {cert.org || "-"}
                  </p>

                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: "0.85rem",
                        color: "#2563eb",
                        textDecoration: "underline",
                        marginTop: "0.25rem",
                        display: "block",
                      }}
                    >
                      View Certificate
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumePreview;
