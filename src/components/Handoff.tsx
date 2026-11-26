"use client";

import { useState } from "react";
import { type Line, postStream } from "@/lib/stream";

type Props = {
  transcript: Line[];
  checklist: Record<string, string>;
  redFlags: string[];
  onClear: () => void;
};

export function Handoff({ transcript, checklist, redFlags, onClear }: Props) {
  const [notes, setNotes] = useState("");
  const [summary, setSummary] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generate() {
    setBusy(true);
    setSummary("");
    try {
      await postStream("/api/handoff", { transcript, notes, checklist, redFlags }, setSummary);
    } finally {
      setBusy(false);
    }
  }

  async function copy() {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2 text-center text-sm">
        <div className="rounded-lg bg-zinc-100 p-2 dark:bg-zinc-800"><b className="block text-xl">{transcript.length}</b>transcript lines</div>
        <div className="rounded-lg bg-zinc-100 p-2 dark:bg-zinc-800"><b className="block text-xl">{Object.values(checklist).filter(Boolean).length}</b>checklist items</div>
        <div className={`rounded-lg p-2 ${redFlags.length ? "bg-red-600 text-white" : "bg-zinc-100 dark:bg-zinc-800"}`}><b className="block text-xl">{redFlags.length}</b>red flags</div>
      </div>

      <label className="block text-sm">
        Notes for the professional (no names)
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-lg border border-zinc-300 bg-transparent p-2 dark:border-zinc-700"
        />
      </label>

      <button onClick={generate} disabled={busy} className="w-full rounded-xl bg-teal-700 py-3 font-semibold text-white disabled:opacity-40">
        {busy ? "Writing summary…" : "Generate handoff summary"}
      </button>

      {summary && (
        <div className="space-y-2">
          <pre className="whitespace-pre-wrap rounded-xl border border-zinc-200 p-4 font-sans text-sm dark:border-zinc-800">{summary}</pre>
          <p className="text-xs text-zinc-500">Check the summary before sharing. It is a draft from your notes, not a clinical document.</p>
          <div className="flex gap-2">
            <button onClick={copy} className="flex-1 rounded-lg border py-2">{copied ? "Copied" : "Copy"}</button>
            <button onClick={() => window.print()} className="flex-1 rounded-lg border py-2">Print</button>
          </div>
        </div>
      )}

      <button
        onClick={() => { if (confirm("Delete transcript, notes and summary from this device?")) { onClear(); setNotes(""); setSummary(""); } }}
        className="w-full rounded-lg py-2 text-sm text-red-600 underline"
      >
        Delete all session data
      </button>
    </div>
  );
}
