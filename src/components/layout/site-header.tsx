'use client';

/**
 * Site-wide header, rendered from the root layout so every route has one.
 *
 * The old `Navbar` lived inside the homepage client component and could not be
 * reused: it took `onOpenBooking` / `setView` / `activeView` props, and every nav
 * item called `preventDefault()` then tried to smooth-scroll to an element id. On
 * any page other than `/` those ids do not exist, so the links did nothing — which
 * is why it was only ever mounted on two routes.
 *
 * Here every item is a real `<Link>` to a real URL. Client-side state covers only
 * the scroll background and the mobile menu toggle, so the anchors are present in
 * the server HTML whether or not JavaScript runs.
 */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import Logo from '@/components/global/logo';
import { PRIMARY_NAV } from '@/data/siteNav';

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-colors duration-500 ${
        scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'
      }`}
    >
      <nav aria-label="Primary" className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        <Link href="/" aria-label="DevoraX — home">
          <Logo />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {PRIMARY_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative text-sm font-medium text-gray-400 transition-colors duration-300 hover:text-teal-400 group"
            >
              {item.label}
              <span className="pointer-events-none absolute left-0 -bottom-1 h-[2px] w-full origin-left scale-x-0 bg-gradient-to-r from-cyan-400 to-emerald-400 transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </Link>
          ))}

          <Link
            href="/contact"
            className="bg-white/5 hover:bg-teal-500/10 text-white border border-white/10 hover:border-teal-500/50 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all"
          >
            Book a Call
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          className="md:hidden text-white"
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Rendered in the DOM and hidden with CSS rather than unmounted, so the
          links are in the server HTML on mobile-first crawls too. */}
      <div
        id="mobile-menu"
        hidden={!isOpen}
        className="md:hidden bg-black border-b border-white/10"
      >
        <div className="flex flex-col p-6 gap-4">
          {PRIMARY_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="text-lg font-medium text-gray-300 hover:text-teal-400 transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="bg-teal-600 text-white w-full py-3 rounded-xl font-semibold mt-2 text-center"
          >
            Book a Call
          </Link>
        </div>
      </div>
    </header>
  );
}
