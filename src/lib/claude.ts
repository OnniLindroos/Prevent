import Anthropic from "@anthropic-ai/sdk";

export const MODEL = "claude-opus-5-5";

let client: Anthropic | null = null;
export function getClient() {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  client ??= new Anthropic();
  return client;
}

/**
 * Streams Claude's text output as a plain-text HTTP response.
 * Uses server-side refusal fallbacks so a safety-classifier decline is retried
 * on a fallback model instead of leaving the counsellor with nothing.
 */
export function streamText(
  params: Omit<Anthropic.Beta.MessageCreateParamsStreaming, "model" | "stream" | "betas" | "fallbacks">,
): Response {
  const c = getClient();
  if (!c) {
    return new Response(
      "Claude is not configured (ANTHROPIC_API_KEY missing). Use the guide and the handoff route.",
      { status: 503 },
    );
  }

  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const stream = c.beta.messages.stream({
          model: MODEL,
          betas: ["server-side-fallback-2026-07-01"],
          fallbacks: "default",
          ...params,
        });
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal") {
          controller.enqueue(
            encoder.encode("\n\n[No answer available – follow the guide and the handoff route.]"),
          );
        }
      } catch (err) {
        console.error("Claude error", err);
        controller.enqueue(
          encoder.encode("\n\n[Assistant unavailable – follow the guide and the handoff route.]"),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
