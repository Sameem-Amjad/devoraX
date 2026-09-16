/**
 * Site-wide footer. A server component on purpose — it is pure links, so it costs
 * no client JS and every anchor is in the initial HTML for crawlers and for AI
 * engines, which do not execute JavaScript.
 *
 * This replaces the footer that used to live inside the homepage client
 * component, where it was rendered on exactly one URL.
 */
import Link from 'next/link';
import { Linkedin, Github, Mail } from 'lucide-react';
import Logo from '@/components/global/logo';
import {
  SERVICE_LINKS,
  CASE_STUDY_LINKS,
  COMPANY_LINKS,
  LEGAL_LINKS,
} from '@/data/siteNav';

const SOCIAL = [
  { Icon: Linkedin, href: 'https://linkedin.com/company/devorax', label: 'DevoraX on LinkedIn' },
  { Icon: Github, href: 'https://github.com/devorax', label: 'DevoraX on GitHub' },
  { Icon: Mail, href: 'mailto:business@thedevorax.tech', label: 'Email DevoraX' },
];

const linkClass =
  'text-gray-500 hover:text-teal-400 transition-colors text-sm';

export function SiteFooter() {
  return (
    <footer className="bg-black pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Brand */}
          <div>
            <Logo />
            <p className="text-gray-500 mt-5 max-w-sm leading-relaxed text-sm">
              DevoraX is a software development agency building mobile apps, AI and
              full-stack web platforms, and cloud infrastructure for founders and
              product teams worldwide.
            </p>
            <div className="flex gap-3 mt-6">
              {SOCIAL.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-teal-600/80 transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Services — one descriptive anchor per real service page */}
          <nav aria-labelledby="footer-services">
            <h2
              id="footer-services"
              className="text-white font-semibold text-sm mb-5 uppercase tracking-widest"
            >
              Services
            </h2>
            <ul className="space-y-3">
              {SERVICE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/services" className={linkClass}>
                  All services
                </Link>
              </li>
            </ul>
          </nav>

          {/* Case studies — deep links to the site's most substantial pages */}
          <nav aria-labelledby="footer-work">
            <h2
              id="footer-work"
              className="text-white font-semibold text-sm mb-5 uppercase tracking-widest"
            >
              Case Studies
            </h2>
            <ul className="space-y-3">
              {CASE_STUDY_LINKS.slice(0, 8).map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/case-study" className={linkClass}>
                  All case studies
                </Link>
              </li>
            </ul>
          </nav>

          {/* Company */}
          <nav aria-labelledby="footer-company">
            <h2
              id="footer-company"
              className="text-white font-semibold text-sm mb-5 uppercase tracking-widest"
            >
              Company
            </h2>
            <ul className="space-y-3">
              <li>
                <Link href="/projects" className={linkClass}>
                  Portfolio
                </Link>
              </li>
              {COMPANY_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 mt-16 border-t border-white/5 gap-4">
          <p className="text-xs text-gray-600 font-mono">
            © {new Date().getFullYear()} DevoraX. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {LEGAL_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
              >
                {l.label}
              </Link>
            ))}
            {/* Was a client-side button that flipped React state to reach the admin
                login. A plain link works without JS and the middleware guards the
                route regardless. */}
            <Link
              href="/admin/login"
              rel="nofollow"
              className="text-xs text-gray-700 hover:text-teal-500 transition-colors font-mono"
            >
              SYSTEM ACCESS
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
