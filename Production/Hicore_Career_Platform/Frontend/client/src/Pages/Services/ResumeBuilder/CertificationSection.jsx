import React, { useState } from "react";

const CertificationSection = ({ certifications = [], setCertifications }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [newCert, setNewCert] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleCertChange = (index, field, value) => {
    const updated = [...certifications];
    updated[index] = { ...updated[index], [field]: value };
    setCertifications(updated);
  };

  const handleAddCertification = () => {
    setNewCert({
      name: "",
      org: "",
      issue: "",
      expiry: "",
      credentialUrl: "",
    });
    setEditingIndex(null);
    setErrorMsg("");
  };

  const handleSaveNew = () => {
    if (!newCert.name.trim() || !newCert.org.trim()) {
      setErrorMsg("⚠️ Certificate Name & Organization are required");
      return;
    }
    setCertifications([...(certifications || []), newCert]);
    setNewCert(null);
    setErrorMsg("");
  };

  const handleCancelNew = () => {
    setNewCert(null);
    setErrorMsg("");
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setNewCert(null);
    setErrorMsg("");
  };

  const handleSaveEdit = () => {
    setEditingIndex(null);
  };

  const handleDeleteCertification = (index) => {
    const updated = certifications.filter((_, i) => i !== index);
    setCertifications(updated);
  };

  return (
    <div className="border rounded-xl border-blue-900 overflow-hidden mb-6">
      {/* Header */}
      <div className="bg-[#F2F2FF] px-4 py-4 border-b border-blue-900">
        <h3 className="text-[20px] font-semibold text-blue-900">
          Certifications
        </h3>
      </div>

      <div className="px-4 py-3 space-y-6">
        {certifications?.length === 0 && !newCert && (
          <p className="text-gray-500 text-sm italic">
            No certifications added yet.
          </p>
        )}

        {certifications.map((cert, index) => (
          <div key={index} className="border border-blue-900 p-3 rounded-lg">
            {editingIndex === index ? (
              <div className="space-y-4 text-blue-900">
                {/* Certificate Name */}
                <div>
                  <label className="block mb-2">Certificate Name</label>
                  <input
                    type="text"
                    className="w-full border border-blue-900 rounded-lg p-3 text-sm"
                    value={cert.name}
                    onChange={(e) =>
                      handleCertChange(index, "name", e.target.value)
                    }
                  />
                </div>

                {/* Organization */}
                <div>
                  <label className="block mb-2">Issuing Organization</label>
                  <input
                    type="text"
                    className="w-full border border-blue-900 rounded-lg p-3 text-sm"
                    value={cert.org}
                    onChange={(e) =>
                      handleCertChange(index, "org", e.target.value)
                    }
                  />
                </div>

                {/* Dates */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block mb-2">Issue Date</label>
                    <input
                      type="text"
                      className="w-full border border-blue-900 rounded-lg p-3 text-sm"
                      value={cert.issue}
                      onChange={(e) =>
                        handleCertChange(index, "issue", e.target.value)
                      }
                      placeholder="YYYY or YYYY-MM"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block mb-2">Expiry Date</label>
                    <input
                      type="text"
                      className="w-full border border-blue-900 rounded-lg p-3 text-sm"
                      value={cert.expiry}
                      onChange={(e) =>
                        handleCertChange(index, "expiry", e.target.value)
                      }
                      placeholder="YYYY or YYYY-MM"
                    />
                  </div>
                </div>

                {/* URL */}
                <div>
                  <label className="block mb-2">
                    Certificate URL (Optional)
                  </label>
                  <input
                    type="text"
                    className="w-full border border-blue-900 rounded-lg p-3 text-sm"
                    value={cert.credentialUrl}
                    onChange={(e) =>
                      handleCertChange(index, "credentialUrl", e.target.value)
                    }
                  />
                </div>

                {/* Save + Delete */}
                <div className="flex justify-between">
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-[#2D2C8D] text-white rounded-lg text-sm font-medium"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => handleDeleteCertification(index)}
                    className="px-4 py-2 border border-red-600 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-blue-900">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-[16px]">
                      {cert.name || "Not specified"}
                    </p>
                    <p className="text-sm">{cert.org}</p>
                  </div>
                  <p className="text-sm whitespace-nowrap">
                    {cert.issue || "-"} - {cert.expiry || "-"}
                  </p>
                </div>

                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    className="text-sm text-blue-700 underline mt-1 block"
                  >
                    View Certificate
                  </a>
                )}

                {/* Edit + Delete */}
                <div className="flex justify-between mt-2">
                  <button
                    onClick={() => handleEdit(index)}
                    className="px-3 py-1 text-[#343079] border border-[#343079] rounded-lg text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCertification(index)}
                    className="px-3 py-1 border border-red-600 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Add New Certification Form */}
        {newCert && (
          <div className="border border-blue-900 p-3 rounded-lg space-y-4 text-blue-900">
            {errorMsg && (
              <p className="text-red-600 text-sm font-medium">{errorMsg}</p>
            )}

            {/* Certificate Name */}
            <div>
              <label className="block mb-2">Certificate Name</label>
              <input
                type="text"
                className="w-full border border-blue-900 rounded-lg p-3 text-sm"
                value={newCert.name}
                onChange={(e) =>
                  setNewCert({ ...newCert, name: e.target.value })
                }
              />
            </div>

            {/* Organization */}
            <div>
              <label className="block mb-2">Issuing Organization</label>
              <input
                type="text"
                className="w-full border border-blue-900 rounded-lg p-3 text-sm"
                value={newCert.org}
                onChange={(e) =>
                  setNewCert({ ...newCert, org: e.target.value })
                }
              />
            </div>

            {/* Dates */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block mb-2">Issue Date</label>
                <input
                  type="text"
                  className="w-full border border-blue-900 rounded-lg p-3 text-sm"
                  value={newCert.issue}
                  onChange={(e) =>
                    setNewCert({ ...newCert, issue: e.target.value })
                  }
                  placeholder="YYYY or YYYY-MM"
                />
              </div>

              <div className="flex-1">
                <label className="block mb-2">Expiry Date</label>
                <input
                  type="text"
                  className="w-full border border-blue-900 rounded-lg p-3 text-sm"
                  value={newCert.expiry}
                  onChange={(e) =>
                    setNewCert({ ...newCert, expiry: e.target.value })
                  }
                  placeholder="YYYY or YYYY-MM"
                />
              </div>
            </div>

            {/* URL */}
            <div>
              <label className="block mb-2">Certificate URL (Optional)</label>
              <input
                type="text"
                className="w-full border border-blue-900 rounded-lg p-3 text-sm"
                value={newCert.credentialUrl}
                onChange={(e) =>
                  setNewCert({ ...newCert, credentialUrl: e.target.value })
                }
              />
            </div>

            {/* Delete + Save New */}
            <div className="flex justify-between">
              <button
                onClick={handleCancelNew}
                className="px-4 py-2 border border-red-600 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50"
              >
                Delete
              </button>

              <button
                onClick={handleSaveNew}
                className="px-4 py-2 bg-[#2D2C8D] text-white rounded-lg text-sm font-medium"
              >
                Save Certification
              </button>
            </div>
          </div>
        )}

        {/* Add Button */}
        {!newCert && (
          <button
            onClick={handleAddCertification}
            className="px-3 py-2 bg-[#F2F2FF] text-[#343079] border border-[#343079] rounded-lg text-sm font-medium hover:bg-[#E9E9FF] transition mt-3"
          >
            + Add Certification
          </button>
        )}
      </div>
    </div>
  );
};

export default CertificationSection;
