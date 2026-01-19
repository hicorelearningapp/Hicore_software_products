import React, { useState, useRef, useEffect } from "react";
import jobIcon from "../../../assets/InterviewPreparation/topic.png";
import typeIcon from "../../../assets/InterviewPreparation/mode.png";
import difficultyIcon from "../../../assets/InterviewPreparation/difficulty.png";
import timeIcon from "../../../assets/InterviewPreparation/time.png";
import emptyIcon from "../../../assets/InterviewPreparation/empty-quiz.png";
import micIcon from "../../../assets/InterviewPreparation/mic.png";
import recordIcon from "../../../assets/InterviewPreparation/record.png";
import stopIcon from "../../../assets/InterviewPreparation/stop.png";
import reRecordIcon from "../../../assets/InterviewPreparation/rerecord.png";
import { FiPlay, FiPause } from "react-icons/fi";
import AIFeedback from "./AIFeedback";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

// Default fallback questions (used if API fails or returns empty)
const defaultQuestions = [
  {
    id: 1,
    question: "Tell me about a time you solved a complex technical problem.",
  },
  {
    id: 2,
    question: "Describe a situation where you had to work under pressure.",
  },
  {
    id: 3,
    question: "How do you keep your technical skills up to date?",
  },
];

const MockInterview = () => {
  const [jobRole, setJobRole] = useState("");
  const [interviewType, setInterviewType] = useState("Technical Round");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [duration, setDuration] = useState("15 min");

  const [interviewStarted, setInterviewStarted] = useState(false);
  const [loadingInterview, setLoadingInterview] = useState(false);

  const [questions, setQuestions] = useState(defaultQuestions);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedQuestion, setSelectedQuestion] = useState(defaultQuestions[0]);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingCompleted, setRecordingCompleted] = useState(false);
  const [transcript, setTranscript] = useState(
    "The answer you speak while recording will be shown here..."
  );
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedbackData, setFeedbackData] = useState(null);

  const [remainingTime, setRemainingTime] = useState(0);
  const timerIntervalRef = useRef(null);

  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);

  // =========================
  // Countdown timer logic
  // =========================
  useEffect(() => {
    if (interviewStarted) {
      const minutes = parseInt(duration); // "15 min" → 15
      const totalSeconds = minutes * 60;
      setRemainingTime(totalSeconds);

      timerIntervalRef.current = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerIntervalRef.current);
  }, [interviewStarted, duration]);

  const formatTime = (seconds) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(seconds % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };

  // =========================
  // GET /ai/mock-interview
  // =========================
  const fetchMockInterviewQuestions = async () => {
    try {
      if (!jobRole.trim()) {
        alert("Please enter a Job Role before starting the interview.");
        return;
      }

      setLoadingInterview(true);

      const params = new URLSearchParams({
        interview_type: interviewType,
        difficulty,
        jobrole: jobRole,
      });

      const response = await fetch(
        `${API_BASE}/ai/mock-interview?${params.toString()}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate mock interview questions");
      }

      const data = await response.json();

      // Flexible handling depending on how backend sends questions
      let apiQuestions =
        data?.questions || data?.mockInterviewQuestions || data?.mockQuestions;

      if (!Array.isArray(apiQuestions) || apiQuestions.length === 0) {
        // if backend sends array of strings
        if (Array.isArray(data)) {
          apiQuestions = data.map((q, idx) => ({
            id: idx + 1,
            question: typeof q === "string" ? q : q?.question || "",
          }));
        }
      }

      if (!Array.isArray(apiQuestions) || apiQuestions.length === 0) {
        alert("No questions received from API. Using default questions.");
        setQuestions(defaultQuestions);
        setSelectedQuestion(defaultQuestions[0]);
        setQuestionIndex(0);
      } else {
        // Normalize to {id, question}
        const normalized = apiQuestions.map((q, idx) => ({
          id: q.id ?? idx + 1,
          question: typeof q === "string" ? q : q.question,
        }));
        setQuestions(normalized);
        setSelectedQuestion(normalized[0]);
        setQuestionIndex(0);
      }

      // Start the interview (timer effect will pick this up)
      setInterviewStarted(true);
      // Reset recording state
      setTranscript(
        "The answer you speak while recording will be shown here..."
      );
      setRecordingCompleted(false);
      setAudioUrl(null);
      setIsPlaying(false);
      setFeedbackData(null);
    } catch (error) {
      console.error("Mock Interview API Error:", error);
      alert("Failed to start mock interview. Please try again.");
    } finally {
      setLoadingInterview(false);
    }
  };

  // =========================
  // Recording logic
  // =========================
  const startRecording = async () => {
    setTranscript("Recording in progress...");
    setIsRecording(true);
    setRecordingCompleted(false);
    setAudioUrl(null);
    setFeedbackData(null);

    if (!SpeechRecognition) {
      alert("Speech Recognition API is not supported in this browser.");
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        let finalTranscript = "";
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const part = event.results[i][0].transcript;
          if (event.results[i].isFinal) finalTranscript += part;
          else interimTranscript += part;
        }
        setTranscript(finalTranscript + interimTranscript);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
      };

      recognition.onend = () => setIsRecording(false);

      recognition.start();
      recognitionRef.current = recognition;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => setIsPlaying(false);
        setRecordingCompleted(true);
      };

      mediaRecorder.start();
    } catch (err) {
      console.error("Microphone access denied:", err);
      alert("Microphone permission is required to record.");
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const resetRecording = () => {
    stopRecording();
    setTranscript("Recording in progress...");
    setRecordingCompleted(false);
    setAudioUrl(null);
    setIsPlaying(false);
    setFeedbackData(null);
    startRecording();
  };

  const toggleAudioPlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }

    audio.onended = () => setIsPlaying(false);
  };

  // =========================
  // POST /mock-interview/evaluate
  // =========================
  const handleFeedbackClick = async () => {
  try {
    if (
      !transcript ||
      transcript === "The answer you speak while recording will be shown here..." ||
      transcript === "Recording in progress..."
    ) {
      alert("Please record your answer before requesting feedback.");
      return;
    }

    const payload = {
      transcript: transcript,
      context: selectedQuestion?.question || "",
      audioConfidence: 0.95,
      interview_type: interviewType
        .toLowerCase()
        .includes("technical")
        ? "technical"
        : interviewType.toLowerCase(),
      difficulty: difficulty.toLowerCase(),
      jobrole: jobRole,
    };

    console.log("Sending Payload:", payload);

    const response = await fetch(
      `${API_BASE}/ai/mock-interview/evaluate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend Error:", errorText);
      throw new Error("Evaluation failed");
    }

    const data = await response.json();
    console.log("API Response:", data);

    const evaluation = data?.mockInterviewEvaluation;

    if (!evaluation) {
      alert("Invalid AI evaluation response.");
      return;
    }

    // ✅ ✅ MAP **NEW BACKEND FORMAT → AIFeedback FORMAT**
    const formattedFeedback = {
      overall: evaluation.summary || "",
      scores: evaluation.scores || {},
      highlights: evaluation.highlights || [],
      suggestions: evaluation.suggestions || [],
    };

    setFeedbackData(formattedFeedback);

  } catch (error) {
    console.error("AI Evaluation Error:", error);
    alert("AI evaluation failed. Please try again.");
  }
};


  // =========================
  // Question navigation
  // =========================
  const goToQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      stopRecording();
      setQuestionIndex(index);
      setSelectedQuestion(questions[index]);
      setTranscript(
        "The answer you speak while recording will be shown here..."
      );
      setRecordingCompleted(false);
      setAudioUrl(null);
      setIsPlaying(false);
      setFeedbackData(null);
    }
  };

  const handleNextQuestion = () => {
    goToQuestion(questionIndex + 1);
  };

  const handlePreviousQuestion = () => {
    goToQuestion(questionIndex - 1);
  };

  // =========================
  // JSX
  // =========================
  return (
    <div className="bg-white rounded-xl border border-[#E0E0E0] shadow flex overflow-hidden h-[700px] w-full">
      {/* Left Sidebar */}
      <div className="w-[300px] border-r border-[#E0E0E0] p-6 space-y-8 text-[#343079] overflow-y-auto">
        <div>
          <label className="flex items-center gap-2 font-semibold text-[#343079] mb-2">
            <img src={jobIcon} alt="job role" className="w-5 h-5" />
            Enter Job Role
          </label>
          <input
            type="text"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            placeholder="e.g. Frontend Developer"
            className="w-50 border border-[#CBCDCF] text-sm rounded px-3 py-2 ml-[26px] focus:outline-none focus:ring-0 focus:border-[#343079]"
          />
        </div>
        <div>
          <label className="flex items-center gap-2 font-semibold text-[#343079] mb-2">
            <img src={typeIcon} alt="interview type" className="w-5 h-5" />
            Choose Your Interview Type
          </label>
          <div className="space-y-2 pl-[26px] text-sm">
            {["Technical Round", "Behavioral Interview", "Situational Interview"].map(
              (type) => (
                <label key={type} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="interviewType"
                    value={type}
                    checked={interviewType === type}
                    onChange={() => setInterviewType(type)}
                    className="accent-[#343079]"
                  />
                  {type}
                </label>
              )
            )}
          </div>
        </div>
        <div>
          <label className="flex items-center gap-2 font-semibold text-[#343079] mb-2">
            <img src={difficultyIcon} alt="difficulty" className="w-5 h-5" />
            Choose Difficulty Level
          </label>
          <div className="space-y-2 pl-[26px] text-sm">
            {["Beginner", "Intermediate", "Advanced"].map((level) => (
              <label key={level} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="difficulty"
                  value={level}
                  checked={difficulty === level}
                  onChange={() => setDifficulty(level)}
                  className="accent-[#343079]"
                />
                {level}
              </label>
            ))}
          </div>
        </div>
        {/* If you want duration back, uncomment this block */}
        {/*
        <div>
          <label className="flex items-center gap-2 font-semibold text-[#343079] mb-2">
            <img src={timeIcon} alt="duration" className="w-5 h-5" />
            Choose Duration
          </label>
          <div className="space-y-2 pl-[26px] text-sm">
            {["10 min", "15 min", "30 min", "60 min"].map((d) => (
              <label key={d} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="duration"
                  value={d}
                  checked={duration === d}
                  onChange={() => setDuration(d)}
                  className="accent-[#343079]"
                />
                {d}
              </label>
            ))}
          </div>
        </div>
        */}
      </div>

      {/* Right Panel */}
      <div className="flex-1 px-10 py-6 text-[#343079] overflow-y-auto">
        {interviewStarted ? (
          <>
            <h2 className="text-xl font-bold text-center mb-2">
              Hi Username, welcome to the live mock interview!!
            </h2>
            <p className="text-sm text-center mb-6">
              Speak your answer with clarity. You’ll get feedback later.
            </p>

            <div className="bg-[#E8F5FF] rounded-md p-4 flex justify-between items-center text-sm font-medium mb-6">
              <span>
                Domain:{" "}
                <span className="font-bold">Full Stack Development</span>
              </span>
              <span>
                Schedule:{" "}
                <span className="font-bold">Now (AutoBot Ready)</span>
              </span>
              <span>
                Time Left:{" "}
                <span className="font-bold">{formatTime(remainingTime)}</span>
              </span>
            </div>

            <div className="mb-4 text-left text-black">
              <span className="font-semibold">Question:</span>{" "}
              {selectedQuestion?.question || "Loading question..."}
            </div>

            <div className="border rounded-md border-[#D1D5DB] h-56 flex items-center justify-center mb-6">
              {isRecording ? (
                <div className="waveform flex gap-1">
                  <div className="wave-bar w-1 h-6 bg-[#343079] animate-pulse" />
                  <div className="wave-bar w-1 h-10 bg-[#343079] animate-pulse" />
                  <div className="wave-bar w-1 h-8 bg-[#343079] animate-pulse" />
                </div>
              ) : (
                <img src={micIcon} alt="mic" className="w-10 h-10 opacity-50" />
              )}
            </div>

            <div className="text-sm text-black bg-gray-100 rounded-md p-4 mb-6 max-h-40 overflow-y-auto border border-gray-300">
              {transcript}
            </div>

            <div className="flex items-center justify-center gap-4 mb-6">
              {!isRecording && !recordingCompleted && (
                <button
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-md font-medium"
                  onClick={startRecording}
                >
                  <img src={recordIcon} alt="Record" className="w-4 h-4" />
                  Record Answer
                </button>
              )}
              {isRecording && (
                <button
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-md font-medium"
                  onClick={stopRecording}
                >
                  <img src={stopIcon} alt="Stop" className="w-4 h-4" />
                  Stop
                </button>
              )}
              {recordingCompleted && (
                <>
                  <button
                    className="flex items-center gap-2 bg-[#343079] hover:bg-[#29245c] text-white text-sm px-4 py-2 rounded-md font-medium"
                    onClick={resetRecording}
                  >
                    <img
                      src={reRecordIcon}
                      alt="Re-record"
                      className="w-4 h-4"
                    />
                    Re-record
                  </button>
                  <button
                    className="flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white text-sm px-4 py-2 rounded-md font-medium"
                    onClick={toggleAudioPlayback}
                  >
                    {isPlaying ? <FiPause /> : <FiPlay />}
                    {isPlaying ? "Pause" : "Play"}
                  </button>
                  <button
                    className="flex items-center gap-2 bg-green-700 hover:bg-yellow-600 text-white text-sm px-4 py-2 rounded-md font-medium"
                    onClick={handleFeedbackClick}
                  >
                    AI Feedback
                  </button>
                </>
              )}
            </div>

            {feedbackData && <AIFeedback feedback={feedbackData} />}

            <div className="flex justify-between items-center mt-6">
              <button
                className="bg-gray-200 hover:bg-gray-300 text-sm px-4 py-2 rounded disabled:opacity-50"
                onClick={handlePreviousQuestion}
                disabled={questionIndex === 0}
              >
                Previous
              </button>
              <button
                className="bg-gray-200 hover:bg-gray-300 text-sm px-4 py-2 rounded disabled:opacity-50"
                onClick={handleNextQuestion}
                disabled={questionIndex === questions.length - 1}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center px-8 h-full">
            <img
              src={emptyIcon}
              alt="empty"
              className="w-[70px] h-[70px] opacity-50 mb-4"
            />
            <h2 className="text-lg font-semibold text-[#AEADBE] mb-2">
              No Autobot Interviews Scheduled
            </h2>
            <p className="text-sm text-[#A0A0C0] max-w-md mb-6">
              You haven’t taken any mock interviews yet. Practice with AutoBot
              by selecting the required options.
            </p>
            <button
              className="bg-[#343079] hover:bg-[#29245c] text-white text-sm px-6 py-2 rounded-md font-medium min-w-[200px] disabled:opacity-50"
              onClick={fetchMockInterviewQuestions}
              disabled={loadingInterview}
            >
              {loadingInterview ? "Generating..." : "Start Autobot Interview"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MockInterview;
