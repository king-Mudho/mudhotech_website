import { engagementSteps } from "@/data/engagementModel";

export interface ProcessPhase {
  title: string;
  body: string;
  /** Small caption under the body, e.g. which engagement-model steps a phase covers. */
  footnote?: string;
}

const stepTitles = (...ns: number[]) =>
  ns.map((n) => engagementSteps.find((s) => s.step === n)?.title ?? "").join(" · ");

/**
 * Default: a summary of the seven-step engagement model on /about. Each phase
 * names the steps it covers, read from the data rather than retyped, so the
 * two can't drift into describing different processes.
 */
export const engagementPhases: ProcessPhase[] = [
  {
    title: "Consult",
    body: "We learn how your business runs, review what you already have, and agree what success looks like.",
    footnote: stepTitles(1, 2),
  },
  {
    title: "Propose",
    body: "A recommended approach with scope, timeline, cost, and deliverables in writing — before any work starts.",
    footnote: stepTitles(3, 4),
  },
  {
    title: "Build",
    body: "Development, configuration, and testing, then deployment into your environment.",
    footnote: stepTitles(5),
  },
  {
    title: "Hand over & support",
    body: "Training and documentation for your team, then ongoing maintenance, support, and improvements.",
    footnote: stepTitles(6, 7),
  },
];

/**
 * Every phase list passed in here must restate a commitment the site already
 * makes elsewhere. A process strip reads as a promise.
 */
export const repairPhases: ProcessPhase[] = [
  {
    title: "Bring it in, or we come to you",
    body: "Drop the device at our Graniteside office, or book an on-site visit for office equipment and networks.",
  },
  {
    title: "Free diagnosis",
    body: "We find the actual fault and explain it in plain terms. There is no charge for the assessment.",
  },
  {
    title: "Clear quote first",
    body: "You get the cost before any work is agreed — including when the honest answer is that it isn't worth repairing.",
  },
  {
    title: "Fixed and handed back",
    body: "Recoverable data is backed up before anything is wiped, and the machine is tested before you collect it.",
  },
];

export const enquiryPhases: ProcessPhase[] = [
  {
    title: "You get in touch",
    body: "Call, WhatsApp, email, or use the form — whichever suits you.",
  },
  {
    title: "We reply",
    body: "A real person responds, typically within one business day.",
  },
  {
    title: "We assess",
    body: "A free consultation or diagnosis to understand exactly what you need.",
  },
  {
    title: "You get a clear proposal",
    body: "Scope, timeline, and cost in writing. No obligation to go ahead.",
  },
];
