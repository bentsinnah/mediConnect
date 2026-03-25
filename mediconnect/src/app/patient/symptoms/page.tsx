"use client";
import Link from "next/link";
import { ArrowLeft, Send, Mic, Sparkles, Loader2, User, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { fetchApi } from "@/lib/api";
import styles from "./symptoms.module.css";

const commonSymptoms = ["Headache", "Fever", "Stomach Pain", "Chest Pain", "Cough", "Dizziness"];

export default function CheckSymptomsPage() {
  const [text, setText] = useState("");
  const { isListening, toggleListening } = useSpeechToText((transcript) => {
    setText(prev => prev ? `${prev} ${transcript}` : transcript);
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{ diagnosis: string; doctor: any } | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text) return;
    
    setAnalyzing(true);
    setResult(null);

    try {
      const res = await fetchApi('/symptoms/analyze', {
        method: 'POST',
        body: JSON.stringify({ text })
      });
      
      setResult({
        diagnosis: res.diagnosis,
        doctor: res.doctor || { name: "No match found", specialty: "General Practitioner", id: null }
      });
    } catch (err: any) {
      alert("Analysis failed: " + err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <>
      <header className={styles.header}>
        <Link href="/patient/dashboard" className={styles.backBtn}>
          <ArrowLeft size={20} />
        </Link>
        <h1 className={styles.title}>Check Symptoms</h1>
      </header>

      <div className={styles.introCard}>
        <h2 className={styles.introTitle}>AI Symptom Checker</h2>
        <p className={styles.introText}>
          Tell us your symptoms using voice or text. Our AI will suggest a possible diagnosis and a matching doctor.
        </p>
      </div>

      <div className={styles.inputCard}>
        <textarea
          className={styles.textArea}
          placeholder="E.g I have a headache and Fever..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
        />
        <div className={styles.actionsBox}>
          <button 
            type="button" 
            className={`${styles.actionBtn} ${styles.blueLight} ${isListening ? styles.recording : ''}`}
            onClick={toggleListening}
          >
            <Mic size={20} color="var(--blue-primary)" />
          </button>
          <button 
            type="button" 
            className={`${styles.actionBtn} ${styles.blue}`}
            onClick={handleSend}
          >
            <Send size={20} color="white" />
          </button>
        </div>
      </div>

      <div className={styles.chipsWrap}>
        {commonSymptoms.map(symp => (
          <button 
            key={symp} 
            className="chip"
            onClick={() => setText(prev => prev ? `${prev}, ${symp}` : symp)}
            style={{ background: 'var(--border-color)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            {symp}
          </button>
        ))}
      </div>

      {analyzing && (
        <div className={styles.analysisBox}>
          <Loader2 className={styles.spinner} size={32} />
          <p>AI is analyzing your symptoms...</p>
        </div>
      )}

      {result && (
        <div className={`${styles.resultCard} animate-in`}>
          <div className={styles.resultHeader}>
            <Sparkles size={20} color="var(--blue-primary)" />
            <h3>AI Prediction</h3>
          </div>
          <p className={styles.diagnosis}>{result.diagnosis}</p>
          <p className={styles.disclaimer} style={{ marginTop: 8 }}>*Powered by Gemini 1.5 Flash. Please see a doctor for medical advice.</p>
          
          <div className={styles.divider} />
          
          <div className={styles.drRecommendation}>
            <p className={styles.label}>Suggested Specialist</p>
            {result.doctor.id ? (
              <Link href={`/patient/doctors/${result.doctor.id}`} className={styles.drCard}>
                <div className={styles.drAvatar}><User size={20} /></div>
                <div className={styles.drInfo}>
                  <h4>{result.doctor.name}</h4>
                  <p>{result.doctor.specialty}</p>
                </div>
                <ChevronRight size={18} color="var(--text-muted)" />
              </Link>
            ) : (
              <div className={styles.drCard}>
                <div className={styles.drAvatar}><User size={20} /></div>
                <div className={styles.drInfo}>
                  <h4>{result.doctor.name || "No doctor matched"}</h4>
                  <p>{result.doctor.specialty}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
