"use client";

import { useState } from "react";
import { HANDOFF_ROUTE } from "@/lib/config";

/** Always-visible emergency + Plan B handoff route (Week 2 revision #2). */
export function EmergencyBar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-red-200 bg-white/95 backdrop-blur dark:border-red-900 dark:bg-zinc-950/95">
      {open && (
        <div className="mx-auto max-w-2xl px-4 pt-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Handoff route – if no answer, go to the next
          </p>
          <ol className="space-y-2">
            {HANDOFF_ROUTE.map((c, i) => (
              <li key={c.id} className="flex items-center gap-3 rounded-lg border border-zinc-200 p-2 dark:border-zinc-800">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold dark:bg-zinc-800">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold">{c.label}</div>
                  <div className="truncate text-xs text-zinc-500">{c.when}</div>
                </div>
                {c.phone ? (
                  <a href={`tel:${c.phone}`} className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-semibold text-white dark:bg-white dark:text-zinc-900">
                    Call
                  </a>
                ) : c.url ? (
                  <a href={c.url} target="_blank" rel="noreferrer" className="rounded-md border px-3 py-2 text-sm font-semibold">
                    Open
                  </a>
                ) : (
                  <span className="text-xs text-amber-600">Not configured</span>
                )}
              </li>
            ))}
          </ol>
          <p className="mt-2 text-xs text-zinc-500">Never leave the student alone – ask a second adult to make calls.</p>
        </div>
      )}
      <div className="mx-auto flex max-w-2xl gap-2 px-4 py-3">
        <a href="tel:112" className="flex-1 rounded-2xl bg-red-600 py-5 text-center text-lg font-bold text-white shadow active:bg-red-700">
          Call 112
        </a>
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex-1 rounded-2xl border-2 border-red-600 py-5 text-lg font-bold text-red-700 dark:text-red-400"
        >
          {open ? "Close" : "Hand off"}
        </button>
      </div>
    </div>
  );
}
