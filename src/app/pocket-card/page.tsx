import { DEESCALATION_MODEL } from "@/lib/model";
import { HANDOFF_ROUTE, RED_FLAGS } from "@/lib/config";

export const metadata = { title: "PREVENT pocket card" };

/** Printable offline version (Week 2 revision #5: connectivity, phone may look dismissive). */
export default function PocketCard() {
  return (
    <main className="mx-auto max-w-xl p-6 text-sm">
      <h1 className="text-2xl font-bold">PREVENT – pocket card</h1>
      <p className="mb-4 font-semibold">Immediate danger → call 112 first. Never leave the student alone.</p>

      <ol className="mb-4 space-y-1">
        {DEESCALATION_MODEL.map((s) => (
          <li key={s.id}><b>{s.letter} – {s.title}:</b> {s.cue}</li>
        ))}
      </ol>

      <h2 className="font-bold text-red-700">Red flags – any one = hand over</h2>
      <ul className="mb-4 list-disc pl-5">{RED_FLAGS.map((f) => <li key={f}>{f}</li>)}</ul>

      <h2 className="font-bold">Handoff route (if no answer → next)</h2>
      <ol className="list-decimal pl-5">
        {HANDOFF_ROUTE.map((c) => (
          <li key={c.id}>{c.label}: {c.phone || c.url || "__________"}</li>
        ))}
      </ol>
      <p className="mt-6 text-xs text-zinc-500">Not a risk assessment. Supports, never replaces, professional judgement.</p>
    </main>
  );
}
