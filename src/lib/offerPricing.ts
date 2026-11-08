/**
 * The offer ladder's prices in the two forms pages need: schema.org Offer
 * fields, and the price line a door page's subtitle ends on ("From $2,400, with
 * the $400 audit credited to it"). Both read each step's `schemaPrice` in
 * data/offer.ts, so /pricing, the door pages and their structured data cannot
 * quote different numbers, and no page types a price into its copy.
 */
import { OFFER_LADDER, offerSteps, type OfferStep, type OfferStepId, type SchemaPrice } from '@/data/offer';
import { AUDIT_CREDIT_STEPS } from '@/data/terms';

/** UN/CEFACT common codes, the form schema.org's unitCode takes, beside a readable unitText. */
const UNIT = {
  WEEK: { unitCode: 'WEE', unitText: 'week' },
  MONTH: { unitCode: 'MON', unitText: 'month' },
} as const;

/**
 * Schema price fields for one ladder step: a flat price; a minPrice for
 * "From $X"; a UnitPriceSpecification for a price per week or per month. A step
 * with no schemaPrice (the free call) gets none rather than a guessed one.
 */
export function offerPrice(step: OfferStep) {
  const p = step.schemaPrice;
  if (!p) return {};
  const amount = p.from ? { minPrice: p.amount } : { price: p.amount };
  if (p.unit) {
    return {
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        ...amount,
        priceCurrency: p.currency,
        ...UNIT[p.unit],
      },
    };
  }
  if (p.from) {
    return {
      priceSpecification: { '@type': 'PriceSpecification', ...amount, priceCurrency: p.currency },
    };
  }
  return { ...amount, priceCurrency: p.currency };
}

/**
 * Offer nodes for the steps a door page sells, in its order. Only priced
 * steps: an Offer with no price says nothing. No description either, because
 * the page describes each step in its own words.
 */
export function ladderOffers(ids: readonly OfferStepId[]) {
  return offerSteps(ids)
    .filter((s) => s.schemaPrice)
    .map((s) => ({ '@type': 'Offer', name: s.title, ...offerPrice(s) }));
}

const usd = (amount: number) => `$${amount.toLocaleString('en-US')}`;

const unitText = (p: SchemaPrice) => (p.unit === 'WEEK' ? ' a week' : p.unit === 'MONTH' ? ' a month' : '');

/** "From $2,400", "$1,200 a week", "$1,500 a month", "$400". */
function priceText(p: SchemaPrice): string {
  return `${p.from ? 'From ' : ''}${usd(p.amount)}${unitText(p)}`;
}

/** What a step is called when its price leads a line on a page that sells several. */
const STEP_NOUN: Record<OfferStepId, string> = {
  call: 'The call',
  audit: 'The audit',
  sprint: 'Sprints',
  payments: 'Payments',
  launch: 'The iOS and Android launch',
  care: 'Monthly care',
};

/** "Sprints at $1,200 a week", "Payments from $1,200". */
function namedPriceText(step: OfferStep): string {
  const p = step.schemaPrice!;
  return `${STEP_NOUN[step.id]} ${p.from ? 'from' : 'at'} ${usd(p.amount)}${unitText(p)}`;
}

/** A step's place on the ladder, for breaking ties between equal prices. */
const ladderIndex = (step: OfferStep) => OFFER_LADDER.findIndex((s) => s.id === step.id);

/**
 * The step a page's price line leads with: the lowest one-off or weekly price,
 * since a monthly price can't be compared with those (a page selling the launch
 * and care leads with the launch, not "Monthly care at $1,500 a month"). Equal
 * prices go to the step that comes first on the ladder, so a page that lists
 * Payments before the sprint still leads with "Sprints at $1,200 a week".
 */
function leadStep(paid: OfferStep[]): OfferStep {
  const oneOff = paid.filter((s) => s.schemaPrice!.unit !== 'MONTH');
  const pool = oneOff.length ? oneOff : paid;
  return pool.reduce((a, b) => {
    const diff = b.schemaPrice!.amount - a.schemaPrice!.amount;
    return diff < 0 || (diff === 0 && ladderIndex(b) < ladderIndex(a)) ? b : a;
  });
}

/**
 * The price a door page states, from the steps it sells. One paid step: its
 * price as the ladder states it ("From $2,400"). Several: the step leadStep()
 * picks, named and with its unit ("Sprints at $1,200 a week"). A bare "From
 * $1,200" read as the price of the whole job, and on the audit's own page as
 * the audit's price. When the page also sells the audit and that step takes the
 * credit (data/terms.ts), the credit is said in the same breath, so $400 never
 * reads as an extra on top. With several steps the credit goes to whichever
 * paid step follows the audit, and the free call can decide the audit isn't
 * needed (Sharetribe template work, a payments-only fix), so the line says
 * both rather than naming one step. Only the audit: its price and the credit.
 * Nothing priced: an empty string.
 */
export function offerPriceLine(ids: readonly OfferStepId[]): string {
  const steps = offerSteps(ids);
  const audit = steps.find((s) => s.id === 'audit')?.schemaPrice;
  const paid = steps.filter((s) => s.id !== 'audit' && s.schemaPrice);
  if (!paid.length) {
    return audit ? `${usd(audit.amount)} for the audit, credited to the fix if you go ahead` : '';
  }
  const lead = leadStep(paid);
  const credited = Boolean(audit) && AUDIT_CREDIT_STEPS.includes(lead.id);
  if (paid.length === 1) {
    const line = priceText(lead.schemaPrice!);
    return credited ? `${line}, with the ${usd(audit!.amount)} audit credited to it` : line;
  }
  const line = namedPriceText(lead);
  return credited
    ? `${line}, with the ${usd(audit!.amount)} audit, when one comes first, credited to the work that follows it`
    : line;
}

/** A door page's subtitle: its lead, then the generated price as a sentence of its own. */
export function offerSubtitle(lead: string, ids: readonly OfferStepId[]): string {
  const price = offerPriceLine(ids);
  const text = lead.trim();
  if (!price) return text;
  if (!text) return `${price}.`;
  return `${text}${/[.!?]$/.test(text) ? '' : '.'} ${price}.`;
}
