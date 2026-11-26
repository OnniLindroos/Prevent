"use client";

import { useEffect, useState } from "react";
import { EmergencyBar } from "@/components/EmergencyBar";
import { Guide } from "@/components/Guide";
import { Assistant } from "@/components/Assistant";
import { Recorder } from "@/components/Recorder";
import { Handoff } from "@/components/Handoff";
import { RedFlags } from "@/components/RedFlags";
import { Sheet } from "@/components/Sheet";
import { BOUNDARY_TEXT } from "@/lib/config";
import { DEESCALATION_MODEL } from "@/lib/model";
import { type RecorderState, useRecorder } from "@/lib/useRecorder";

type Panel = null | "guide" | "assistant" | "transcript" | "handoff" | "flags";

function Elapsed({ since }: { since: number }) {
  const [now, setNow] = useState(since);
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const s = Math.max(0, Math.floor((now - since) / 1000));
  return <>{`${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`}</>;
}

/** Large, low-key record control. First use asks once for consent, then it's one tap. */
function RecordButton({ rec, consent, setConsent }: { rec: RecorderState; consent: boolean; setConsent: (b: boolean) => void }) {
  const [asking, setAsking] = useState(false);

  if (asking && !consent) {
    return (
      <div className="rounded-3xl border-2 border-amber-400 bg-amber-50 p-4 dark:bg-amber-950">
        <p className="mb-3 text-base">Has the student been told you&apos;re taking notes to pass on to the professional, and they didn&apos;t object?</p>
        <div className="flex gap-2">
          <button onClick={() => setAsking(false)} className="h-16 flex-1 rounded-2xl border-2 text-lg font-semibold">Not now</button>
          <button
            onClick={() => { setConsent(true); setAsking(false); rec.start(); }}
            className="h-16 flex-[2] rounded-2xl bg-zinc-900 text-lg font-bold text-white dark:bg-white dark:text-zinc-900"
          >
            Yes – record
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        onClick={() => (rec.recording ? rec.stop() : consent ? rec.start() : setAsking(true))}
        aria-pressed={rec.recording}
        className={`flex h-28 w-full items-center justify-center gap-4 rounded-3xl text-2xl font-bold transition-colors ${
          rec.recording
            ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
            : "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
        }`}
      >
        <span className={`h-5 w-5 rounded-full ${rec.recording ? "animate-pulse bg-red-500" : "bg-red-500/70"}`} />
        {rec.recording ? (
          <span>Stop <span className="font-mono text-lg font-normal opacity-70">{rec.startedAt && <Elapsed since={rec.startedAt} />}</span></span>
        ) : (
          "Record"
        )}
      </button>
      {rec.recording && (
        <div className="grid grid-cols-2 gap-2">
          {(["Student", "Counsellor"] as const).map((s) => (
            <button
              key={s}
              onClick={() => rec.setSpeaker(s)}
              className={`h-14 rounded-2xl border-2 text-lg font-semibold ${
                rec.speaker === s ? "border-teal-700 bg-teal-700 text-white" : "border-zinc-300 dark:border-zinc-700"
              }`}
            >
              {s} speaking
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Tile({ label, sub, onClick, accent, badge }: { label: string; sub: string; onClick: () => void; accent?: string; badge?: string | number }) {
  return (
    <button
      onClick={onClick}
      className="relative flex h-28 flex-col items-start justify-end rounded-3xl bg-zinc-100 p-4 text-left dark:bg-zinc-900"
      style={accent ? { boxShadow: `inset 0 0 0 2px ${accent}` } : undefined}
    >
      {badge ? (
        <span className="absolute right-3 top-3 rounded-full bg-zinc-900 px-2 py-0.5 text-xs font-bold text-white dark:bg-white dark:text-zinc-900">
          {badge}
        </span>
      ) : null}
      <span className="text-xl font-bold" style={accent ? { color: accent } : undefined}>{label}</span>
      <span className="text-sm text-zinc-500">{sub}</span>
    </button>
  );
}

export default function Home() {
  const rec = useRecorder();
  const [panel, setPanel] = useState<Panel>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [consent, setConsent] = useState(false);
  const [redFlags, setRedFlags] = useState<string[]>([]);
  const [checklist, setChecklist] = useState<Record<string, string>>({});
  const close = () => setPanel(null);
  const step = DEESCALATION_MODEL[stepIndex];

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 pb-36 pt-4">
      <header className="mb-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">PREVENT</h1>
          <p className="text-xs text-zinc-500">Look up. Stay with the student.</p>
        </div>
        {redFlags.length > 0 && (
          <button onClick={() => setPanel("flags")} className="rounded-full bg-red-600 px-3 py-2 text-sm font-bold text-white">
            ⚠ Hand over now
          </button>
        )}
      </header>

      <p className="mb-3 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-base font-medium text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
        If possible, find another adult to help monitor the student with you.
      </p>

      <div className="space-y-3">
        <RecordButton rec={rec} consent={consent} setConsent={setConsent} />

        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-500">De-escalate – CEASE</p>
          <div className="grid grid-cols-6 gap-1.5">
            {DEESCALATION_MODEL.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => { setStepIndex(idx); setPanel("guide"); }}
                aria-label={s.title}
                style={{ backgroundColor: s.color }}
                className={`h-20 rounded-2xl text-3xl font-bold text-white ${idx === stepIndex ? "ring-4 ring-zinc-400/60" : ""}`}
              >
                {s.letter}
              </button>
            ))}
          </div>
          <button onClick={() => setPanel("guide")} className="mt-1.5 w-full rounded-2xl px-1 py-2 text-left">
            <span className="text-sm font-semibold" style={{ color: step.color }}>{step.title}: </span>
            <span className="text-base">{step.cue}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Tile label="Assistant" sub="Ask Claude what to say" onClick={() => setPanel("assistant")} />
          <Tile label="Red flags" sub="Any one = hand over" accent="#dc2626" badge={redFlags.length || undefined} onClick={() => setPanel("flags")} />
          <Tile label="Transcript" sub={rec.recording ? "Recording…" : "Notes & recording"} badge={rec.transcript.length || undefined} onClick={() => setPanel("transcript")} />
          <Tile label="Handoff" sub="Summary for the professional" onClick={() => setPanel("handoff")} />
        </div>

        <p className="px-1 pt-1 text-xs text-zinc-500">
          {BOUNDARY_TEXT} <a href="/pocket-card" className="underline">Pocket card</a>
        </p>
      </div>

      {/* Panels stay mounted so chat, notes and checklist survive closing them. */}
      <Sheet open={panel === "guide"} title="CEASE guide" accent={step.color} onClose={close}>
        <Guide i={stepIndex} setI={setStepIndex} redFlags={redFlags} setRedFlags={setRedFlags} checklist={checklist} setChecklist={setChecklist} />
      </Sheet>
      <Sheet open={panel === "assistant"} title="Assistant" onClose={close}><Assistant /></Sheet>
      <Sheet open={panel === "flags"} title="Red flags" accent="#dc2626" onClose={close}>
        <RedFlags redFlags={redFlags} setRedFlags={setRedFlags} />
      </Sheet>
      <Sheet open={panel === "transcript"} title="Transcript" onClose={close}><Recorder rec={rec} /></Sheet>
      <Sheet open={panel === "handoff"} title="Handoff" onClose={close}>
        <Handoff
          transcript={rec.transcript}
          checklist={checklist}
          redFlags={redFlags}
          onClear={() => { rec.clear(); setChecklist({}); setRedFlags([]); }}
        />
      </Sheet>

      <EmergencyBar />
    </div>
  );
}
