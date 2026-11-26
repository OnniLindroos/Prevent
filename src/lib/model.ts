// De-escalation model used by the in-the-moment guide.
//
// PLACEHOLDER: the user's chosen crisis model (from a screenshot not yet received)
// should replace these steps. Keep each `cue` to one line (Week 2 finding: long prompts
// cannot be read under pressure); put detail in `more`.

export type Step = {
  id: string;
  title: string;
  cue: string;
  more: string[];
  say?: string[];
  /** Optional short checklist (info is gathered only after stabilisation). */
  collect?: string[];
};

export const DEESCALATION_MODEL: Step[] = [
  {
    id: "safety",
    title: "1. Safety first",
    cue: "Look up. Stay with the student. Check for immediate danger.",
    more: [
      "Put the phone down after reading – eye contact matters more than the app.",
      "Remove the audience: move somewhere calmer, ask other students to leave.",
      "Ask a second adult to come and stay nearby or make calls.",
      "If there is immediate danger: call 112 now.",
    ],
  },
  {
    id: "connect",
    title: "2. Calm & connect",
    cue: "Slow, quiet voice. Sit at their level. Say their name.",
    more: [
      "Give space; don't touch without permission.",
      "One short sentence at a time; allow silences.",
      "Breathe slowly yourself – they will mirror you.",
    ],
    say: [
      "I'm here. You're not in trouble.",
      "We can take this slowly.",
      "Do you want to sit down with me?",
    ],
  },
  {
    id: "listen",
    title: "3. Listen & validate",
    cue: "Listen more than you talk. Name the feeling, don't argue with it.",
    more: [
      "Reflect back what you hear in their words.",
      "Avoid 'calm down', 'it's not that bad', or quick solutions.",
    ],
    say: [
      "It sounds like this has been really hard.",
      "That makes sense given what's happened.",
      "Tell me more about what's going on.",
    ],
  },
  {
    id: "ask",
    title: "4. Ask directly",
    cue: "Ask clearly about suicide. Asking does not plant the idea.",
    more: [
      "Ask in plain words. A yes to any red flag = hand over now.",
      "You are not assessing risk – you are deciding whether to hand over.",
    ],
    say: [
      "Are you thinking about killing yourself?",
      "Have you thought about how?",
      "Have you hurt yourself today?",
    ],
  },
  {
    id: "plan",
    title: "5. Small next step",
    cue: "Agree one small, safe next step together.",
    more: [
      "Who does the student trust? Can we call them together?",
      "Collect handoff information only now that they are calmer.",
    ],
    collect: [
      "What happened (in their words)",
      "Red flags asked & answers",
      "Who has been informed (guardian, nurse)",
      "What helped calm them",
      "Student's own wishes for next steps",
    ],
  },
  {
    id: "handoff",
    title: "6. Hand off",
    cue: "Pass on to a professional. Stay until they take over.",
    more: [
      "Use the handoff route in order; if no answer, go to the next one.",
      "Share the handoff summary so the student doesn't have to repeat everything.",
      "Tell the student what happens next.",
    ],
    say: ["I'm going to stay with you until ___ is here."],
  },
];
