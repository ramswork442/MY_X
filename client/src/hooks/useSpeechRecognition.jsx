import { useEffect, useRef, useState } from "react";

export const useSpeechRecognition = ({ onResult, onEnd, language }) => {
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language;

    recognition.onresult = (e) => {
      const result = e.results[0][0].transcript;
      onResult(result);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => {
      setIsListening(false);
      onEnd && onEnd();
    };
  }, [onResult, onEnd, language]);

  const start = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  return { start, isListening };
};