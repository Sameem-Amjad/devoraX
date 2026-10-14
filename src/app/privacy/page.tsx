import type { Metadata } from 'next';
import { PRIVACY_UPDATED } from '@/data/legal';
import {
  CONSENT_KEY,
  analyticsEnabled,
  analyticsTools,
  clarityEnabled,
  gaEnabled,
} from '@/lib/analytics';
import { JsonLd } from '@/components/seo/structured-data';
import { breadcrumbNode, pageMetadata, webPageNode } from '@/lib/seo';

const CONTACT_EMAIL = 'business@thedevorax.tech';

const TITLE = 'Privacy Policy — What We Collect and Why';
const DESCRIPTION =
  'What this site collects when you book a call or browse, where it is stored, how long it is kept, and how to have it deleted. Plain language, no dark patterns.';

// One date (data/legal.ts) for the visible "Last updated" line, the WebPage
// node's dateModified and the sitemap, so the three can't disagree.
const LAST_UPDATED = PRIVACY_UPDATED;
const lastUpdatedLabel = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'long',
  timeZone: 'UTC',
}).format(new Date(LAST_UPDATED));

const linkClass = 'text-teal-400 underline underline-offset-4 hover:text-teal-300';

// The analytics wording below follows the build's flags, the same ones that
// decide whether the tools load, so this page never describes tracking the
// site is not doing, or misses tracking it is.
const ANALYTICS_COOKIES = [
  gaEnabled && '_ga and _ga_* (Google Analytics)',
  clarityEnabled && '_clck and _clsk (Microsoft Clarity)',
]
  .filter(Boolean)
  .join(', and ');

// pageMetadata gives the page its own og:url and Twitter card; without them it
// inherited the homepage's, so a shared link previewed as the homepage.
export const metadata: Metadata = {
  ...pageMetadata({ title: TITLE, description: DESCRIPTION, path: '/privacy' }),
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        graph={[
          webPageNode({
            path: '/privacy',
            name: 'Privacy Policy',
            description: DESCRIPTION,
            dateModified: LAST_UPDATED,
          }),
          breadcrumbNode('/privacy', [{ name: 'Privacy Policy', path: '/privacy' }]),
        ]}
      />
      <main id="main-content" className="min-h-screen bg-black pb-24 pt-32">
        <div className="mx-auto max-w-3xl px-6">
          <h1 className="text-4xl font-bold text-white md:text-5xl">Privacy Policy</h1>
          <p className="mt-4 text-sm text-gray-500">
            Last updated <time dateTime={LAST_UPDATED}>{lastUpdatedLabel}</time>
          </p>

          <div className="mt-10 space-y-10 text-gray-400">
            <section>
              <h2 className="text-2xl font-bold text-white">What we collect</h2>
              <p className="mt-4 leading-relaxed">
                {analyticsEnabled
                  ? 'The only personal details you give us on this site go through the booking form (the analytics described below record how the site is used, not your name or contact details).'
                  : 'We collect personal data in exactly one place on this site: the booking form.'}{' '}
                When you book a call we store the{' '}
                <strong className="text-gray-200">name</strong>,{' '}
                <strong className="text-gray-200">email address</strong>, and the{' '}
                <strong className="text-gray-200">date and time</strong> you select,
                plus anything you write in the optional message field. Nothing else
                is required, and we do not ask for payment details anywhere on this
                website.
              </p>
              <p className="mt-4 leading-relaxed">
                With each booking we also store your{' '}
                <strong className="text-gray-200">time zone</strong>, which your
                browser reports so the invitation shows your local time, the{' '}
                <strong className="text-gray-200">page you booked from</strong> and,
                if your browser passes it on, the{' '}
                <strong className="text-gray-200">website that sent you here</strong>{' '}
                (only the site&apos;s name, such as google.com, never the full
                address). If you answer the optional question &ldquo;How did you
                hear about us?&rdquo;, we store{' '}
                <strong className="text-gray-200">how you heard about us</strong> as
                well. We use these to see which channels bring us enquiries.
              </p>
              <p className="mt-4 leading-relaxed">
                If you email us directly, we hold that correspondence in our mailbox
                in the ordinary course of business.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white">What we do not collect</h2>
              <p className="mt-4 leading-relaxed">
                {analyticsEnabled
                  ? 'This site runs no advertising pixels and no tracking beyond the analytics described below. We do not build advertising profiles,'
                  : 'This site runs no analytics, no advertising pixels and no third-party tracking scripts. We do not build visitor profiles,'}{' '}
                we do not fingerprint devices, and we do not sell or share personal
                data with advertisers or data brokers.
              </p>
            </section>

            {analyticsEnabled && (
              <section>
                <h2 className="text-2xl font-bold text-white">Analytics</h2>
                <p className="mt-4 leading-relaxed">
                  We use {analyticsTools} to understand how visitors use this site:
                  which pages they view, where they click and how far they scroll.
                  They also record when the booking dialog is opened and when a
                  booking is made, with the page it happened on and, if you answered
                  it, how you heard about us. They never record your name, email
                  address or message.
                  {clarityEnabled &&
                    ' Microsoft Clarity also produces heatmaps and session recordings. What you type into a form is masked in your browser before anything is sent, and the whole booking dialog is masked too.'}{' '}
                  We use this only to improve the site, and we run no ads.
                  {gaEnabled &&
                    ' Google Analytics is told to keep advertising storage off on every visit.'}
                  {clarityEnabled &&
                    ' Microsoft Clarity is told to keep it off as soon as you answer the banner.'}
                </p>
                <p className="mt-4 leading-relaxed">
                  If you are in the EEA, the UK or Switzerland, no analytics cookies
                  are set until you accept the banner. Elsewhere they are set unless
                  you decline. If you decline, each page view is counted on its own
                  without cookies, and any analytics cookies already set are
                  deleted. You can change your answer at any time from{' '}
                  <strong className="text-gray-200">Privacy choices</strong> in the
                  footer.
                </p>
                <p className="mt-4 leading-relaxed">
                  The data is processed by{' '}
                  {gaEnabled && (
                    <>
                      Google (
                      <a
                        href="https://policies.google.com/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkClass}
                      >
                        Google Privacy Policy
                      </a>
                      )
                    </>
                  )}
                  {gaEnabled && clarityEnabled && ' and '}
                  {clarityEnabled && (
                    <>
                      Microsoft (
                      <a
                        href="https://www.microsoft.com/privacy/privacystatement"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkClass}
                      >
                        Microsoft Privacy Statement
                      </a>
                      )
                    </>
                  )}
                  .
                </p>
              </section>
            )}

            <section>
              <h2 className="text-2xl font-bold text-white">Cookies and local storage</h2>
              {analyticsEnabled ? (
                <p className="mt-4 leading-relaxed">
                  The only cookies this site sets for visitors are the analytics
                  ones, {ANALYTICS_COOKIES}, and only as described above.
                  {clarityEnabled && (
                    <>
                      {' '}Microsoft Clarity can also set its own cookies on
                      Microsoft&apos;s domains, such as MUID; Microsoft lists them in{' '}
                      <a
                        href="https://learn.microsoft.com/en-us/clarity/setup-and-installation/cookie-list"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkClass}
                      >
                        its Clarity cookie list
                      </a>
                      .
                    </>
                  )}{' '}
                  Your answer to the banner is saved in
                  your own browser&apos;s local storage under the key{' '}
                  <code className="text-teal-400">{CONSENT_KEY}</code>, with the
                  date you gave it, so the banner does not reappear on every visit.
                  We ask again after six months. That value stays on your device,
                  is never transmitted to us, and clearing your browser storage
                  removes it.
                </p>
              ) : (
                <p className="mt-4 leading-relaxed">
                  We do not set tracking cookies, and with no analytics running
                  there is no consent banner to answer.
                </p>
              )}
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
              <h2 className="text-2xl font-bold text-white">Google Calendar</h2>
              <p className="mt-4 leading-relaxed">
                When you book a call, we create an event on our own Google Calendar
                and add you as a guest so that Google can send you the invitation,
                the calendar file and the video link. The information that reaches
                Google is your{' '}
                <strong className="text-gray-200">name</strong>, your{' '}
                <strong className="text-gray-200">email address</strong>, the{' '}
                <strong className="text-gray-200">time you chose</strong>, your{' '}
                <strong className="text-gray-200">time zone</strong> (reported by
                your browser) and anything you wrote in the optional message field.
              </p>
              <p className="mt-4 leading-relaxed">
                We also read the free and busy periods of our own calendar so the
                site does not offer you a time we are already booked. That check
                returns only whether a period is free — never the contents, titles
                or guests of any other appointment.
              </p>
              <p className="mt-4 leading-relaxed">
                We do not read your calendar. We request access only to our own, and
                we use it only to schedule the call you asked for. Our use of
                information received from Google APIs follows the{' '}
                <a
                  href="https://developers.google.com/terms/api-services-user-data-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-400 underline underline-offset-4 hover:text-teal-300"
                >
                  Google API Services User Data Policy
                </a>
                , including its Limited Use requirements. If you would like the
                event removed, reply to the invitation or email us and we will
                cancel it.
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
