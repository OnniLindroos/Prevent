"use client";

import { useState } from "react";
import { EmergencyBar } from "@/components/EmergencyBar";
import { Guide } from "@/components/Guide";
import { Assistant } from "@/components/Assistant";
import { Recorder } from "@/components/Recorder";
import { Handoff } from "@/components/Handoff";
import { BOUNDARY_TEXT } from "@/lib/config";
import type { Line } from "@/lib/stream";

const TABS = ["Guide", "Assistant", "Record", "Handoff"] as const;
type Tab = (typeof TABS)[number];

export default function Home() {
  const [started, setStarted] = useState(false);
  const [tab, setTab] = useState<Tab>("Guide");
  const [redFlags, setRedFlags] = useState<string[]>([]);
  const [checklist, setChecklist] = useState<Record<string, string>>({});
  const [transcript, setTranscript] = useState<Line[]>([]);

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 pb-36 pt-4">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">PREVENT</h1>
          <p className="text-xs text-zinc-500">In-the-moment guide for school staff</p>
        </div>
        {started && (
          <span className={`rounded-full px-2 py-1 text-xs font-semibold ${redFlags.length ? "bg-red-600 text-white" : "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300"}`}>
            {redFlags.length ? "Hand over" : "Session active"}
          </span>
        )}
      </header>

      {!started ? (
        <section className="space-y-6 pt-6 text-center">
          <p className="text-4xl font-bold leading-tight">Look up.<br />Stay with the student.</p>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">Immediate danger? Call 112 first.</p>
          <p className="rounded-xl border border-zinc-200 p-4 text-left text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
            {BOUNDARY_TEXT}
          </p>
          <button onClick={() => setStarted(true)} className="w-full rounded-2xl bg-teal-700 py-4 text-xl font-bold text-white">
            Start guide
          </button>
          <a href="/pocket-card" className="block text-sm text-zinc-500 underline">Printable pocket card (offline)</a>
        </section>
      ) : (
        <>
          <nav className="sticky top-0 z-40 -mx-4 mb-4 flex gap-1 bg-[var(--background)] px-4 py-2">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold ${tab === t ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" : "text-zinc-500"}`}
              >
                {t}
                {t === "Record" && transcript.length > 0 && ` (${transcript.length})`}
              </button>
            ))}
          </nav>

          {/* Tabs stay mounted so a recording keeps running while the counsellor switches views. */}
          <div className={tab === "Guide" ? "" : "hidden"}>
            <Guide redFlags={redFlags} setRedFlags={setRedFlags} checklist={checklist} setChecklist={setChecklist} />
          </div>
          <div className={tab === "Assistant" ? "" : "hidden"}><Assistant /></div>
          <div className={tab === "Record" ? "" : "hidden"}>
            <Recorder transcript={transcript} setTranscript={setTranscript} />
          </div>
          <div className={tab === "Handoff" ? "" : "hidden"}>
            <Handoff
              transcript={transcript}
              checklist={checklist}
              redFlags={redFlags}
              onClear={() => { setTranscript([]); setChecklist({}); setRedFlags([]); }}
            />
          </div>
        </>
      )}

      <EmergencyBar />
    </div>
  );
}
