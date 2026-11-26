"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { type Line, nowTime } from "./stream";

// Minimal Web Speech API typings (Chrome / Edge / Safari; not Firefox).
type SpeechResult = { isFinal: boolean; 0: { transcript: string } };
type SpeechEvent = { resultIndex: number; results: ArrayLike<SpeechResult> };
type Recognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: SpeechEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  start: () => void;
  stop: () => void;
};

function getRecognition(): Recognition | null {
  const w = window as unknown as Record<string, new () => Recognition>;
  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  return Ctor ? new Ctor() : null;
}

const noopSubscribe = () => () => {};
/** Silent haptic confirmation, so the counsellor doesn't need to look at the screen. */
const buzz = (pattern: number | number[]) => {
  try { navigator.vibrate?.(pattern); } catch {}
};

export type Speaker = Line["speaker"];

/** Recording + live transcription, owned by the page so it survives panels opening/closing. */
export function useRecorder() {
  const [transcript, setTranscript] = useState<Line[]>([]);
  const [recording, setRecording] = useState(false);
  const [speaker, setSpeaker] = useState<Speaker>("Student");
  const [lang, setLang] = useState("fi-FI");
  const [interim, setInterim] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);

  const recRef = useRef<Recognition | null>(null);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const activeRef = useRef(false);
  const speakerRef = useRef(speaker);
  useEffect(() => { speakerRef.current = speaker; }, [speaker]);

  const supported = useSyncExternalStore(
    noopSubscribe,
    () => "SpeechRecognition" in window || "webkitSpeechRecognition" in window,
    () => true,
  );

  async function start() {
    if (activeRef.current) return;
    activeRef.current = true;
    setRecording(true);
    setStartedAt(Date.now());
    buzz(60);

    // Audio stays only in this browser (downloadable if school policy allows).
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      mr.ondataavailable = (e) => chunks.push(e.data);
      mr.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        setAudioUrl(URL.createObjectURL(new Blob(chunks, { type: mr.mimeType })));
      };
      mr.start();
      mediaRef.current = mr;
    } catch {
      /* microphone denied – manual notes still work */
    }

    const rec = getRecognition();
    if (!rec) return;
    rec.lang = lang;
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (e) => {
      let live = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) {
          const text = r[0].transcript.trim();
          if (text) setTranscript((t) => [...t, { speaker: speakerRef.current, text, at: nowTime() }]);
        } else live += r[0].transcript;
      }
      setInterim(live);
    };
    // Browsers stop recognition after silence – restart while still recording.
    rec.onend = () => { if (activeRef.current) { try { rec.start(); } catch {} } };
    rec.onerror = (e) => { if (e.error === "not-allowed") activeRef.current = false; };
    rec.start();
    recRef.current = rec;
  }

  function stop() {
    if (!activeRef.current) return;
    activeRef.current = false;
    setRecording(false);
    setStartedAt(null);
    setInterim("");
    recRef.current?.stop();
    mediaRef.current?.stop();
    buzz([40, 60, 40]);
  }

  function addLine(text: string, who: Speaker = speaker) {
    if (text.trim()) setTranscript((t) => [...t, { speaker: who, text: text.trim(), at: nowTime() }]);
  }

  function clear() {
    setTranscript([]);
    setAudioUrl(null);
  }

  return {
    transcript, recording, speaker, setSpeaker, lang, setLang, interim, audioUrl,
    startedAt, supported, start, stop, addLine, clear,
  };
}

export type RecorderState = ReturnType<typeof useRecorder>;
