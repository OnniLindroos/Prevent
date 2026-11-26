import type Anthropic from "@anthropic-ai/sdk";
import { streamText } from "@/lib/claude";
import { ASSISTANT_SYSTEM } from "@/lib/prompts";

export const maxDuration = 60;

type ChatMessage = { role: "user" | "assistant"; content: string };

// Trusted health sources the assistant may consult ("connected databases" for the draft).
const TRUSTED_DOMAINS = ["thl.fi", "kaypahoito.fi", "terveyskirjasto.fi", "mieli.fi", "who.int"];

export async function POST(req: Request) {
  const { messages } = (await req.json()) as { messages: ChatMessage[] };
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response("messages required", { status: 400 });
  }

  const history: Anthropic.Beta.BetaMessageParam[] = messages
    .slice(-20)
    .map((m) => ({ role: m.role, content: String(m.content).slice(0, 4000) }));

  return streamText({
    max_tokens: 2000,
    // Low effort: answers must arrive in seconds while the counsellor is with the student.
    output_config: { effort: "low" },
    system: [{ type: "text", text: ASSISTANT_SYSTEM, cache_control: { type: "ephemeral" } }],
    tools: [
      {
        type: "web_search_20260209",
        name: "web_search",
        max_uses: 2,
        allowed_domains: TRUSTED_DOMAINS,
      },
    ],
    messages: history,
  });
}
