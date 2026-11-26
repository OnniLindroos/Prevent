"use client";

import { RED_FLAGS } from "@/lib/config";

export function RedFlags({ redFlags, setRedFlags }: { redFlags: string[]; setRedFlags: (f: string[]) => void }) {
  const toggle = (f: string) =>
    setRedFlags(redFlags.includes(f) ? redFlags.filter((x) => x !== f) : [...redFlags, f]);

  return (
    <section className="rounded-2xl border border-red-200 p-4 dark:border-red-900">
      {redFlags.length > 0 && (
        <div className="mb-3 rounded-xl bg-red-600 p-3 text-white">
          <div className="font-bold">⚠ Red flag – hand over now</div>
          <div className="text-sm">Tap “Hand off” below. Immediate danger: call 112. Stay with the student.</div>
        </div>
      )}
      <p className="mb-1 text-sm font-bold text-red-700 dark:text-red-400">Red flags – any one = hand over</p>
      <p className="mb-2 text-xs text-zinc-500">
        If worried, ask directly: “Are you thinking about killing yourself?” Asking does not plant the idea.
      </p>
      <div className="space-y-1">
        {RED_FLAGS.map((f) => (
          <label key={f} className="flex min-h-12 items-center gap-3 text-base">
            <input type="checkbox" checked={redFlags.includes(f)} onChange={() => toggle(f)} className="h-6 w-6 shrink-0" />
            {f}
          </label>
        ))}
      </div>
    </section>
  );
}
