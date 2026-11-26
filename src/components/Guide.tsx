"use client";

import { useState } from "react";
import { CORE_MESSAGE, DEESCALATION_MODEL } from "@/lib/model";
import { RedFlags } from "./RedFlags";

type Props = {
  i: number;
  setI: (i: number) => void;
  redFlags: string[];
  setRedFlags: (f: string[]) => void;
  checklist: Record<string, string>;
  setChecklist: (c: Record<string, string>) => void;
};

export function Guide({ i, setI, redFlags, setRedFlags, checklist, setChecklist }: Props) {
  const [more, setMore] = useState(false);
  const step = DEESCALATION_MODEL[i];
  const go = (n: number) => { setI(n); setMore(false); };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-6 gap-1.5">
        {DEESCALATION_MODEL.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => go(idx)}
            aria-label={s.title}
            style={{ backgroundColor: s.color, opacity: idx === i ? 1 : 0.35 }}
            className="h-14 rounded-xl text-xl font-bold text-white"
          >
            {s.letter}
          </button>
        ))}
      </div>

      <section className="rounded-2xl border-2 p-5" style={{ borderColor: step.color }}>
        <div className="flex items-baseline justify-between gap-2">
          <div className="text-lg font-bold" style={{ color: step.color }}>{step.title}</div>
          <div className="text-[11px] font-semibold tracking-wide text-zinc-500">{step.tag}</div>
        </div>
        <p className="mt-1 text-2xl font-semibold leading-snug">{step.cue}</p>

        {step.say && (
          <div className="mt-4 space-y-2">
            {step.say.map((s) => (
              <p key={s} className="rounded-lg px-3 py-2 text-lg italic" style={{ backgroundColor: `${step.color}1a` }}>
                “{s}”
              </p>
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
                  className="mt-1 h-11 w-full rounded-md border border-zinc-300 bg-transparent px-2 dark:border-zinc-700"
                />
              </label>
            ))}
          </div>
        )}

        <button onClick={() => setMore((m) => !m)} className="mt-4 h-11 text-sm font-medium text-zinc-500 underline">
          {more ? "Less" : "More"}
        </button>
        {more && (
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
            {step.more.map((m) => <li key={m}>{m}</li>)}
          </ul>
        )}

        <div className="mt-5 flex gap-2">
          <button disabled={i === 0} onClick={() => go(i - 1)} className="h-14 rounded-xl border px-5 font-semibold disabled:opacity-30">
            Back
          </button>
          <button
            disabled={i === DEESCALATION_MODEL.length - 1}
            onClick={() => go(i + 1)}
            style={{ backgroundColor: DEESCALATION_MODEL[Math.min(i + 1, DEESCALATION_MODEL.length - 1)].color }}
            className="h-14 flex-1 rounded-xl px-4 font-semibold text-white disabled:opacity-30"
          >
            {i < DEESCALATION_MODEL.length - 1 ? `Next: ${DEESCALATION_MODEL[i + 1].title}` : "Last step – hand off"}
          </button>
        </div>
      </section>

      <p className="rounded-xl bg-[#13294b] px-4 py-3 text-sm text-white">
        <b className="text-amber-300">CORE MESSAGE </b>{CORE_MESSAGE}
      </p>

      <RedFlags redFlags={redFlags} setRedFlags={setRedFlags} />
    </div>
  );
}
