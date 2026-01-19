import React, { useState, useRef, useEffect } from "react";
import jobIcon from "../../../../../assets/InterviewPreparation/topic.png";
import typeIcon from "../../../../../assets/InterviewPreparation/mode.png";
import difficultyIcon from "../../../../../assets/InterviewPreparation/difficulty.png";
import timeIcon from "../../../../../assets/InterviewPreparation/time.png";
import emptyIcon from "../../../../../assets/InterviewPreparation/empty-quiz.png";
import micIcon from "../../../../../assets/InterviewPreparation/mic.png";
import recordIcon from "../../../../../assets/InterviewPreparation/record.png";
import stopIcon from "../../../../../assets/InterviewPreparation/stop.png";
import reRecordIcon from "../../../../../assets/InterviewPreparation/rerecord.png";
import { FiPlay, FiPause } from "react-icons/fi";
import AIFeedback from "./AIFeedback";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const questions = [
  { id: 1, question: "Tell me about a time you solved a complex technical problem." },
  { id: 2, question: "Describe a situation where you had to work under pressure." },
  { id: 3, question: "How do you keep your technical skills up to date?" }
];

const MockInterviewDashboard = () => {
  // Filter States
  const [jobRole, setJobRole] = useState("");
  const [interviewType, setInterviewType] = useState("Technical Round");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [duration, setDuration] = useState("15 min");

  // Interview Session States
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedQuestion, setSelectedQuestion] = useState(questions[0]);

  // Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingCompleted, setRecordingCompleted] = useState(false);
  const [transcript, setTranscript] = useState("The answer you speak while recording will be shown here...");
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedbackData, setFeedbackData] = useState(null);

  // Timer
  const [remainingTime, setRemainingTime] = useState(0);
  const timerIntervalRef = useRef(null);

  // Media / Speech Recognition refs
  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);

  // Timer setup
  useEffect(() => {
    if (interviewStarted) {
      const minutes = parseInt(duration);
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

  // ===== Recording Logic =====
  const startRecording = async () => {
    setTranscript("Recording in progress...");
    setIsRecording(true);
    setRecordingCompleted(false);
    setAudioUrl(null);
    setFeedbackData(null);

    if (!SpeechRecognition) {
      alert("Speech Recognition API is not supported in this browser.");
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
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
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

  // ===== Feedback =====
  const handleFeedbackClick = () => {
    const mockFeedback = {
      overall: "Good effort! You communicated clearly but could expand more on the technical stack.",
      scores: {
        clarity: { score: 8, feedback: "Clear voice with good pronunciation." },
        fluency: { score: 7, feedback: "Some pauses, but mostly fluent." },
        technical_knowledge: { score: 6, feedback: "Could elaborate more on frameworks used." },
        confidence: { score: 7, feedback: "Moderately confident tone." },
      },
      highlights: [
        "Great explanation of project structure.",
        "Used industry-standard terminology effectively."
      ],
      suggestions: [
        "Include real metrics or results from past projects.",
        "Explain technical tools and how they contributed to success."
      ]
    };
    setFeedbackData(mockFeedback);
  };

  // ===== Question Navigation =====
  const goToQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      stopRecording();
      setQuestionIndex(index);
      setSelectedQuestion(questions[index]);
      setTranscript("The answer you speak while recording will be shown here...");
      setRecordingCompleted(false);
      setAudioUrl(null);
      setIsPlaying(false);
      setFeedbackData(null);
    }
  };

  const handleNextQuestion = () => goToQuestion(questionIndex + 1);
  const handlePreviousQuestion = () => goToQuestion(questionIndex - 1);

  return (
    <div className="bg-white rounded-xl m-4  border border-blue-900 min-h-screen shadow flex flex-col max-w-7xl">
      {/* === TOP FILTER BAR === */}
      {!interviewStarted && (
        <div className="flex flex-wrap items-center gap-6 p-4 m-4">
          {/* Job Role */}
          <div className="flex items-center text-blue-900 font-semibold gap-2">
            Job Role:
            <input
              type="text"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              placeholder="Enter Job Role"
              className="border border-[#CBCDCF] text-sm rounded px-3 py-2 focus:outline-none focus:ring-0 focus:border-[#343079]"
            />
          </div>

          {/* Interview Type */}
          <div className="flex items-center gap-2">
            <img src={typeIcon} alt="type" className="w-5 h-5" />
            <select
              value={interviewType}
              onChange={(e) => setInterviewType(e.target.value)}
              className="border border-[#CBCDCF] rounded px-3 py-1 text-sm focus:outline-none focus:border-[#343079]"
            >
              {["Technical Round", "Behavioral Interview", "Situational Interview"].map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div className="flex items-center gap-2">
            <img src={difficultyIcon} alt="difficulty" className="w-5 h-5" />
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="border border-[#CBCDCF] rounded px-3 py-1 text-sm focus:outline-none focus:border-[#343079]"
            >
              {["Beginner", "Intermediate", "Advanced"].map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-2">
            <img src={timeIcon} alt="duration" className="w-5 h-5" />
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="border border-[#CBCDCF] rounded px-3 py-1 text-sm focus:outline-none focus:border-[#343079]"
            >
              {["10 min", "15 min", "30 min", "60 min"].map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Start Button */}
          <button
            className="bg-[#343079] hover:bg-[#29245c] text-white text-sm px-6 py-1.5 rounded font-medium ml-auto"
            onClick={() => setInterviewStarted(true)}
          >
            Start Autobot Interview
          </button>
        </div>
      )}

      {/* === INTERVIEW BODY === */}
      <div className="flex-1 px-10 py-6 border m-8  rounded-lg  text-[#343079] overflow-y-auto">
        {interviewStarted ? (
          <>
            <h2 className="text-xl font-bold text-center mb-2">
              Hi Username, welcome to the live mock interview!!
            </h2>
            <p className="text-sm text-center mb-6">
              Speak your answer with clarity. You’ll get feedback later.
            </p>

            <div className="bg-[#E8F5FF] rounded-md p-4 flex justify-between items-center text-sm font-medium mb-6">
              <span>Domain: <span className="font-bold">{jobRole || "Full Stack Development"}</span></span>
              <span>Schedule: <span className="font-bold">Now (AutoBot Ready)</span></span>
              <span>Time Left: <span className="font-bold">{formatTime(remainingTime)}</span></span>
            </div>

            <div className="mb-4 text-left text-black">
              <span className="font-semibold">Question:</span> {selectedQuestion?.question}
            </div>

            <div className="border rounded-md border-[#D1D5DB] h-56 flex items-center justify-center mb-6">
              {isRecording ? (
                <div className="waveform">
                  <div className="wave-bar"></div>
                  <div className="wave-bar"></div>
                  <div className="wave-bar"></div>
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
                    <img src={reRecordIcon} alt="Re-record" className="w-4 h-4" />
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
                    className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white text-sm px-4 py-2 rounded-md font-medium"
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
          <div className="flex flex-col items-center justify-center  text-center px-8 min-h-screen">
            <img src={emptyIcon} alt="empty" className="w-[70px] h-[70px] opacity-50 mb-4" />
            <h2 className="text-lg font-semibold text-[#AEADBE] mb-2">No Autobot Interviews Scheduled</h2>
            <p className="text-sm text-[#A0A0C0] max-w-md mb-6">
              You haven’t taken any mock interviews yet. Practice with AutoBot by selecting the required options.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MockInterviewDashboard;
