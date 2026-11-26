"use client";

/** Full-screen panel. Stays mounted while closed so its state (chat, inputs) is kept. */
export function Sheet({
  open,
  title,
  accent,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  accent?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className={`fixed inset-0 z-40 overflow-y-auto bg-[var(--background)] ${open ? "" : "hidden"}`}>
      <div className="mx-auto max-w-2xl px-4 pb-40">
        <div className="sticky top-0 z-10 -mx-4 flex items-center gap-3 bg-[var(--background)] px-4 py-3">
          <button
            onClick={onClose}
            className="h-14 min-w-28 rounded-2xl bg-zinc-200 px-4 text-lg font-bold dark:bg-zinc-800"
          >
            ← Home
          </button>
          <h2 className="text-xl font-bold" style={accent ? { color: accent } : undefined}>{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
}
