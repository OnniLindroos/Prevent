import { streamText } from "@/lib/claude";
import { HANDOFF_SYSTEM } from "@/lib/prompts";

export const maxDuration = 60;

type Body = {
  transcript: { speaker: string; text: string; at: string }[];
  notes: string;
  checklist: Record<string, string>;
  redFlags: string[];
};

export async function POST(req: Request) {
  const { transcript = [], notes = "", checklist = {}, redFlags = [] } = (await req.json()) as Body;

  const input = [
    `Red flags ticked by counsellor: ${redFlags.length ? redFlags.join("; ") : "none ticked"}`,
    `Checklist:\n${Object.entries(checklist)
      .map(([k, v]) => `- ${k}: ${v || "(empty)"}`)
      .join("\n")}`,
    `Counsellor notes:\n${notes || "(none)"}`,
    `Transcript:\n${
      transcript.length
        ? transcript.map((t) => `[${t.at}] ${t.speaker}: ${t.text}`).join("\n")
        : "(no recording)"
    }`,
  ].join("\n\n");

  return streamText({
    max_tokens: 4000,
    output_config: { effort: "medium" },
    system: HANDOFF_SYSTEM,
    messages: [{ role: "user", content: input.slice(0, 60000) }],
  });
}
