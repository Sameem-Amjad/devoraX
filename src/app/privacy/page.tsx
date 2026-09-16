import type { Metadata } from 'next';

const BASE_URL = 'https://thedevorax.tech';
const CONTACT_EMAIL = 'business@thedevorax.tech';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'What data this site collects, why, where it is stored, and how to have it deleted. Plain language, no dark patterns.',
  alternates: { canonical: `${BASE_URL}/privacy` },
  robots: { index: true, follow: true },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Privacy Policy', item: `${BASE_URL}/privacy` },
  ],
};

export default function PrivacyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <main className="min-h-screen bg-black pb-24 pt-32">
        <div className="mx-auto max-w-3xl px-6">
          <h1 className="text-4xl font-bold text-white md:text-5xl">Privacy Policy</h1>
          <p className="mt-4 text-sm text-gray-500">Last updated 17 September 2026</p>

          <div className="mt-10 space-y-10 text-gray-400">
            <section>
              <h2 className="text-2xl font-bold text-white">What we collect</h2>
              <p className="mt-4 leading-relaxed">
                We collect personal data in exactly one place on this site: the
                booking form. When you book a call we store the{' '}
                <strong className="text-gray-200">name</strong>,{' '}
                <strong className="text-gray-200">email address</strong>, and the{' '}
                <strong className="text-gray-200">date and time</strong> you select.
                Nothing else is required, and we do not ask for payment details
                anywhere on this website.
              </p>
              <p className="mt-4 leading-relaxed">
                If you email us directly, we hold that correspondence in our mailbox
                in the ordinary course of business.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white">What we do not collect</h2>
              <p className="mt-4 leading-relaxed">
                This site runs no analytics, no advertising pixels and no
                third-party tracking scripts. We do not build visitor profiles, we
                do not fingerprint devices, and we do not sell or share personal
                data with advertisers or data brokers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white">Cookies and local storage</h2>
              <p className="mt-4 leading-relaxed">
                We do not set tracking cookies. When you answer the consent banner,
                your choice is saved in your own browser&apos;s local storage under
                the key <code className="text-teal-400">devorax-cookie-consent</code>,
                so the banner does not reappear on every visit. That value stays on
                your device, is never transmitted to us, and clearing your browser
                storage removes it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white">Where your data is stored</h2>
              <p className="mt-4 leading-relaxed">
                Booking submissions are stored in our database, hosted by Supabase.
                The site itself is served over HTTPS. Access to the booking data is
                restricted to DevoraX personnel who need it in order to respond to
                you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white">How long we keep it</h2>
              <p className="mt-4 leading-relaxed">
                We keep booking enquiries for as long as we need them to respond and
                to maintain a record of our business correspondence. If you ask us to
                delete your data, we will do so.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white">Your rights</h2>
              <p className="mt-4 leading-relaxed">
                You can ask us what personal data we hold about you, ask us to
                correct it, or ask us to delete it. Email{' '}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-teal-400 underline underline-offset-4 hover:text-teal-300"
                >
                  {CONTACT_EMAIL}
                </a>{' '}
                and we will action the request. Depending on where you live, you may
                have additional statutory rights over your personal data, and nothing
                in this policy limits them.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white">Changes to this policy</h2>
              <p className="mt-4 leading-relaxed">
                If we change what we collect or how we use it, we will update this
                page and the date at the top.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white">Contact</h2>
              <p className="mt-4 leading-relaxed">
                Questions about this policy can go to{' '}
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
