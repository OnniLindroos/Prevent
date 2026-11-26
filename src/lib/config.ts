// PREVENT – site configuration.
// Every school MUST verify and replace these contacts before real use.
// Numbers below are Finnish national services (checked for the draft, re-verify before deployment).

export type Contact = {
  id: string;
  label: string;
  detail: string;
  phone?: string;
  url?: string;
  when: string;
};

/** Plan B order: if the first route does not answer, go to the next one. */
export const HANDOFF_ROUTE: Contact[] = [
  {
    id: "emergency",
    label: "Emergency 112",
    detail: "Immediate danger to life, injury, intoxication, weapon or means at hand",
    phone: "112",
    when: "Immediate danger – call FIRST, use the app afterwards",
  },
  {
    id: "school-health",
    label: "School nurse / psychologist",
    detail: "Configure your school's direct number",
    phone: "", // TODO: school-specific number
    when: "Any red flag, during school hours",
  },
  {
    id: "on-call",
    label: "Acute psychiatric / health on-call",
    detail: "Regional on-call (Päivystysapu) – medical advice",
    phone: "116117",
    when: "School health staff not reachable",
  },
  {
    id: "crisis-line",
    label: "MIELI Crisis Helpline",
    detail: "MIELI Mental Health Finland, 24/7",
    phone: "0925250111",
    url: "https://mieli.fi/en/support-and-help/crisis-helpline/",
    when: "Support for the counsellor or student, any time",
  },
  {
    id: "sekasin",
    label: "Sekasin chat (ages 12–29)",
    detail: "Anonymous chat for young people",
    url: "https://sekasin.fi",
    when: "Follow-up support for the student",
  },
];

/** Fixed red-flag list: any of these ALWAYS means escalate. The app never computes a risk level. */
export const RED_FLAGS = [
  "Talks about suicide, wanting to die or self-harm",
  "Has a plan, or access to means (medication, weapon, height, etc.)",
  "Has already harmed themselves / visible injury",
  "Intoxicated or unable to stay oriented",
  "Danger to others",
  "You feel unsafe or unsure – trust that feeling",
];

export const BOUNDARY_TEXT =
  "PREVENT is not a risk assessment and does not diagnose. It supports your own judgement. " +
  "If any red flag appears, hand over to a professional. In immediate danger call 112 first.";
