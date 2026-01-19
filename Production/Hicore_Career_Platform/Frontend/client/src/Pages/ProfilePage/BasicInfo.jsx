import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import uploadicon from "../../assets/profile/upload.png";

const BasicInfo = forwardRef(({ updateData, initialData = {} }, ref) => {
  const storedUserId =
    localStorage.getItem("user_id") || localStorage.getItem("userId");

  const [basicInfo, setBasicInfo] = useState({
    user_id: storedUserId ? Number(storedUserId) : "",
    first_name: "",
    last_name: "",
    email: "",
    mobile_number: "",
    professional_title: "",
    location: "",
    professional_bio: "",
    job_alerts: false,
    linkedin_profile: "",
    portfolio_website: "",
    github_profile: "",
    profile_image: null,
    selfintro_video: null,
    profile_preview: null,
    selfintro_preview: null,
  });

  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [videoStream, setVideoStream] = useState(null);
  const videoRef = useRef(null);

  // ✅ Prefill once when initialData changes (Edit Mode)
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setBasicInfo((prev) => {
        const merged = { ...prev, ...initialData };

        // ✅ Handle preview URLs for image and video (when editing)
        if (
          initialData.profile_image &&
          typeof initialData.profile_image === "string"
        ) {
          merged.profile_preview = initialData.profile_image;
        }
        if (
          initialData.selfintro_video &&
          typeof initialData.selfintro_video === "string"
        ) {
          merged.selfintro_preview = initialData.selfintro_video;
        }

        return merged;
      });
    }
  }, [initialData]);

  // ✅ Only sync with parent when data changes (debounced)
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (updateData) {
        const { profile_preview, selfintro_preview, ...cleanData } = basicInfo;
        updateData(cleanData);
      }
    }, 300); // small debounce to avoid rapid re-renders

    return () => clearTimeout(timeout);
  }, [basicInfo]); // deliberately exclude updateData to prevent loops

  // ✅ Handle field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleJobAlertChange = (value) => {
    setBasicInfo((prev) => ({ ...prev, job_alerts: value === "Yes" }));
  };

  // ✅ Profile image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setBasicInfo((prev) => ({
      ...prev,
      profile_image: file,
      profile_preview: previewUrl,
    }));
  };

  // ✅ Self intro video upload
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setBasicInfo((prev) => ({
      ...prev,
      selfintro_video: file,
      selfintro_preview: previewUrl,
    }));
  };

  // ✅ Video recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setVideoStream(stream);
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const file = new File([blob], "selfintro_video.webm", {
          type: "video/webm",
        });
        const previewUrl = URL.createObjectURL(blob);
        setBasicInfo((prev) => ({
          ...prev,
          selfintro_video: file,
          selfintro_preview: previewUrl,
        }));
        stream.getTracks().forEach((t) => t.stop());
        setRecording(false);
      };

      setMediaRecorder(recorder);
      recorder.start();
      setRecording(true);

      // auto-stop after 2 minutes
      setTimeout(() => {
        if (recorder.state === "recording") recorder.stop();
      }, 120000);
    } catch {
      alert("Camera or microphone access denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
    }
  };

  const handleDeleteVideo = () => {
    setBasicInfo((prev) => ({
      ...prev,
      selfintro_video: null,
      selfintro_preview: null,
    }));
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  useEffect(() => {
    if (recording && videoStream && videoRef.current) {
      videoRef.current.srcObject = videoStream;
    }
  }, [recording, videoStream]);

  // ✅ Expose validate() method for CreateProfile parent
  useImperativeHandle(ref, () => ({
    validate: () => {
      const requiredFields = [
        "first_name",
        "last_name",
        "email",
        "mobile_number",
        "professional_title",
        "location",
        "professional_bio",
      ];

      for (let field of requiredFields) {
        if (!basicInfo[field] || basicInfo[field].trim() === "") {
          alert(`⚠️ Please fill all required fields`);
          return false;
        }
      }

      if (!basicInfo.profile_image) {
        alert("⚠️ Please upload your profile picture.");
        return false;
      }

      if (!basicInfo.selfintro_video) {
        alert("⚠️ Please upload or record a self introduction video.");
        return false;
      }

      return true;
    },
  }));

  return (
    <div className="w-full h-fit pt-4 pr-32 pb-4 pl-32 flex flex-col gap-9 max-md:px-4 font-poppins">
      {/* Full Name */}
      <div className="flex flex-col gap-1 w-full">
        <label className="text-[16px] text-[#343079]">
          Full Name <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2 max-md:flex-col">
          <input
            type="text"
            name="first_name"
            placeholder="Karthi"
            value={basicInfo.first_name}
            onChange={handleChange}
            className="w-1/2 max-md:w-full h-12 px-4 rounded-lg border border-[#AEADBE]"
          />
          <input
            type="text"
            name="last_name"
            placeholder="Kumar"
            value={basicInfo.last_name}
            onChange={handleChange}
            className="w-1/2 max-md:w-full h-12 px-4 rounded-lg border border-[#AEADBE]"
          />
        </div>
      </div>

      {/* Email & Mobile */}
      <div className="flex gap-2 w-full max-md:flex-col">
        <div className="flex flex-col w-1/2 max-md:w-full gap-1">
          <label className="text-[16px] text-[#343079]">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="abc@email.com"
            value={basicInfo.email}
            onChange={handleChange}
            className="w-full h-12 px-4 rounded-lg border border-[#AEADBE]"
          />
        </div>

        <div className="flex flex-col w-1/2 max-md:w-full gap-1">
          <label className="text-[16px] text-[#343079]">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="mobile_number"
            placeholder="+91 9876543210"
            value={basicInfo.mobile_number}
            onChange={handleChange}
            className="w-full h-12 px-4 rounded-lg border border-[#AEADBE]"
          />
        </div>
      </div>

      {/* Professional Title */}
      <div className="flex flex-col w-full gap-1">
        <label className="text-[16px] text-[#343079]">
          Professional Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="professional_title"
          placeholder="Student Developer"
          value={basicInfo.professional_title}
          onChange={handleChange}
          className="w-full h-12 px-4 rounded-lg border border-[#AEADBE]"
        />
      </div>

      {/* Location */}
      <div className="flex flex-col w-full gap-1">
        <label className="text-[16px] text-[#343079]">
          Location <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="location"
          placeholder="Chennai, India"
          value={basicInfo.location}
          onChange={handleChange}
          className="w-full h-12 px-4 rounded-lg border border-[#AEADBE]"
        />
      </div>

      {/* Bio */}
      <div className="flex flex-col w-full gap-1">
        <label className="text-[16px] text-[#343079]">
          Professional Bio <span className="text-red-500">*</span>
        </label>
        <textarea
          name="professional_bio"
          placeholder="Passionate about AI and Web Development..."
          value={basicInfo.professional_bio}
          onChange={handleChange}
          className="w-full h-32 px-4 pt-2 rounded-lg border border-[#AEADBE] resize-none"
        />
      </div>

      {/* Job Alerts */}
      <div className="flex flex-col gap-1 w-full">
        <label className="text-[16px] text-[#343079]">
          Would you like to receive job alerts? <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-6 mt-1">
          {["Yes", "No"].map((opt) => (
            <label key={opt} className="flex items-center gap-2 text-[#343079]">
              <input
                type="radio"
                name="job_alerts"
                value={opt}
                checked={basicInfo.job_alerts === (opt === "Yes")}
                onChange={() => handleJobAlertChange(opt)}
                className="w-4 h-4 accent-[#343079]"
              />
              {opt}
            </label>
          ))}
        </div>
      </div>

      {/* Social Links */}
      {[
        {
          key: "linkedin_profile",
          label: "LinkedIn Profile",
          placeholder: "https://linkedin.com/in/username",
        },
        {
          key: "portfolio_website",
          label: "Portfolio Website",
          placeholder: "https://yourportfolio.com",
        },
        {
          key: "github_profile",
          label: "GitHub Profile",
          placeholder: "https://github.com/username",
        },
      ].map(({ key, label, placeholder }) => (
        <div key={key} className="flex flex-col w-full gap-1">
          <label className="text-[16px] text-[#343079]">{label}</label>
          <input
            type="text"
            name={key}
            placeholder={placeholder}
            value={basicInfo[key]}
            onChange={handleChange}
            className="w-full h-12 px-4 rounded-lg border border-[#AEADBE]"
          />
        </div>
      ))}

      {/* Profile Picture */}
      <div className="flex flex-col w-full gap-1">
        <label className="text-[16px] text-[#343079]">
          Upload Profile Picture <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          id="profileImage"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
        <label
          htmlFor="profileImage"
          className="flex items-center gap-2 w-fit h-[40px] px-4 py-1 border border-[#343079] rounded-lg cursor-pointer hover:bg-[#EBEAF2]"
        >
          <img src={uploadicon} alt="Upload" className="w-5 h-5" />
          <span className="text-[#343079] font-semibold">Upload Picture</span>
        </label>
        {basicInfo.profile_preview && (
          <img
            src={basicInfo.profile_preview}
            alt="Preview"
            className="mt-2 w-24 h-24 rounded-lg border"
          />
        )}
      </div>

      {/* Self Intro Video */}
      <div className="flex flex-col w-full gap-1">
        <label className="text-[16px] text-[#343079]">
          Self Introduction (1–2 min) <span className="text-red-500">*</span>
        </label>
        <p className="text-[14px] text-[#6B6B83] mb-2">
          Upload or record a short self intro video (max 2 minutes).
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <input
            type="file"
            id="selfintro_video"
            accept="video/*"
            className="hidden"
            onChange={handleVideoUpload}
          />
          <label
            htmlFor="selfintro_video"
            className="flex items-center gap-2 w-[180px] h-[40px] px-4 py-1 border border-[#343079] rounded-lg cursor-pointer hover:bg-[#EBEAF2]"
          >
            <img src={uploadicon} alt="Upload" className="w-5 h-5" />
            <span className="text-[#343079] font-semibold">
              {basicInfo.selfintro_video ? "Replace Video" : "Upload Video"}
            </span>
          </label>

          {!recording ? (
            <button
              onClick={startRecording}
              className="bg-[#343079] text-white px-4 py-2 rounded-lg"
            >
              Record Video
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Stop Recording
            </button>
          )}
        </div>

        {recording && (
          <video
            ref={videoRef}
            autoPlay
            muted
            className="mt-3 w-[300px] h-[220px] rounded-lg border"
          />
        )}
        {basicInfo.selfintro_preview && !recording && (
          <div className="mt-3 flex flex-col gap-3">
            <video
              src={basicInfo.selfintro_preview}
              controls
              className="w-[300px] h-[220px] rounded-lg border"
            />
            <button
              onClick={handleDeleteVideo}
              className="bg-red-600 text-white px-3 py-2 rounded-lg w-[150px]"
            >
              Delete Video
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

export default BasicInfo;
