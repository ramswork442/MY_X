import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Mic, Loader } from "lucide-react";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import ChatWindow from "./ChatWindow";
import LanguageSelector from "./LanguageSelector";

const SpeechComponent = () => {
  const [transcript, setTranscript] = useState("सही सीक्रेट कोड बोलिये");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModelActive, setIsModelActive] = useState(false);
  const [voices, setVoices] = useState([]);
  const [messageArray, setMessageArray] = useState([]);
  const [openChat, setOpenChat] = useState(true);
  const [language, setLanguage] = useState("Hindi");
  const languageMap = {
    English: {
      speechLang: "en-IN",
      voiceMatch: "Heera", // optional voice name part
      promptPrefix:
        "Reply as an Indian girl in English Only with proper readable format, around 40-50 words",
      activationSuccess: "Model activated! Welcome love! Ask me anything?",
      activationFail:"Please say code to activate. That's really bad, you don't know my name",
      preText: "Hello my ex",
      beforeSecretTranscript: "Say correct secret code",
      afterSecretTranscript: "Now, ask me anything...",
    },
    Hindi: {
      speechLang: "hi-IN",
      voiceMatch: "हिन्दी",
      promptPrefix: "एक भारतीय लड़की की तरह केवल हिंदी में जवाब दो, स्पष्ट और पढ़ने योग्य तरीके से, लगभग 40–50 शब्दों में।",
      activationSuccess: "मॉडल शुरू हो गया है! कुछ भी पूछो, जानू",
      activationFail: "कृपया कोड बोलो। तुम मेरा नाम भी नहीं जानते",
      preText: "हेलो माय एक्स",
      beforeSecretTranscript: "सही सीक्रेट कोड बोलिये ",
      afterSecretTranscript: "अब आप पूछ सकते हो...",
    },
  };

  const {
    speechLang,
    voiceMatch,
    promptPrefix,
    activationSuccess,
    activationFail,
    preText,
  } = languageMap[language];

  const videoRef = useRef(null);
  const presetText = preText;

  const speakResponse = (text) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = speechLang;
    console.log(voices);
    const voice = voices.find((v) => v.name.includes(voiceMatch)) || voices[0];
    utter.voice = voice;
    utter.rate = 1.0;

    utter.onend = () => videoRef.current?.pause();
    window.speechSynthesis.speak(utter);
    videoRef.current?.play().catch(console.error);
  };

  const handleLLM = async (prompt) => {
    setLoading(true);
    setResponse("");
    try {
      const finalPrompt = `${prompt} — ${promptPrefix}`;
      const { data } = await axios.post("http://localhost:5000/api/generate", {
        prompt: finalPrompt,
      });
      const answer = data.text || "No response";
      setMessageArray((prev) => [...prev, { question: prompt, answer }]);
      setResponse(answer);
      speakResponse(answer);
    } catch {
      const apiError =
        error.response?.data?.error?.message || "API Error occurred.";
      console.error("Frontend error:", apiError);
      setResponse(apiError);
      speakResponse("Sorry, model is not available right now.");
    } finally {
      setLoading(false);
    }
  };

  const onSpeechResult = (speech) => {
    setTranscript(speech);
    if (!isModelActive) {
      console.log(speech.toLowerCase().trim());
      console.log(presetText);
      console.log(speech.toLowerCase().includes(presetText.toLowerCase()));

      if (speech.toLowerCase().includes(presetText.toLowerCase())) {
        setIsModelActive(true);
        setResponse(activationSuccess);
        speakResponse(activationSuccess);
        setTranscript(afterSecretTranscript);
      } else {
        setResponse(activationFail);
        speakResponse(activationFail);
        setTranscript(beforeSecretTranscript);
      }
    } else {
      handleLLM(speech);
    }
  };

  const { start, isListening } = useSpeechRecognition({
    onResult: onSpeechResult,
    language: speechLang,
  });

  useEffect(() => {
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    console.log(voices);
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => (window.speechSynthesis.onvoiceschanged = null);
  }, []);

  return (
    <div className="min-h-screen w-full bg-black flex flex-col justify-center items-center p-4 relative">
      <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 max-w-lg w-full space-y-4 text-white">
        <LanguageSelector
          selectedLang={language}
          onChange={setLanguage}
          setTranscript={setTranscript}
        />

        <div className="relative w-full h-1/3">
          {/* Glowing animation background */}
          {isModelActive && (
            <div className="absolute inset-0 z-0 animate-pulse bg-blue-600 blur-xl rounded-lg shadow-xl transition-all duration-500" />
          )}

          {/* The actual video */}
          <video
            ref={videoRef}
            src="/talker02.mp4"
            className="relative z-10 w-full h-full rounded-md border border-white/20 object-cover"
            muted
            loop
            playsInline
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={start}
            disabled={isListening || loading}
            className={`py-2 px-3 rounded-md text-white ${
              isListening || loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-br from-white/10 to-blue-600 hover:opacity-80"
            }`}
          >
            {loading ? (
              <Loader className="animate-spin" color="black" size={20} />
            ) : (
              <Mic size={24} />
            )}
          </button>

          <h1 className="font-light text-2xl">{transcript}</h1>
        </div>
      </div>

      {/* Floating Chat Button */}
      <button
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg transition-transform duration-300 z-50
          bg-gradient-to-br from-white/10 to-blue-600 text-white hover:opacity-80
          ${openChat ? "rotate-180 -translate-y-1" : ""}`}
        aria-label="Chat"
        onClick={() => setOpenChat((prev) => !prev)}
      >
        💬
      </button>

      {/* Chat Window */}
      {openChat && <ChatWindow messages={messageArray} />}
    </div>
  );
};

export default SpeechComponent;
