import React, { useState, useEffect } from "react";
import { Pencil, Link as LinkIcon, Lock, Trash2 } from "lucide-react";
import profileImage from "../../../assets/SettingsPage/settings-image.jpg"; // ✅ Update path if needed

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("account");

  const userId = localStorage.getItem("userId");

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) {
      setError("User ID not found in local storage.");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_BASE}/profile/${userId}`);

        if (!response.ok) {
          throw new Error("Profile not found");
        }

        const data = await response.json();
        setProfileData(data.basicInfo);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);


  
  
  // Notifications state
  const [notifications, setNotifications] = useState({
    courseReminders: false,
    projectInvites: false,
    certificationAlerts: false,
    achievementsUpdates: false,
    jobApplications: false,
  });

  // Privacy state
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "",
    hideProfilePic: false,
  });

  // Learning Preferences state
  const [learningPreferences, setLearningPreferences] = useState({
    courseInterests: "",
    autoSuggestProjects: false,
    studyReminders: false,
  });

  // Language & Accessibility state
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    language: "",
    darkTheme: false,
    fontSize: "",
  });

  const tabs = [
    { id: "account", label: "Account & Profile" },
    { id: "notifications", label: "Notifications" },
    { id: "privacy", label: "Privacy & Security" },
    { id: "learning", label: "Learning Preferences" },
    { id: "language", label: "Language & Accessibility" },
  ];

  const toggleNotification = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const togglePrivacy = (key) => {
    setPrivacySettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleLearning = (key) => {
    setLearningPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleAccessibility = (key) => {
    setAccessibilitySettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-50 ">
      {/* -------- Profile Card -------- */}
<div
  className="rounded-xl p-6 flex max-w-7xl w-full mb-10"
  style={{
    background: "linear-gradient(90deg, #3430794D 0%, #918ECC1A 100%)",
  }}
>

  {/* Loading State */}
  {loading && (
    <div className="text-blue-900 text-lg font-medium mx-auto py-10">
      Loading profile...
    </div>
  )}

  {/* No Profile Found */}
  {!loading && !profileData && (
    <div className="w-full text-center py-10">
      <p className="text-blue-900 text-lg mb-4">No profile found.</p>
      <a
        href="/create-profile"
        className="px-5 py-2 bg-[#343079] text-white rounded-lg hover:bg-[#2a2466]"
      >
        Create Profile
      </a>
    </div>
  )}

  {/* Profile Exists */}
  {!loading && profileData && (
    <>
      {/* Profile Image */}
      <img
        src={`${API_BASE}/${profileData.profile_image}`}
        alt="Profile"
        className="w-50 h-50 rounded-xl object-cover"
      />

      {/* Profile Info */}
      <div className="ml-6 flex-1">
        <h2 className="text-xl mt-2 font-semibold mb-2 text-[#343079]">
          {profileData.first_name} {profileData.last_name}
        </h2>

        <p className="text-md mb-2 text-blue-900">
          {profileData.professional_title || "No title added"}
        </p>

        <p className="text-md mb-2 text-blue-900 mt-1">
          {profileData.location || "Location not provided"}
        </p>

        {/* Edit Button */}
        <button className="mt-8 px-5 py-2 bg-[#343079] text-white rounded-lg shadow hover:bg-[#2a2466] transition flex items-center gap-2">
          <Pencil className="w-4 h-4" />
          Edit Profile Card
        </button>
      </div>
    </>
  )}
</div>


      {/* -------- Tabs -------- */}
      <div className="w-full max-w-7xl">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 text-md font-medium transition ${
                activeTab === tab.id
                  ? "bg-[#343079] text-white rounded-t-lg"
                  : "text-gray-500 hover:text-[#343079]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* -------- Account Tab -------- */}
      {activeTab === "account" && (
        <div className="w-full max-w-7xl bg-white border border-blue-900 shadow p-6">
          <div className="flex justify-between items-center border border-gray-300 rounded-lg p-3">
            <span className="text-blue-900 font-medium">Edit Profile</span>
            <button className="px-4 py-2 bg-[#343079] md:w-35 justify-center text-white rounded-lg flex items-center gap-2 hover:bg-[#2a2466] transition">
              <Pencil className="w-4 h-4" />
              Edit
            </button>
          </div>

          <div className="flex justify-between items-center border border-gray-300 rounded-lg mt-3 p-3">
            <span className="text-blue-900 font-medium">Linked Accounts</span>
            <button className="px-4 py-2 bg-[#343079] md:w-35 justify-center text-white rounded-lg flex items-center gap-2 hover:bg-[#2a2466] transition">
              <LinkIcon className="w-4 h-4" />
              Link
            </button>
          </div>

          <div className="flex justify-between items-center border border-gray-300 rounded-lg mt-3 p-3">
            <span className="text-blue-900 font-medium">Change Password</span>
            <button className="px-4 py-2 bg-[#343079] md:w-35 justify-center text-white rounded-lg flex items-center gap-2 hover:bg-[#2a2466] transition">
              <Lock className="w-4 h-4" />
              Change
            </button>
          </div>

          <div className="flex justify-between items-center border border-gray-300 rounded-lg mt-3 p-3">
            <span className="text-blue-900 font-medium">
              Deactivate Account
            </span>
            <button className="px-4 py-2 bg-[#343079] md:w-35 justify-center text-white rounded-lg flex items-center gap-2 hover:bg-red-700 transition">
              <Trash2 className="w-4 h-4" />
              Deactivate
            </button>
          </div>
        </div>
      )}

      {/* -------- Notifications Tab -------- */}
      {activeTab === "notifications" && (
        <div className="w-full max-w-7xl bg-white border rounded-lg border-blue-900 shadow p-6">
          {[
            { key: "courseReminders", label: "Course Reminders" },
            { key: "projectInvites", label: "Project Invites" },
            { key: "certificationAlerts", label: "Certification Alerts" },
            { key: "achievementsUpdates", label: "Achievements Updates" },
            { key: "jobApplications", label: "Job Applications Updates" },
          ].map((item) => (
            <div
              key={item.key}
              className="flex justify-between items-center border border-gray-300 rounded-lg p-5 mb-3"
            >
              <span className="text-blue-900 font-medium">{item.label}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications[item.key]}
                  onChange={() => toggleNotification(item.key)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#343079] transition"></div>
                <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full border border-gray-300 transition-transform peer-checked:translate-x-5"></div>
              </label>
            </div>
          ))}
        </div>
      )}

      {/* -------- Privacy & Security Tab -------- */}
      {activeTab === "privacy" && (
        <div className="w-full max-w-7xl bg-white border rounded-lg border-blue-900 shadow p-6">
          {/* Profile Visibility */}
          <div className="flex justify-between items-center border border-gray-300 rounded-lg p-4 mb-3">
            <span className="text-blue-900 font-medium">
              Who can view my profile
            </span>
            <select
              value={privacySettings.profileVisibility}
              onChange={(e) =>
                setPrivacySettings((prev) => ({
                  ...prev,
                  profileVisibility: e.target.value,
                }))
              }
              className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#343079]"
            >
              <option value="">Select option</option>
              <option value="everyone">Everyone</option>
              <option value="friends">Friends Only</option>
              <option value="private">Only Me</option>
            </select>
          </div>

          {/* Hide Profile Pic */}
          <div className="flex justify-between items-center border border-gray-300 rounded-lg p-5">
            <span className="text-blue-900 font-medium">Hide Profile Pic</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacySettings.hideProfilePic}
                onChange={() => togglePrivacy("hideProfilePic")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#343079] transition"></div>
              <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full border border-gray-300 transition-transform peer-checked:translate-x-5"></div>
            </label>
          </div>
        </div>
      )}

      {/* -------- Learning Preferences Tab -------- */}
      {activeTab === "learning" && (
        <div className="w-full max-w-7xl bg-white border rounded-lg border-blue-900 shadow p-6">
          {/* Course Interests */}
          <div className="flex justify-between items-center border border-gray-300 rounded-lg p-4 mb-3">
            <span className="text-blue-900 font-medium">Course Interests</span>
            <select
              value={learningPreferences.courseInterests}
              onChange={(e) =>
                setLearningPreferences((prev) => ({
                  ...prev,
                  courseInterests: e.target.value,
                }))
              }
              className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#343079]"
            >
              <option value="">Select option</option>
              <option value="ai">Artificial Intelligence</option>
              <option value="ml">Machine Learning</option>
              <option value="web">Web Development</option>
              <option value="cloud">Cloud Computing</option>
            </select>
          </div>

          {/* Auto-Suggest Projects */}
          <div className="flex justify-between items-center border border-gray-300 rounded-lg p-5 mb-3">
            <span className="text-blue-900 font-medium">
              Auto-Suggest Projects
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={learningPreferences.autoSuggestProjects}
                onChange={() => toggleLearning("autoSuggestProjects")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#343079] transition"></div>
              <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full border border-gray-300 transition-transform peer-checked:translate-x-5"></div>
            </label>
          </div>

          {/* Study Reminders */}
          <div className="flex justify-between items-center border border-gray-300 rounded-lg p-5">
            <span className="text-blue-900 font-medium">Study Reminders</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={learningPreferences.studyReminders}
                onChange={() => toggleLearning("studyReminders")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#343079] transition"></div>
              <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full border border-gray-300 transition-transform peer-checked:translate-x-5"></div>
            </label>
          </div>
        </div>
      )}

      {/* -------- Language & Accessibility Tab -------- */}
      {activeTab === "language" && (
        <div className="w-full max-w-7xl bg-white border rounded-lg border-blue-900 shadow p-6">
          {/* Language */}
          <div className="flex justify-between items-center border border-gray-300 rounded-lg p-4 mb-3">
            <span className="text-blue-900 font-medium">Language</span>
            <select
              value={accessibilitySettings.language}
              onChange={(e) =>
                setAccessibilitySettings((prev) => ({
                  ...prev,
                  language: e.target.value,
                }))
              }
              className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#343079]"
            >
              <option value="">Select option</option>
              <option value="english">English</option>
              <option value="telugu">Telugu</option>
              <option value="hindi">Hindi</option>
              <option value="tamil">Tamil</option>
            </select>
          </div>

          {/* Theme */}
          <div className="flex justify-between items-center border border-gray-300 rounded-lg p-5 mb-3">
            <span className="text-blue-900 font-medium">Theme</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={accessibilitySettings.darkTheme}
                onChange={() => toggleAccessibility("darkTheme")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#343079] transition"></div>
              <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full border border-gray-300 transition-transform peer-checked:translate-x-5"></div>
            </label>
          </div>

          {/* Font Size */}
          <div className="flex justify-between items-center border border-gray-300 rounded-lg p-4">
            <span className="text-blue-900 font-medium">Font Size</span>
            <select
              value={accessibilitySettings.fontSize}
              onChange={(e) =>
                setAccessibilitySettings((prev) => ({
                  ...prev,
                  fontSize: e.target.value,
                }))
              }
              className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#343079]"
            >
              <option value="">Select option</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
