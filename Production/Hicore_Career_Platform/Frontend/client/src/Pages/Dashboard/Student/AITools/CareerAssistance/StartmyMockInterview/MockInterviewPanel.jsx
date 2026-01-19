import React, { useState, useRef } from "react";
import AIFeedbackPanel from "./AIFeedbackPanel";
import {
  FiEye,
  FiMic,
  FiBookmark,
  FiRepeat,
  FiStopCircle,
  FiX,
  FiPlay,
  FiPause,
  FiMessageSquare,
} from "react-icons/fi";
import axios from "axios";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const MockInterviewPanel = ({
  jobRole,
  setJobRole,
  recordMode,
  setRecordMode,
  questions,
}) => {
  const [activeTab, setActiveTab] = useState("questions");
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [transcript, setTranscript] = useState(
    "The answer you speak while recording will be shown here..."
  );
  const [visibleAnswers, setVisibleAnswers] = useState({});
  const [recognitionInstance, setRecognitionInstance] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingCompleted, setRecordingCompleted] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);

  const toggleAnswer = (id) => {
    setVisibleAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const startRecording = async (question) => {
    setSelectedQuestion(question);
    setTranscript("Recording in progress...");
    setIsRecording(true);
    setRecordingCompleted(false);
    setFeedback(null);
    setShowFeedback(false);
    setIsPlaying(false);

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
          if (event.results[i].isFinal) {
            finalTranscript += part;
          } else {
            interimTranscript += part;
          }
        }
        setTranscript(finalTranscript + interimTranscript);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
      setRecognitionInstance(recognition);

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
    } catch (error) {
      console.error("Microphone access denied:", error);
      alert("Microphone permission is required to record.");
      setIsRecording(false);
      setRecordMode(false);
    }
  };

  const stopRecording = () => {
    if (recognitionInstance) recognitionInstance.stop();
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const resetRecording = () => {
    if (recognitionInstance) recognitionInstance.stop();
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();

    setTranscript("Recording in progress...");
    setRecordingCompleted(false);
    setAudioUrl(null);
    setIsPlaying(false);

    startRecording(selectedQuestion);
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


 const fetchFeedback = async () => {
   setLoadingFeedback(true);
   try {
     const response = await axios.post(
       "https://hicore.pythonanywhere.com/evaluate-answer",
       {
         transcript,
         topic: selectedQuestion?.question || "",
         context: jobRole,
         audioConfidence: 0.85,
       }
     );

     const formattedFeedback = {
       highlights: response.data.highlights || [],
       suggestions: response.data.suggestions || [],
       scores: response.data.scores || {}, // keep original score+feedback object
       overall: response.data.summary || "",
     };

     setFeedback(formattedFeedback);
     setShowFeedback(true);
   } catch (error) {
     console.error("Feedback fetch error:", error);
     alert("Failed to get feedback. Try again.");
   }
   setLoadingFeedback(false);
 };


  return (
    <div className="flex flex-col md:flex-row gap-6">
      {!recordMode && (
        <div className="bg-white rounded-xl border border-[#E2E1F3] p-4 sm:p-6 w-full md:w-[40%] shadow-sm">
          <h2 className="text-[#343079] text-lg font-semibold mb-8">
            What job role and experience are you preparing for?
          </h2>
          <textarea
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            rows={3}
            className="w-full border border-[#3D3584] md:h-40 rounded-md p-3 text-[#343079] text-base resize-none focus:outline-none focus:ring-2 focus:ring-[#3D3584]"
          />
        </div>
      )}

      <div className="bg-white border border-[#E2E1F3] rounded-xl shadow-sm w-full p-4 sm:p-6">
        {!recordMode ? (
          <>
            <h2 className="text-[#343079] text-xl font-semibold mb-4">
              Interview Readiness & Mock Interview
            </h2>
            <div className="flex flex-wrap gap-2 sm:gap-6 mb-10 border-b border-[#3D3584] pb-2">
              {["questions", "recordings", "saved"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-sm font-medium px-5 py-3 rounded-md ${
                    activeTab === tab
                      ? "bg-[#F5F3FF] border border-[#E2E1F3] text-[#3D3584]"
                      : "text-[#3D3584]"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="space-y-8">
              {activeTab === "questions" &&
                questions.map((q, index) => (
                  <div
                    key={q.id || index}
                    className="border border-[#E2E1F3] rounded-lg p-5 space-y-4 relative"
                  >
                    <p className="text-[#3D3584] text-sm font-medium">
                      {index + 1}. {q.question}
                    </p>

                    <div className="flex flex-wrap gap-2 sm:gap-4">
                      <button
                        onClick={() => {
                          setSelectedQuestion(q);
                          setRecordMode(true);
                          setTranscript(
                            "The answer you speak while recording will be shown here..."
                          );
                          setRecordingCompleted(false);
                          setAudioUrl(null);
                          setFeedback(null);
                          setShowFeedback(false);
                        }}
                        className="flex items-center gap-2 bg-green-600 text-white text-sm px-4 py-2 rounded-md"
                      >
                        <FiMic className="w-4 h-4" />
                        Record Answer
                      </button>

                      <button
                        onClick={() => toggleAnswer(q.id)}
                        className="flex items-center gap-2 bg-[#1D4ED8] text-white text-sm px-4 py-2 rounded-md"
                      >
                        {visibleAnswers[q.id] ? (
                          <FiMic className="w-4 h-4" />
                        ) : (
                          <FiEye className="w-4 h-4" />
                        )}
                        {visibleAnswers[q.id]
                          ? "Recording Mode"
                          : "View Model Answer"}
                      </button>
                    </div>

                    {visibleAnswers[q.id] ? (
                      <FiX
                        className="w-4 h-4 absolute top-4 right-4 text-[#343079] cursor-pointer"
                        onClick={() => toggleAnswer(q.id)}
                      />
                    ) : (
                      <FiBookmark className="w-4 h-4 absolute top-4 right-4 text-[#343079]" />
                    )}

                    {visibleAnswers[q.id] && (
                      <div className="border border-blue-300 rounded-md p-4 mt-4 text-[#343079] bg-white text-base">
                        {q.answer || "No model answer provided."}
                      </div>
                    )}
                  </div>
                ))}

              {activeTab === "recordings" && (
                <div className="h-32 sm:h-40 flex items-center justify-center text-[#343079] text-sm italic">
                  No recordings available.
                </div>
              )}

              {activeTab === "saved" && (
                <div className="h-32 sm:h-40 flex items-center justify-center text-[#343079] text-sm italic">
                  No saved questions yet.
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3 border border-[#E2E1F3] rounded-lg p-4">
              <p className="text-[#343079] font-bold mb-4">
                {selectedQuestion?.question}
              </p>
              <div className="border border-[#E2E1F3] p-4 rounded-lg min-h-[150px] text-[#A3A3C2]">
                {transcript}
              </div>
            </div>

            <div className="w-full border border-[#E2E1F3] rounded-lg p-4">
              <p className="text-[#343079] font-semibold text-center mb-2">
                Ready to Practice? Let’s Record Your Response.
              </p>

              <div className="h-[150px] flex items-center justify-center border border-[#E2E1F3] mb-4 rounded-md">
                {isRecording ? (
                  <div className="waveform">
                    <div className="wave-bar"></div>
                    <div className="wave-bar"></div>
                    <div className="wave-bar"></div>
                  </div>
                ) : (
                  <FiMic className="text-[#C0C0C0] w-8 h-8" />
                )}
              </div>

              <div className="flex flex-wrap gap-3 justify-center">
                {!isRecording && !recordingCompleted && (
                  <button
                    onClick={() => startRecording(selectedQuestion)}
                    className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
                  >
                    <FiMic />
                    Record Answer
                  </button>
                )}
                {isRecording && (
                  <button
                    onClick={stopRecording}
                    className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
                  >
                    <FiStopCircle />
                    Stop
                  </button>
                )}
                {recordingCompleted && (
                  <>
                    <button
                      onClick={toggleAudioPlayback}
                      className="bg-purple-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
                    >
                      {isPlaying ? <FiPause /> : <FiPlay />}
                      {isPlaying ? "Pause" : "Play"}
                    </button>

                    <button
                      onClick={resetRecording}
                      className="bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
                    >
                      <FiRepeat />
                      Re-record
                    </button>

                    <button
                      onClick={fetchFeedback}
                      className="bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
                    >
                      <FiMessageSquare />
                      AI Feedback
                    </button>
                  </>
                )}
              </div>

              {loadingFeedback ? (
                <p className="text-center text-sm text-gray-500 mt-4">
                  Analyzing your answer...
                </p>
              ) : (
                showFeedback &&
                feedback && (
                  <div className="mt-6 w-full">
                    <AIFeedbackPanel feedback={feedback} />
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MockInterviewPanel;
