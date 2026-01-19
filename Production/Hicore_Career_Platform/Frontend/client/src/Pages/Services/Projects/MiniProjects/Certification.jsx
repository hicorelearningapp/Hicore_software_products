import React from 'react';
import { useParams } from 'react-router-dom';
import celebrationIcon from '../../assets/certification_emoji.png'; // 🎉 icon
import certificateImage from '../../assets/Course_Certificate.png'; // Certificate image

const Certification = () => {
  const { projectId } = useParams();

  const projectTitles = {
    AIResumeScreening: 'AI-Based Resume Screening System',
    FaceDetection: 'Face Detection & Recognition App',
    SmartAttendance: 'Smart Attendance Monitoring System',
    // Add more if needed
  };

  const projectTitle = projectTitles[projectId] || 'Your Project';

  return (
    <div
      className="flex flex-col justify-end items-center gap-[36px] px-[64px] py-[36px] rounded-[8px] 
                 border border-[#C0BFD5] bg-white flex-1 basis-0 self-stretch"
    >
      {/* Inner Flex Row with Left and Right Sections */}
      <div
        className="flex items-center gap-6 w-full"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          alignSelf: 'stretch',
        }}
      >
        {/* Left: Congratulations Card */}
        <div
          className="flex flex-col justify-center items-start gap-2 p-4 flex-1"
          style={{
            borderRadius: '8px',
            border: '1px solid #EBEAF2',
            padding: '16px',
            flex: '1 0 0',
            alignSelf: 'stretch',
          }}
        >
          {/* Heading */}
          <div className="flex items-center gap-2">
            <h2
              style={{
                color: '#343079',
                fontFamily: 'Poppins',
                fontSize: '24px',
                fontWeight: '700',
                lineHeight: '32px',
              }}
            >
              Congratulations!{' '}
              <img src={celebrationIcon} alt="celebration" style={{ width: 24, height: 24 }} />
            </h2>
          </div>

          {/* Description */}
          <p
            style={{
              alignSelf: 'stretch',
              color: '#343079',
              fontFamily: 'Poppins',
              fontSize: '16px',
              fontWeight: '400',
              lineHeight: '32px',
            }}
          >
            You have successfully completed your hands on project{' '}
            <span style={{ fontWeight: '700' }}>"{projectTitle}"</span>. Your
            skills have been validated and documented in this certificate.
          </p>

          {/* Checklist */}
          <div className="flex flex-col gap-2 mt-2" style={{ alignSelf: 'stretch' }}>
            {[
              'All steps completed successfully',
              'Project report generated and submitted',
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <span style={{ fontSize: 16 }}>✅</span>
                <span
                  style={{
                    color: '#343079',
                    fontFamily: 'Poppins',
                    fontSize: '14px',
                    fontWeight: '400',
                    lineHeight: '24px',
                  }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Certificate Image */}
        <div className="flex-shrink-0">
          <img
            src={certificateImage}
            alt="Certificate"
            style={{
              width: '100%',
              maxWidth: '600px',
              borderRadius: '8px',
              objectFit: 'contain',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Certification;
