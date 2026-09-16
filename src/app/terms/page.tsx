import type { Metadata } from 'next';

const BASE_URL = 'https://thedevorax.tech';
const CONTACT_EMAIL = 'business@thedevorax.tech';

export const metadata: Metadata = {
  title: 'Terms of Service — Site and Project Work',
  description:
    'The terms covering use of this site, what our portfolio figures and indicative pricing mean, and how project work is agreed in a separate written proposal.',
  alternates: { canonical: `${BASE_URL}/terms` },
  robots: { index: true, follow: true },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Terms of Service', item: `${BASE_URL}/terms` },
  ],
};

export default function TermsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <main className="min-h-screen bg-black pb-24 pt-32">
        <div className="mx-auto max-w-3xl px-6">
          <h1 className="text-4xl font-bold text-white md:text-5xl">Terms of Service</h1>
          <p className="mt-4 text-sm text-gray-500">Last updated 17 September 2026</p>

          <div className="mt-10 space-y-10 text-gray-400">
            <section>
              <h2 className="text-2xl font-bold text-white">What these terms cover</h2>
              <p className="mt-4 leading-relaxed">
                These terms govern your use of this website. They do not govern any
                project we carry out for you. Project work is covered by a separate
                written agreement and proposal signed by both parties, and where the
                two differ, that agreement takes precedence.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white">Using this site</h2>
              <p className="mt-4 leading-relaxed">
                You may read, share and reference the content here. Please do not
                attempt to disrupt the service, access areas you are not authorised
                to access, or scrape the site in a way that degrades it for others.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white">
                What the portfolio and case studies mean
              </h2>
              <p className="mt-4 leading-relaxed">
                Case studies describe work we delivered. Outcome figures shown
                alongside them — user counts, order volumes, uptime and similar — are
                as reported to us by the client or taken from the client&apos;s own
                systems. They were not independently audited or instrumented by us,
                and we present them as the client&apos;s reported results rather than
                as a measurement we performed.
              </p>
              <p className="mt-4 leading-relaxed">
                Research articles published here are drawn from our own delivery
                record. Each one states the size and limits of its dataset. They
                describe our experience across a small number of projects and are not
                industry benchmarks.
              </p>
              <p className="mt-4 leading-relaxed">
                Past results do not guarantee a similar outcome on your project.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white">Pricing information</h2>
              <p className="mt-4 leading-relaxed">
                Any prices or package tiers shown on this site are indicative
                starting points to help you judge fit. They are not an offer and not
                a quote. The price for your project is the one stated in the written
                proposal we issue after a discovery call.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white">Bookings and enquiries</h2>
              <p className="mt-4 leading-relaxed">
                Booking a call reserves time for a conversation. It does not create a
                contract for work, and either side can reschedule or cancel. How we
                handle the details you submit is described in our{' '}
                <a
                  href="/privacy"
                  className="text-teal-400 underline underline-offset-4 hover:text-teal-300"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white">Intellectual property</h2>
              <p className="mt-4 leading-relaxed">
                The content, design and written material on this site belong to
                DevoraX. Client names, product names and logos referenced in case
                studies remain the property of their respective owners and appear
                here to describe work we performed.
              </p>
              <p className="mt-4 leading-relaxed">
                Ownership of code and assets we build for you is set out in your
                project agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white">Third-party links</h2>
              <p className="mt-4 leading-relaxed">
                This site links to products we built and to external profiles. We do
                not control those destinations and are not responsible for their
                content or availability.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white">Availability</h2>
              <p className="mt-4 leading-relaxed">
                We aim to keep this site available and accurate, but we provide it on
                an &quot;as is&quot; basis and may change or remove content at any
                time. Uptime commitments, where they exist, live in project
                agreements and service-level agreements, not here.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white">Contact</h2>
              <p className="mt-4 leading-relaxed">
                Questions about these terms can go to{' '}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-teal-400 underline underline-offset-4 hover:text-teal-300"
                >
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
