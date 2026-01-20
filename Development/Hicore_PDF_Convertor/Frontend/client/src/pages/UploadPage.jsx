import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { ToolDetails } from "../data/toolDetails";
import UploadPanel from "../components/UploadPannel";

const UploadPage = () => {
  const { toolId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const config = ToolDetails[toolId];

  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    // Accept selected files passed from ToolPage
    if (location.state?.selectedFiles) {
      setSelectedFiles(location.state.selectedFiles);
    }
  }, [location.state]);

  // If tool is custom, forward to custom second screen AFTER we have selectedFiles.
  useEffect(() => {
    if (!config) return;

    // Only redirect when this is a custom tool and files are present.
    if (config.mode === "custom" && selectedFiles.length > 0) {
      // navigate to the custom page and pass along the selected files.
      navigate(`/tools/${toolId}/custom`, { state: { selectedFiles } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, selectedFiles, toolId]);

  if (!config) {
    return (
      <div className="text-center mt-20 text-red-600 text-xl">
        Tool not found.
      </div>
    );
  }

  // If this is custom, we are redirecting to /custom above — render nothing to avoid flicker.
  if (config.mode === "custom") return null;

  // Otherwise render the shared UploadPanel for convert-mode tools.
  return (
    <div className="min-h-screen bg-gray-50">
      <UploadPanel
        onBack={() => navigate(`/tools/${toolId}`)}
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        config={config}
      />
    </div>
  );
};

export default UploadPage;
