"use client";

import { useState } from "react";
import type { RecorderState } from "@/lib/useRecorder";

/** Transcript panel: language, manual notes, transcript and audio. Recording itself is on the home screen. */
export function Recorder({ rec }: { rec: RecorderState }) {
  const [manual, setManual] = useState("");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <label className="text-sm text-zinc-500">Language</label>
        <select
          value={rec.lang}
          onChange={(e) => rec.setLang(e.target.value)}
          disabled={rec.recording}
          className="h-12 rounded-xl border bg-transparent px-3"
        >
          <option value="fi-FI">Suomi</option>
          <option value="sv-FI">Svenska</option>
          <option value="en-US">English</option>
        </select>
      </div>

      {!rec.supported && (
        <p className="text-xs text-amber-600">
          Live transcription isn&apos;t supported in this browser (use Chrome, Edge or Safari). Audio and manual notes still work.
        </p>
      )}

      <div className="max-h-[50vh] space-y-1 overflow-y-auto rounded-xl border border-zinc-200 p-3 text-sm dark:border-zinc-800">
        {rec.transcript.length === 0 && !rec.interim && <p className="text-zinc-400">Transcript will appear here.</p>}
        {rec.transcript.map((l, i) => (
          <p key={i}>
            <span className="text-xs text-zinc-400">{l.at} </span>
            <b className={l.speaker === "Student" ? "text-teal-700 dark:text-teal-400" : ""}>{l.speaker}:</b> {l.text}
          </p>
        ))}
        {rec.interim && <p className="italic text-zinc-400">{rec.interim}</p>}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); rec.addLine(manual); setManual(""); }} className="flex gap-2">
        <input
          value={manual}
          onChange={(e) => setManual(e.target.value)}
          placeholder={`Add a note as ${rec.speaker}…`}
          className="h-14 flex-1 rounded-xl border border-zinc-300 bg-transparent px-3 dark:border-zinc-700"
        />
        <button className="h-14 rounded-xl border px-5 font-semibold">Add</button>
      </form>

      {rec.audioUrl && (
        <div className="space-y-1">
          <audio controls src={rec.audioUrl} className="w-full" />
          <a href={rec.audioUrl} download="prevent-recording.webm" className="text-sm underline">Download audio</a>
        </div>
      )}
    </div>
  );
}
