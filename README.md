# PREVENT

In-the-moment guide for school counsellors who are with a student in acute distress on school grounds. It helps them de-escalate, recognise red flags and hand off safely to professional care. Course prototype for *Suicidology Basics I – Crisis Skills for a Safer World* (Version 2, built on the Week 2 test findings).

**Not a risk assessment and not a medical device.** The app never shows a risk level. Any red flag means handing over to a professional. In immediate danger, call 112 first.

## Features (draft)

| Area | What it does | Week 2 revision it addresses |
|---|---|---|
| Start screen | "Look up. Stay with the student." plus the role boundary | #5 hesitation at the start; #3 the app being mistaken for a risk tool |
| Guide | De-escalation steps as one-line cues, with "More" for detail | #1 prompts too long to read under pressure |
| Red flags | A fixed list. Ticking any item shows a "hand over now" banner | #3 counsellors relying on the app to decide escalation |
| Emergency bar | 112 and the Plan B handoff route on every screen, each one tap to call | #2 unclear who to contact first |
| Assistant | Claude chat that gives short replies, limited to trusted health sites (THL, Käypä hoito, MIELI, WHO) | "Having the words ready helped" |
| Record | Consent first, then live transcription (fi/sv/en) with a student/counsellor speaker toggle, plus a local audio file | Smooth handoff so the student doesn't repeat themselves |
| Handoff | Claude turns the transcript, checklist and notes into a structured handoff summary with no names. Copy or print it | #4 information collected only after stabilisation |
| Pocket card | `/pocket-card`, a printable offline version | #5 connectivity; a phone can look dismissive |

## Configure before real use

- `src/lib/config.ts`: the handoff route and phone numbers. **The school nurse/psychologist number is empty and must be set for each school.** Check all national numbers again before use.
- `src/lib/model.ts`: the de-escalation steps. These are a placeholder until the chosen crisis model is plugged in.
- `src/lib/prompts.ts`: the assistant and handoff system prompts.

## Run locally (Docker)

```bash
cp .env.example .env          # add ANTHROPIC_API_KEY
docker compose up -d --build  # http://localhost:3100
docker compose --profile phone up -d   # HTTPS tunnel for testing the microphone on a phone
```

Without a key, the guide, red flags, emergency bar and recording still work. The assistant and the handoff summary show a fallback message instead.

## Deploy (Vercel)

Import the repo, set `ANTHROPIC_API_KEY` in Project → Environment Variables and deploy. The framework is Next.js.

## Data and privacy (open items)

- The transcript and audio stay in the browser's memory. Nothing is stored on the server. "Delete all session data" clears it.
- When a summary is generated, the transcript is sent to the Anthropic API. **GDPR review, a data-processing agreement and the school's consent policy are still to do** before any real use.
- Speech recognition in Chrome/Edge may use the browser vendor's cloud service. This also needs review.
