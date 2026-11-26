"use client";

import { useState } from "react";
import { postStream } from "@/lib/stream";

type Msg = { role: "user" | "assistant"; content: string };

const QUICK = [
  "They won't talk to me",
  "They're shouting and pacing",
  "They said they want to die",
  "What do I say next?",
];

export function Assistant() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  async function send(text: string) {
    if (!text.trim() || busy) return;
    const next: Msg[] = [...messages, { role: "user", content: text.trim() }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);
    try {
      await postStream("/api/chat", { messages: next }, (t) =>
        setMessages([...next, { role: "assistant", content: t }]),
      );
    } catch {
      setMessages([...next, { role: "assistant", content: "Assistant unavailable – follow the guide and hand off." }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-zinc-500">
        Ask in a few words. The assistant suggests words and actions – it does not assess risk. Don&apos;t type names.
      </p>

      <div className="space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`whitespace-pre-wrap rounded-xl px-4 py-3 ${
              m.role === "user"
                ? "ml-8 bg-zinc-100 dark:bg-zinc-800"
                : "mr-4 border border-teal-200 bg-teal-50 text-lg dark:border-teal-900 dark:bg-teal-950"
            }`}
          >
            {m.content || (busy && i === messages.length - 1 ? "…" : "")}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {QUICK.map((q) => (
          <button key={q} onClick={() => send(q)} disabled={busy} className="rounded-full border px-3 py-1 text-sm disabled:opacity-40">
            {q}
          </button>
        ))}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What's happening?"
          className="flex-1 rounded-xl border border-zinc-300 bg-transparent px-3 py-3 dark:border-zinc-700"
        />
        <button disabled={busy} className="rounded-xl bg-teal-700 px-4 font-semibold text-white disabled:opacity-40">
          Ask
        </button>
      </form>
    </div>
  );
}
