import React, { useState, useRef, useEffect } from "react";
import TickIcon from "../../../../assets/Showcase/tick.png"; // ✅ adjust path if needed

const CameraMicCheck = ({ setCurrentStep }) => {
  const liveVideoRef = useRef(null);
  const playbackVideoRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recording, setRecording] = useState(false);
  const [playbackUrl, setPlaybackUrl] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timer, setTimer] = useState(0);
  const timerInterval = useRef(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const initStream = async () => {
      try {
        const userStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(userStream);
        if (liveVideoRef.current) {
          liveVideoRef.current.srcObject = userStream;
        }
      } catch (err) {
        console.error("Error accessing camera/mic:", err);
      }
    };
    initStream();

    return () => {
      if (timerInterval.current) clearInterval(timerInterval.current);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (playbackVideoRef.current) {
      playbackVideoRef.current.muted = muted;
    }
  }, [muted, playbackUrl]);

  const handleStartRecording = () => {
    if (!stream) return;

    const chunks = [];
    const recorder = new MediaRecorder(stream, {
      mimeType: "video/webm; codecs=vp8,opus",
    });

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setPlaybackUrl(url);
      clearInterval(timerInterval.current);
      setTimer(0);
      if (liveVideoRef.current) {
        liveVideoRef.current.srcObject = null;
      }
      setTimeout(() => {
        if (playbackVideoRef.current) {
          playbackVideoRef.current.load();
        }
      }, 50);
    };

    recorder.start();
    setMediaRecorder(recorder);
    setRecording(true);
    setPlaybackUrl(null);
    setTimer(0);
    timerInterval.current = setInterval(() => setTimer((t) => t + 1), 1000);
  };

  const handleStopRecording = () => {
    if (mediaRecorder && recording) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const handlePlayPause = (action) => {
    const video = playbackVideoRef.current;
    if (!video || !playbackUrl) return;

    if (action === "play") {
      video.currentTime = 0;
      video.muted = muted;
      video
        .play()
        .then(() => setPlaying(true))
        .catch((err) => {
          console.error("Playback error:", err);
          setPlaying(false);
        });
    } else if (action === "pause") {
      video.pause();
      setPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (!playbackVideoRef.current) return;
    const { currentTime, duration } = playbackVideoRef.current;
    if (duration > 0) {
      setProgress((currentTime / duration) * 100);
    }
  };

  const handleMuteToggle = () => setMuted((prev) => !prev);

  const handleFullscreen = () => {
    const video = playbackVideoRef.current || liveVideoRef.current;
    if (!video) return;
    if (video.requestFullscreen) video.requestFullscreen();
    else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
    else if (video.mozRequestFullScreen) video.mozRequestFullScreen();
    else if (video.msRequestFullscreen) video.msRequestFullscreen();
  };

  const handleRefresh = () => {
    setPlaybackUrl(null);
    setPlaying(false);
    setProgress(0);
    setRecording(false);
    setTimer(0);
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((userStream) => {
        setStream(userStream);
        if (liveVideoRef.current) {
          liveVideoRef.current.srcObject = userStream;
        }
      });
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6 m-6">
      <h3 className="font-bold text-lg text-indigo-900 mb-6">
        Step 1: Camera & Mic Check
      </h3>

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
            onEnded={() => setPlaying(false)}
            muted={muted}
            playsInline
            controls={false}
          />
        )}

        {/* Play Overlay */}
        {playbackUrl && !playing && !recording && (
          <button
            onClick={() => handlePlayPause("play")}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white text-6xl"
          >
            ▶
          </button>
        )}

        {/* Progress Bar */}
        {playbackUrl && (
          <div className="absolute bottom-0 left-0 h-1 bg-gray-300 w-full">
            <div
              className="h-1 bg-blue-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between border border-indigo-200 rounded-b-lg px-4 py-2 bg-white">
        <div className="flex items-center gap-3">
          <button
            onClick={() => handlePlayPause("play")}
            disabled={!playbackUrl || playing}
            className={`px-2 py-1 rounded ${
              !playbackUrl || playing
                ? "bg-gray-200 text-indigo-900"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            ▶
          </button>
          <button
            onClick={() => handlePlayPause("pause")}
            disabled={!playbackUrl || !playing}
            className={`px-2 py-1 rounded ${
              !playbackUrl || !playing
                ? "bg-gray-200 text-indigo-900"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            ⏸
          </button>

          {!recording ? (
            <button
              onClick={handleStartRecording}
              disabled={!stream}
              className="bg-gray-200 px-2 rounded text-red-600 text-xl"
            >
              ⏺
            </button>
          ) : (
            <button
              onClick={handleStopRecording}
              className="text-gray-600 text-xl"
            >
              ⏹
            </button>
          )}

          {recording && (
            <span className="text-red-600 font-semibold ml-2 animate-pulse">
              🔴 Recording… {timer}s
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleMuteToggle}>{muted ? "🔇" : "🔊"}</button>
          <button onClick={handleFullscreen}>⛶</button>
        </div>
      </div>

      {/* Status & Refresh */}
      <div className="flex items-center gap-4 text-sm my-6">
        <span className="flex items-center text-indigo-900 font-medium">
          <img src={TickIcon} alt="tick" className="w-4 h-4 mr-1" />
          Live Camera Preview
        </span>
        <span className="flex items-center text-indigo-900 font-medium">
          <img src={TickIcon} alt="tick" className="w-4 h-4 mr-1" />
          Mic Input Indicator
        </span>
        <button
          className="ml-auto border border-gray-400 text-gray-700 rounded-md px-4 py-1 hover:bg-gray-50"
          onClick={handleRefresh}
        >
          Refresh
        </button>
      </div>

      {/* Next Step */}
      <div className="flex justify-center">
        <button
          className="bg-indigo-900 text-white rounded-md py-2 px-8 font-semibold hover:bg-indigo-800"
          onClick={() => setCurrentStep(1)}
        >
          All Set!
        </button>
      </div>
    </div>
  );
};

export default CameraMicCheck;
