import React, { useRef, useState } from "react";

const StepFourPreview = ({ recordedVideoUrl, setCurrentStep }) => {
  const playbackVideoRef = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [muted, setMuted] = useState(false);

  const handlePlayPause = (action) => {
    const video = playbackVideoRef.current;
    if (!video) return;

    if (action === "play") {
      video
        .play()
        .then(() => setPlaying(true))
        .catch((err) => console.error("Playback error:", err));
    } else if (action === "pause") {
      video.pause();
      setPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    const video = playbackVideoRef.current;
    if (!video) return;
    const { currentTime, duration } = video;
    if (duration > 0) {
      setProgress((currentTime / duration) * 100);
    }
  };

  const handleMuteToggle = () => {
    const video = playbackVideoRef.current;
    if (video) {
      video.muted = !muted;
    }
    setMuted((prev) => !prev);
  };

  const handleFullscreen = () => {
    const video = playbackVideoRef.current;
    if (!video) return;
    if (video.requestFullscreen) video.requestFullscreen();
    else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
    else if (video.mozRequestFullScreen) video.mozRequestFullScreen();
    else if (video.msRequestFullscreen) video.msRequestFullscreen();
  };

  return (
    <div className="space-y-6 bg-white border border-gray-300 rounded-lg p-6 m-6">
      <h3 className="font-bold text-md text-indigo-900">
        Step 4: Preview Your Video
      </h3>
      <p className="text-gray-700">
        Review your recorded video before submitting.
      </p>

      {/* Video + controls container (connected) */}
      <div className="w-full rounded-lg shadow-sm border border-indigo-200 overflow-hidden">
        {/* Video */}
        <div className="relative w-full aspect-video bg-gray-100">
          <video
            ref={playbackVideoRef}
            className="w-full h-full object-cover"
            src={recordedVideoUrl}
            onTimeUpdate={handleTimeUpdate}
            muted={muted}
            playsInline
          />

          {/* Progress Bar */}
          {recordedVideoUrl && (
            <div className="absolute bottom-0 left-0 h-2 bg-gray-300 w-full">
              <div
                className="h-2 bg-blue-500 transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        {/* Control bar - directly attached */}
        <div className="flex justify-between items-center px-4 py-2 bg-white">
          {/* Left controls */}
          <div className="flex items-center gap-3">
            {/* Play Button */}
            <button
              onClick={() => handlePlayPause("play")}
              disabled={playing}
              title="Play"
              className={`px-2 py-1 text-xl rounded ${
                playing
                  ? "bg-gray-200 text-indigo-900 opacity-50"
                  : "bg-indigo-500 text-white hover:bg-indigo-600"
              }`}
            >
              ▶
            </button>

            {/* Pause Button */}
            <button
              onClick={() => handlePlayPause("pause")}
              disabled={!playing}
              title="Pause"
              className={`px-2 py-1 text-xl rounded ${
                !playing
                  ? "bg-gray-300 text-indigo-900 opacity-50"
                  : "bg-indigo-500 text-white hover:bg-indigo-600"
              }`}
            >
              ⏸
            </button>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleMuteToggle}
              title="Mute/Unmute"
              className="text-indigo-900 text-xl hover:text-indigo-600"
            >
              {muted ? "🔇" : "🔊"}
            </button>
            <button
              onClick={handleFullscreen}
              title="Fullscreen"
              className="text-indigo-900 text-xl hover:text-indigo-600"
            >
              ⛶
            </button>
          </div>
        </div>
      </div>

      {/* Next step button */}
      <div className="flex justify-center mt-8">
        <button
          className="bg-indigo-900 text-white px-6 py-2 rounded-md font-semibold hover:bg-indigo-800"
          onClick={() => setCurrentStep(4)}
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
};

export default StepFourPreview;
