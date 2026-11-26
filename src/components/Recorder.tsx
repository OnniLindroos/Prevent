"use client";

import { useEffect, useRef, useState } from "react";
import { type Line, nowTime } from "@/lib/stream";

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

type Props = { transcript: Line[]; setTranscript: React.Dispatch<React.SetStateAction<Line[]>> };

export function Recorder({ transcript, setTranscript }: Props) {
  const [consent, setConsent] = useState(false);
  const [recording, setRecording] = useState(false);
  const [speaker, setSpeaker] = useState<Line["speaker"]>("Student");
  const [lang, setLang] = useState("fi-FI");
  const [interim, setInterim] = useState("");
  const [manual, setManual] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [supported, setSupported] = useState(true);

  const recRef = useRef<Recognition | null>(null);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const activeRef = useRef(false);
  const speakerRef = useRef(speaker);
  useEffect(() => { speakerRef.current = speaker; }, [speaker]);
  useEffect(() => { setSupported(!!getRecognition()); }, []);

  async function start() {
    activeRef.current = true;
    setRecording(true);

    // Audio file kept only in this browser (for the counsellor to download if policy allows).
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
      /* microphone denied – live transcription may still work, manual notes always do */
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
    activeRef.current = false;
    setRecording(false);
    setInterim("");
    recRef.current?.stop();
    mediaRef.current?.stop();
  }

  function addManual() {
    if (!manual.trim()) return;
    setTranscript((t) => [...t, { speaker, text: manual.trim(), at: nowTime() }]);
    setManual("");
  }

  return (
    <div className="space-y-4">
      <label className="flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm dark:border-amber-800 dark:bg-amber-950">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1" />
        <span>
          I have told the student that I am taking notes / recording to pass on to the professional, and they did not object.
          Recording stays on this device until the handoff. Never record if it would escalate the situation.
        </span>
      </label>

      <div className="flex flex-wrap items-center gap-2">
        {!recording ? (
          <button disabled={!consent} onClick={start} className="rounded-xl bg-red-600 px-5 py-3 font-bold text-white disabled:opacity-30">
            ● Start recording
          </button>
        ) : (
          <button onClick={stop} className="rounded-xl bg-zinc-900 px-5 py-3 font-bold text-white dark:bg-white dark:text-zinc-900">
            ■ Stop
          </button>
        )}
        <select value={lang} onChange={(e) => setLang(e.target.value)} disabled={recording} className="rounded-lg border bg-transparent px-2 py-2 text-sm">
          <option value="fi-FI">Suomi</option>
          <option value="sv-FI">Svenska</option>
          <option value="en-US">English</option>
        </select>
        {recording && <span className="animate-pulse text-sm font-semibold text-red-600">Recording…</span>}
      </div>

      {!supported && (
        <p className="text-xs text-amber-600">
          Live transcription isn&apos;t supported in this browser (use Chrome, Edge or Safari). Audio and manual notes still work.
        </p>
      )}

      <div>
        <p className="mb-1 text-xs font-semibold uppercase text-zinc-500">Who is speaking now?</p>
        <div className="flex gap-2">
          {(["Student", "Counsellor"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSpeaker(s)}
              className={`flex-1 rounded-lg border-2 py-2 font-semibold ${speaker === s ? "border-teal-700 bg-teal-700 text-white" : "border-zinc-300 dark:border-zinc-700"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="max-h-80 space-y-1 overflow-y-auto rounded-xl border border-zinc-200 p-3 text-sm dark:border-zinc-800">
        {transcript.length === 0 && !interim && <p className="text-zinc-400">Transcript will appear here.</p>}
        {transcript.map((l, i) => (
          <p key={i}>
            <span className="text-xs text-zinc-400">{l.at} </span>
            <b className={l.speaker === "Student" ? "text-teal-700 dark:text-teal-400" : ""}>{l.speaker}:</b> {l.text}
          </p>
        ))}
        {interim && <p className="italic text-zinc-400">{interim}</p>}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); addManual(); }} className="flex gap-2">
        <input
          value={manual}
          onChange={(e) => setManual(e.target.value)}
          placeholder={`Add a note as ${speaker}…`}
          className="flex-1 rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"
        />
        <button className="rounded-lg border px-3">Add</button>
      </form>

      {audioUrl && (
        <div className="space-y-1">
          <audio controls src={audioUrl} className="w-full" />
          <a href={audioUrl} download="prevent-recording.webm" className="text-sm underline">Download audio</a>
        </div>
      )}
    </div>
  );
}
