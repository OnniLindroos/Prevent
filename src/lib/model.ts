// De-escalation model used by the in-the-moment guide: CEASE (Conflict Resolution Skill).
//   C – Calm down / distract   E – Empathize   A – Apologize
//   S – Search for solutions / allies   E – Ensure positive regard
// Core message: de-escalation works best when the person feels heard, respected,
// and guided toward a safe next step.
//
// A safety check (step 0) comes before CEASE: guidance prompts must never delay
// emergency contact. Keep each `cue` to one line (Week 2 finding: long prompts
// cannot be read under pressure); put detail in `more`.

export type Step = {
  id: string;
  letter: string;
  title: string;
  /** Short label from the model card, e.g. "STAY CALM". */
  tag: string;
  color: string;
  cue: string;
  more: string[];
  say?: string[];
  /** Optional short checklist (info is gathered only after stabilisation). */
  collect?: string[];
};

export const CORE_MESSAGE =
  "De-escalation works best when the person feels heard, respected, and guided toward a safe next step.";

export const SAFETY_STEP: Step = {
  id: "safety",
  letter: "!",
  title: "Safety check",
  tag: "BEFORE YOU START",
  color: "#b91c1c",
  cue: "Look up. Stay with the student. Any immediate danger? Call 112 first.",
  more: [
    "Immediate danger = injury, weapon or means at hand, intoxication, danger to others.",
    "Remove the audience: move somewhere calmer, ask other students to leave.",
    "Ask a second adult to come and stay nearby or make calls.",
    "Read the cue, then put the phone down – eye contact matters more than the app.",
  ],
};

export const CEASE: Step[] = [
  {
    id: "calm",
    letter: "C",
    title: "Calm down / distract",
    tag: "STAY CALM",
    color: "#d6336c",
    cue: "Friendly tone, calm body language, a short pause.",
    more: [
      "Slow, quiet voice. Sit or stand at their level, not over them.",
      "Give space; don't touch without permission.",
      "A neutral distraction can help: a glass of water, a walk to a quieter room, slow breathing together.",
      "Breathe slowly yourself – they will mirror you.",
    ],
    say: ["Let's slow this down for a moment.", "Do you want to sit down with me?", "Let's breathe together for a second."],
  },
  {
    id: "empathize",
    letter: "E",
    title: "Empathize",
    tag: "LISTEN FIRST",
    color: "#2f9e44",
    cue: "Show you hear their experience and feelings – without judging.",
    more: [
      "Listen more than you talk. Reflect back what you hear in their words.",
      "Name the feeling; don't argue with it. Avoid 'calm down' or 'it's not that bad'.",
      "If you are worried, ask directly about suicide – asking does not plant the idea. Any yes = hand over (see red flags).",
    ],
    say: [
      "I can see this situation is very difficult for you.",
      "Tell me more about what's going on.",
      "Are you thinking about killing yourself?",
    ],
  },
  {
    id: "apologize",
    letter: "A",
    title: "Apologize",
    tag: "REPAIR",
    color: "#7048e8",
    cue: "Offer a sincere apology for the hurt or inconvenience, when appropriate.",
    more: [
      "Apologise for what happened to them or how it felt – not as an admission of blame for others.",
      "Skip this step if an apology would sound hollow or wouldn't fit the situation.",
    ],
    say: ["I'm really sorry that this happened.", "I'm sorry this has been so hard."],
  },
  {
    id: "solutions",
    letter: "S",
    title: "Search for solutions / allies",
    tag: "NEXT STEP",
    color: "#e8590c",
    cue: "Name practical next steps and people who can help.",
    more: [
      "Who does the student trust? Can we contact them together?",
      "Professional allies: school nurse or psychologist, then the handoff route below.",
      "Collect handoff information only now that they are calmer.",
    ],
    say: ["Let's look at what we can do next, together.", "Who would you like to be here with you?"],
    collect: [
      "What happened (in their words)",
      "Red flags asked & answers",
      "Who has been informed (guardian, nurse)",
      "What helped calm them",
      "Student's own wishes for next steps",
    ],
  },
  {
    id: "regard",
    letter: "E",
    title: "Ensure positive regard",
    tag: "SAFETY + CARE",
    color: "#1c5d99",
    cue: "Communicate safety, care and respect – even when you don't accept harmful behaviour.",
    more: [
      "Tell the student what happens next and that you will stay until the professional takes over.",
      "Share the handoff summary so the student doesn't have to repeat everything.",
    ],
    say: ["I care about you, and I want us to handle this safely.", "I'm going to stay with you until ___ is here."],
  },
];

/** Full guide order: safety check, then C-E-A-S-E. */
export const DEESCALATION_MODEL: Step[] = [SAFETY_STEP, ...CEASE];
