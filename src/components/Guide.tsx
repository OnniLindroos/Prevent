"use client";

import { useState } from "react";
import { DEESCALATION_MODEL } from "@/lib/model";
import { RED_FLAGS } from "@/lib/config";

type Props = {
  redFlags: string[];
  setRedFlags: (f: string[]) => void;
  checklist: Record<string, string>;
  setChecklist: (c: Record<string, string>) => void;
};

export function Guide({ redFlags, setRedFlags, checklist, setChecklist }: Props) {
  const [i, setI] = useState(0);
  const [more, setMore] = useState(false);
  const step = DEESCALATION_MODEL[i];

  const toggleFlag = (f: string) =>
    setRedFlags(redFlags.includes(f) ? redFlags.filter((x) => x !== f) : [...redFlags, f]);

  return (
    <div className="space-y-4">
      {redFlags.length > 0 && (
        <div className="rounded-xl bg-red-600 p-4 text-white">
          <div className="text-lg font-bold">⚠ Red flag – hand over now</div>
          <div className="text-sm">Tap “Hand off” below. Immediate danger: call 112. Stay with the student.</div>
        </div>
      )}

      <div className="flex gap-1">
        {DEESCALATION_MODEL.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => { setI(idx); setMore(false); }}
            aria-label={s.title}
            className={`h-2 flex-1 rounded-full ${idx <= i ? "bg-teal-600" : "bg-zinc-200 dark:bg-zinc-800"}`}
          />
        ))}
      </div>

      <section className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
        <div className="text-sm font-semibold text-teal-700 dark:text-teal-400">{step.title}</div>
        <p className="mt-1 text-2xl font-semibold leading-snug">{step.cue}</p>

        {step.say && (
          <div className="mt-4 space-y-2">
            {step.say.map((s) => (
              <p key={s} className="rounded-lg bg-teal-50 px-3 py-2 text-lg dark:bg-teal-950">“{s}”</p>
            ))}
          </div>
        )}

        {step.collect && (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-semibold uppercase text-zinc-500">Optional – only once calmer</p>
            {step.collect.map((c) => (
              <label key={c} className="block text-sm">
                {c}
                <input
                  value={checklist[c] ?? ""}
                  onChange={(e) => setChecklist({ ...checklist, [c]: e.target.value })}
                  className="mt-1 w-full rounded-md border border-zinc-300 bg-transparent px-2 py-1 dark:border-zinc-700"
                />
              </label>
            ))}
          </div>
        )}

        <button onClick={() => setMore((m) => !m)} className="mt-4 text-sm font-medium text-zinc-500 underline">
          {more ? "Less" : "More"}
        </button>
        {more && (
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
            {step.more.map((m) => <li key={m}>{m}</li>)}
          </ul>
        )}

        <div className="mt-5 flex gap-2">
          <button disabled={i === 0} onClick={() => { setI(i - 1); setMore(false); }} className="rounded-lg border px-4 py-2 disabled:opacity-30">
            Back
          </button>
          <button
            disabled={i === DEESCALATION_MODEL.length - 1}
            onClick={() => { setI(i + 1); setMore(false); }}
            className="flex-1 rounded-lg bg-teal-700 px-4 py-2 font-semibold text-white disabled:opacity-30"
          >
            Next step
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-red-200 p-4 dark:border-red-900">
        <p className="mb-2 text-sm font-bold text-red-700 dark:text-red-400">Red flags – any one = hand over</p>
        <div className="space-y-1">
          {RED_FLAGS.map((f) => (
            <label key={f} className="flex items-start gap-2 text-sm">
              <input type="checkbox" checked={redFlags.includes(f)} onChange={() => toggleFlag(f)} className="mt-1" />
              {f}
            </label>
          ))}
        </div>
      </section>
    </div>
  );
}
