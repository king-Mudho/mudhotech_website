/**
 * Every promise the site makes to a customer, in one place.
 *
 * Each line below is something a customer can hold the business to, and each
 * was already on the site before this file existed (it was repeated, in
 * slightly different words, across ten or so components). They are kept,
 * not invented, but none has been confirmed by the owner yet.
 *
 * TODO(content): confirm or change each one — see docs/OPEN-QUESTIONS.md #5.
 * Edit the wording here and every page that makes the promise follows.
 */
export const commitments = {
  /** Shown beside quote buttons and in the repair process. */
  freeAssessment: "Diagnosis and first consultations are free, with no obligation to go ahead.",
  freeAssessmentShort: "Free diagnosis and consultation · No obligation",

  /** Shown on the contact page and in form confirmations. */
  responseTime: "We typically reply within one business day.",
  responseTimeShort: "typically within one business day",

  /**
   * Must stay consistent with the Terms of Service (app/terms-of-service),
   * which say ownership transfers on full payment and exclude pre-existing
   * tools and libraries. The earlier "You own what we build" was unconditional.
   */
  ownership:
    "Every project ends with documentation and training. Once paid in full, the custom work is yours, and you are free to take it elsewhere.",

  /** Repair intake options, as described on /it-support. */
  intake: "Drop the device at our Graniteside office, or book an on-site visit for office equipment and networks.",
} as const;

/**
 * Accurate wording for payment integrations. Shown wherever EcoCash,
 * ZimSwitch or card payments are mentioned.
 *
 * Each provider contracts with the business directly: the client needs its
 * own merchant account and pays that provider's fees. Stripe in particular
 * only onboards businesses registered in its supported countries, which do
 * not include Zimbabwe, so it was wrong to list it as a flat "yes".
 */
export const paymentsNote =
  "Payment integrations use your business's own merchant accounts. Each provider sets its own fees and sign-up requirements, and some, such as Stripe, only accept businesses registered in particular countries. We confirm what is available to you before we quote.";
