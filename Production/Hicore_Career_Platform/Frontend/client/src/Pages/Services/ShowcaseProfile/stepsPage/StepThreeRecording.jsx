import React, { useEffect } from "react";

const StepThreeRecording = ({
  liveVideoRef,
  playbackVideoRef,
  playbackUrl,
  handleTimeUpdate,
  handlePlayPause,
  handleStartRecording,
  handleStopRecording,
  handleMuteToggle,
  handleFullscreen,
  recording,
  timer,
  progress,
  stream,
  muted,
  playing,
  setCurrentStep,
  setPlaybackUrl,
  setRecordedChunks,
  onConfirm,
}) => {
  // Attach live stream to video element (only if not playing back)
  useEffect(() => {
    if (liveVideoRef.current && stream && !playbackUrl) {
      try {
        liveVideoRef.current.srcObject = stream;
        liveVideoRef.current.play().catch(() => {});
      } catch (err) {
        console.warn("Could not play live stream", err);
      }
    }
  }, [stream, playbackUrl]);

  // Play or pause playback
  useEffect(() => {
    if (playbackUrl && playbackVideoRef.current) {
      if (playing) {
        playbackVideoRef.current.play().catch(() => {});
      } else {
        playbackVideoRef.current.pause();
      }
    }
  }, [playbackUrl, playing]);

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6 m-6">
      <h3 className="font-bold text-lg text-indigo-900 mb-6">
        Step 3: Record Your Response
      </h3>
      <p className="text-gray-700 mb-4">
        When ready, hit record. You’ll have up to 2 minutes.
      </p>

      {/* Video Container */}
      <div className="relative bg-gray-100 rounded-t-lg w-full aspect-video border border-indigo-200 shadow-sm overflow-hidden">
        {!playbackUrl ? (
          <video
            ref={liveVideoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
          />
        ) : (
          <video
            ref={playbackVideoRef}
            className="w-full h-full object-cover"
            src={playbackUrl}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => handlePlayPause("pause")}
            muted={muted}
            playsInline
            controls={false}
          />
        )}

        {/* Play overlay */}
        {playbackUrl && !playing && !recording && (
          <button
            onClick={() => handlePlayPause("play")}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white text-6xl"
          >
            ▶️
          </button>
        )}

        {/* Progress bar */}
        {playbackUrl && (
          <div className="absolute bottom-0 left-0 h-1 bg-gray-300 w-full">
            <div
              className="h-1 bg-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Recording status */}
        {recording && (
          <div className="absolute top-2 right-2 text-sm text-red-600 font-semibold bg-white bg-opacity-80 px-2 py-1 rounded animate-pulse">
            🔴 Recording… {timer}s
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between border border-indigo-200 rounded-b-lg px-4 py-2 bg-white">
        <div className="flex items-center gap-3">
          <button
            onClick={() => handlePlayPause("play")}
            disabled={!playbackUrl || playing}
            className={`px-2 py-1 rounded text-xl ${
              !playbackUrl || playing
                ? "bg-gray-200 text-indigo-900 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            ▶
          </button>
          <button
            onClick={() => handlePlayPause("pause")}
            disabled={!playbackUrl || !playing}
            className={`px-2 py-1 rounded text-xl ${
              !playbackUrl || !playing
                ? "bg-gray-200 text-indigo-900 cursor-not-allowed"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            ⏸
          </button>
          {!recording ? (
            <button
              onClick={handleStartRecording}
              disabled={!stream}
              className={`px-2 py-1 rounded text-xl text-red-600 ${
                !stream
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            >
              ⏺
            </button>
          ) : (
            <button
              onClick={handleStopRecording}
              className="bg-gray-300 px-3 py-1 rounded text-xl text-gray-700 hover:bg-gray-400"
            >
              ⏹
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 text-xl">
          <button onClick={handleMuteToggle} className="hover:opacity-80">
            {muted ? "🔇" : "🔊"}
          </button>
          <button onClick={handleFullscreen} className="hover:opacity-80">
            ⛶
          </button>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-center gap-4 mt-10">
        <button
          className="border border-gray-400 text-gray-900 rounded-md px-6 py-2 hover:bg-gray-100  transition-colors duration-200"
          onClick={() => {
            setPlaybackUrl(null);
            setRecordedChunks([]);
          }}
        >
          Re-Take
        </button>

        <button
          className="bg-indigo-900 text-white px-6 py-2 rounded-md font-semibold hover:bg-indigo-800"
          onClick={() => {
            onConfirm(playbackUrl);
            setCurrentStep(3);
          }}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default StepThreeRecording;
