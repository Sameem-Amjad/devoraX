/**
 * The terms a buyer asks about before booking, written once.
 *
 * Each door page renders the rows marked 'doors' in its terms block
 * (components/seo/terms-block.tsx), /pricing#terms carries every row marked
 * 'pricing' in full, and the listing kit (kept outside this public repo)
 * restates the rows marked 'kit' in each platform's own terms. They all read
 * from here so the start date, the turnaround and the money terms cannot drift
 * between surfaces. Change this file and the kit on the same day.
 *
 * Every answer is a practice Sameem confirmed on 7 or 8 Nov 2026. Rule for
 * adding one: if the practice does not exist yet, adopt it first or leave the
 * row out; never publish a guessed term. Left out on purpose:
 *  - What to do when data is exposed, whether we rebuild by default, backups,
 *    and whether the price is fair: page-specific copy, or a practice not
 *    confirmed yet.
 *  - Apple's and Google's review times: a platform fact that has to be re-read
 *    from the primary source on the day it is published.
 *  - The hours a sprint week gets: not published. Pages compare on the quoted
 *    price instead (the overrun row).
 *
 * The check-ins row states exactly the four practices confirmed on 8 Nov 2026.
 * Copy elsewhere may repeat them and add nothing to them.
 *
 * No approval promise anywhere (owner decision, 7 Nov 2026): the stores decide.
 */
import type { OfferStepId } from './offer';

/**
 * The week a new sprint can start (an ISO date, the Monday of that week) and
 * the day it was last set. Updated weekly; nextStartLine() stops printing a week
 * that has passed, so a missed update shows "ask on the call" rather than a
 * date that is no longer true.
 */
export const NEXT_START = '2026-11-16';
export const NEXT_START_UPDATED = '2026-11-10';

/** The audit report usually arrives this many working days after we get access to the code. */
export const AUDIT_TURNAROUND_WORKING_DAYS = 2;

/** The paid steps the $400 audit is credited to, whichever of them follows it. */
export const AUDIT_CREDIT_STEPS: OfferStepId[] = ['sprint', 'payments', 'launch'];

/**
 * When the answers below last changed. Shown under the terms block. 8 Nov
 * 2026: the check-ins row; specialists in who-works; the overrun row covers
 * every written quote; the launch and Payments billed in $1,200 weeks; one
 * release quoted per change after the defect window; the accounts default in
 * the ownership row, which the doors now show. 10 Nov 2026: the payment row
 * says the same prices apply on Upwork, which adds its own client fee.
 */
export const TERMS_DATA_UPDATED = '2026-11-10T00:00:00.000Z';

/** Where a row renders: the door pages' block, the full Q&A on /pricing, the listing kit. */
export type TermSurface = 'doors' | 'pricing' | 'kit';

export type Term = {
  /** Stable, lowercase-hyphenated. */
  id: string;
  question: string;
  answer: string;
  /** A shorter answer for the door pages' block, where one is worth having. */
  short?: string;
  surfaces: TermSurface[];
};

/** The row whose answer opens with nextStartLine(), read on the day it renders. */
export const NEXT_START_TERM_ID = 'start';

export const TERMS: Term[] = [
  {
    id: NEXT_START_TERM_ID,
    question: 'How soon can you start, and when do I get the audit?',
    answer: `The audit report usually arrives ${AUDIT_TURNAROUND_WORKING_DAYS} working days after we get access to the code.`,
    surfaces: ['doors', 'pricing', 'kit'],
  },
  {
    id: 'who-works',
    question: 'Who works on my app?',
    answer:
      'Sameem Amjad and Usman, the two engineers who run DevoraX, work on every sprint together. We run one client sprint at a time. Sometimes a designer or another specialist joins a project. We name them to you before they start, and they work under the same confidentiality as we do.',
    surfaces: ['doors', 'pricing', 'kit'],
  },
  {
    // Exactly the four practices confirmed on 8 Nov 2026, and nothing more.
    id: 'check-ins',
    question: 'How will we keep in touch during the work?',
    answer:
      'Every week you get a video demo of progress and a short written update. You also get a shared project board (Jira, Linear, Trello or similar) and a Slack or WhatsApp channel with Sameem and Usman.',
    surfaces: ['doors', 'pricing', 'kit'],
  },
  {
    id: 'overrun',
    question: 'What if it takes longer than quoted?',
    answer:
      'If the work takes longer than the audit or the written quote estimated, we finish the agreed scope at no extra cost. New requests are quoted before we start them.',
    surfaces: ['doors', 'pricing', 'kit'],
  },
  {
    id: 'store-rejection',
    question: 'What does a store rejection cost me?',
    answer:
      'During a store launch, answering App Review or Google Play review and resubmitting is included for the scope we agreed. Anything a store asks for outside that scope is quoted before we start it.',
    surfaces: ['doors', 'pricing', 'kit'],
  },
  {
    id: 'defects',
    question: 'What if something you built breaks after handover?',
    answer:
      'Defects in the work we delivered are fixed free for 35 days after handover. After that, fixes, updates and new releases go through monthly care at $1,500 a month, or a single release quoted per change.',
    surfaces: ['doors', 'pricing', 'kit'],
  },
  {
    id: 'payment',
    question: 'How do I pay?',
    answer:
      'The audit is paid up front, and the written report is yours whatever you decide. Sprints, the Payments step and the iOS and Android launch are billed weekly, in advance, in $1,200 weeks: Payments from $1,200 is one week, Connect payouts from $2,400 and the launch from $2,400 are two weeks each. Prefer platform protection? You can hire us on Upwork at the same prices; Upwork adds its own client fee.',
    surfaces: ['doors', 'pricing', 'kit'],
  },
  {
    // Keep the steps named here in line with AUDIT_CREDIT_STEPS.
    id: 'audit-credit',
    question: 'Is the $400 audit credited?',
    answer:
      'Yes. If you go ahead, the $400 is credited to the paid step that follows it: a finish sprint, payments or the iOS and Android launch.',
    surfaces: ['doors', 'pricing', 'kit'],
  },
  {
    id: 'payments-only',
    question: 'Only my payments are broken. Do I need the audit?',
    answer:
      'Not always. If the rest of the app is sound, the free call can skip the audit and quote the Payments step. One bug you can name and reproduce? A fixed-price gig will cost less.',
    surfaces: ['pricing', 'kit'],
  },
  {
    id: 'continuity',
    question: 'Will you disappear?',
    answer:
      "DevoraX is two engineers, Sameem Amjad and Usman, and both work on every sprint. Our track record is public: our Fiverr profile, which is in Sameem Amjad's name, shows a 5.0 rating across 50+ projects since January 2022.",
    surfaces: ['pricing', 'kit'],
  },
  {
    id: 'ownership',
    question: 'Who owns the code and the accounts?',
    answer:
      'You do. All code and IP are yours on final payment. Your app runs on your own accounts by default: the Apple and Google developer accounts, Stripe and hosting. If you ask us to hold one for you, we transfer it to you at handover. For the App Store and Google Play, that means moving the app to your own developer account.',
    surfaces: ['doors', 'pricing', 'kit'],
  },
  {
    id: 'approval',
    question: 'Can you guarantee approval?',
    answer:
      "No one can. We prepare the app against Apple's and Google's guidelines, submit it and answer the reviewers. The stores decide approval. Sameem has personally prepared and submitted iOS builds to App Review, published Android apps to Google Play, shipped in-app purchase and answered store rejections.",
    surfaces: ['pricing', 'kit'],
  },
  {
    id: 'time-zone',
    question: 'Which time zone are you in, and how big is the team?',
    answer:
      'Pakistan (UTC+5), and DevoraX is two engineers. Our weekday evening call slots in Pakistan fall in the US Eastern morning. If you need five developers, we are the wrong fit.',
    surfaces: ['pricing', 'kit'],
  },
  {
    id: 'pentest',
    question: 'Does the audit replace a penetration test?',
    answer:
      "No. It is an engineering review, not a security certification, and it doesn't replace the third-party penetration test some investors ask for.",
    surfaces: ['pricing'],
  },
];

/** The rows for one surface, in order. */
export function termsFor(surface: TermSurface): Term[] {
  return TERMS.filter((t) => t.surfaces.includes(surface));
}

/**
 * A row's answer as a surface prints it: the doors' block takes the short form
 * where a row has one. Everything that prints a row goes through this (and the
 * start row's date through nextStartLine), so two places on one page can't
 * print the same row differently.
 */
export function termAnswer(t: Term, surface: TermSurface): string {
  return surface === 'doors' ? (t.short ?? t.answer) : t.answer;
}

/** The whole answer as plain text, start week included: for JSON-LD and llms.txt. */
export function termText(t: Term, surface: TermSurface, now: Date): string {
  const answer = termAnswer(t, surface);
  return t.id === NEXT_START_TERM_ID ? `${nextStartLine(now)} ${answer}` : answer;
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/** "2026-11-09" as "9 November 2026", in UTC so no time zone moves the day. */
function longDate(isoDay: string): string {
  return new Date(`${isoDay}T00:00:00.000Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/**
 * True once the week of NEXT_START is over: from the following Monday,
 * 00:00 UTC. An unreadable date counts as passed.
 */
export function nextStartPassed(now: Date): boolean {
  const start = Date.parse(`${NEXT_START}T00:00:00.000Z`);
  return Number.isNaN(start) || now.getTime() >= start + WEEK_MS;
}

/**
 * The start-date sentence for a page rendered at `now`. Pages that show it
 * revalidate hourly, so the switch to the fallback lands within the hour.
 */
export function nextStartLine(now: Date): string {
  if (nextStartPassed(now)) return 'Ask on the call: our next start date is updated weekly.';
  return `We can start a new sprint in the week of ${longDate(NEXT_START)} (updated ${longDate(NEXT_START_UPDATED)}).`;
}
