import React, { useRef, useState, useEffect } from "react";
import CameraMicCheck from "./stepsPage/CameraMicCheck";
import StepTwoForm from "./stepsPage/StepTwoForm";
import StepThreeRecording from "./stepsPage/StepThreeRecording";
import StepFourPreview from "./stepsPage/StepFourPreview";
import StepFiveChecklist from "./stepsPage/StepFiveChecklist";
import StepSixPlaceholder from "./stepsPage/StepSixPlaceholder";

const VideoRecordingSteps = () => {
  const liveVideoRef = useRef(null);
  const playbackVideoRef = useRef(null);

  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState({
    name: "karthik",
    background: "farmer",
    goal: "developer",
    location: "pollachi",
  });

  const [stream, setStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState(null);

  const [recording, setRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [progress, setProgress] = useState(0);
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(false);

  const [checklist, setChecklist] = useState({
    intro: false,
    clear: false,
    noPrivate: false,
    duration: false,
  });

  const [extras, setExtras] = useState({
    thumbnail: false,
    trimming: false,
    transcript: false,
  });

  const isChecklistValid = () =>
    checklist.intro &&
    checklist.clear &&
    checklist.noPrivate &&
    checklist.duration;

  // Initialize camera stream
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        setStream(mediaStream);
        if (liveVideoRef.current) {
          liveVideoRef.current.srcObject = mediaStream;
        }
      })
      .catch((err) => {
        console.error("Error accessing media devices:", err);
        alert("Unable to access camera/mic. Please allow permissions.");
      });

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Set live stream when entering Step 3
  useEffect(() => {
    if (currentStep === 2 && stream && liveVideoRef.current) {
      liveVideoRef.current.srcObject = stream;
      liveVideoRef.current.play().catch(() => {});
    }
  }, [currentStep, stream]);

  // Set recorded video URL when entering playback steps
  useEffect(() => {
    if (
      (currentStep === 3 || currentStep === 5) &&
      recordedVideoUrl &&
      playbackVideoRef.current
    ) {
      playbackVideoRef.current.src = recordedVideoUrl;
      playbackVideoRef.current.muted = muted;
    }
  }, [currentStep, recordedVideoUrl, muted]);

  // Recording logic
  const handleStartRecording = () => {
    if (!stream) return;

    setRecordedVideoUrl(null);
    setRecordedChunks([]);

    const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    const chunks = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setRecordedVideoUrl(url);
      setRecordedChunks(chunks);
    };

    recorder.start();
    setMediaRecorder(recorder);
    setRecording(true);
    setTimer(0);

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev >= 120) {
          clearInterval(interval);
          handleStopRecording();
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handleStopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
    setRecording(false);
  };

  // Playback controls
  const handlePlayPause = (action) => {
    const vid = playbackVideoRef.current;
    if (!vid) return;

    if (action === "play") {
      vid.play();
      setPlaying(true);
    } else {
      vid.pause();
      setPlaying(false);
    }
  };

  const handleMuteToggle = () => {
    setMuted((prev) => {
      const newMuted = !prev;
      if (playbackVideoRef.current) {
        playbackVideoRef.current.muted = newMuted;
      }
      return newMuted;
    });
  };

  const handleFullscreen = () => {
    const vid = playbackVideoRef.current;
    if (vid?.requestFullscreen) vid.requestFullscreen();
  };

  const handleTimeUpdate = (e) => {
    setProgress((e.target.currentTime / e.target.duration) * 100);
  };

  return (
    <div className="bg-white border border-gray-300 shadow rounded-lg m-10">
      <div className="max-w-8xl mx-auto flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="md:w-1/4 w-full md:border-r border-gray-300">
          <div className="p-6 space-y-4">
            <div className="space-y-3">
              {[
                "Step 1: Camera & Mic Check",
                "Step 2: Add Basic Info",
                "Step 3: Ready to Record?",
                "Step 4: Preview Your Video",
                "Step 5: Quick Final Checklist",
                "Step 6: Submit Your Video",
              ].map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentStep(idx)}
                  className={`w-full text-left px-4 py-2 rounded-md font-medium ${
                    idx === currentStep
                      ? "bg-indigo-100 text-indigo-900"
                      : "hover:bg-indigo-50 text-blue-900"
                  }`}
                >
                  {step}
                </button>
              ))}
            </div>

            {/* Tips */}
            <div className="mt-8 bg-[#E8FFDD] p-4 rounded-md">
              <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                💡 Quick Tips
              </h4>
              <ul className="list-disc pl-5 text-sm text-blue-900 space-y-3">
                <li>Keep it short: Aim for 60–120 seconds</li>
                <li>Use a stable camera: Avoid shaky or blurry footage</li>
                <li>Face the camera directly: Stay centered and well-lit</li>
                <li>Be authentic: Show personality, not a script</li>
                <li>Dress appropriately for your target audience</li>
                <li>Choose a quiet space and speak clearly</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {currentStep === 0 && (
            <CameraMicCheck setCurrentStep={setCurrentStep} />
          )}
          {currentStep === 1 && (
            <StepTwoForm
              setCurrentStep={setCurrentStep}
              formData={formData}
              setFormData={setFormData}
            />
          )}
          {currentStep === 2 && (
            <StepThreeRecording
              liveVideoRef={liveVideoRef}
              playbackVideoRef={playbackVideoRef}
              playbackUrl={recordedVideoUrl}
              handleTimeUpdate={handleTimeUpdate}
              handlePlayPause={handlePlayPause}
              handleStartRecording={handleStartRecording}
              handleStopRecording={handleStopRecording}
              handleMuteToggle={handleMuteToggle}
              handleFullscreen={handleFullscreen}
              recording={recording}
              timer={timer}
              progress={progress}
              stream={stream}
              muted={muted}
              playing={playing}
              setCurrentStep={setCurrentStep}
              setPlaybackUrl={setRecordedVideoUrl}
              setRecordedChunks={setRecordedChunks}
              onConfirm={() => setCurrentStep(3)}
            />
          )}
          {currentStep === 3 && (
            <StepFourPreview
              setCurrentStep={setCurrentStep}
              recordedVideoUrl={recordedVideoUrl}
              playbackVideoRef={playbackVideoRef}
              progress={progress}
              handleTimeUpdate={handleTimeUpdate}
              handlePlayPause={handlePlayPause}
              handleMuteToggle={handleMuteToggle}
              handleFullscreen={handleFullscreen}
              muted={muted}
            />
          )}
          {currentStep === 4 && (
            <StepFiveChecklist
              checklist={checklist}
              setChecklist={setChecklist}
              extras={extras}
              setExtras={setExtras}
              isChecklistValid={isChecklistValid}
              setCurrentStep={setCurrentStep}
            />
          )}
          {currentStep === 5 && (
            <StepSixPlaceholder
              formData={formData}
              checklist={checklist}
              playbackUrl={recordedVideoUrl}
              playbackVideoRef={playbackVideoRef}
              handleTimeUpdate={handleTimeUpdate}
              progress={progress}
              handlePlayPause={handlePlayPause}
              muted={muted}
              handleMuteToggle={handleMuteToggle}
              handleFullscreen={handleFullscreen}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoRecordingSteps;
