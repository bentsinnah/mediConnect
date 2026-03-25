"use client";
import { Mic } from "lucide-react";
import { useSpeechToText } from "@/hooks/useSpeechToText";

export default function VoiceButton() {
  const { isListening, toggleListening } = useSpeechToText((transcript: string) => {
    // Context-aware dictation: try to find the nearest search bar or text area
    const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = transcript;
      searchInput.focus();
      // Trigger search if on dashboard
      if (window.location.pathname.includes('dashboard')) {
        setTimeout(() => {
          window.location.href = `/patient/doctors?q=${encodeURIComponent(transcript)}`;
        }, 1000);
      }
    } else {
      alert(`Voice Received: "${transcript}"`);
    }
  });

  return (
    <button
      className={`voice-fab ${isListening ? "recording" : ""}`}
      onClick={toggleListening}
      title={isListening ? "Stop recording" : "Voice input"}
      aria-label="Voice input"
    >
      <Mic size={22} />
    </button>
  );
}
