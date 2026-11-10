import { Reveal } from '@/components/ui/reveal';

/**
 * The one heading every homepage section uses: a numbered mono label, the h2
 * in the display face, and an optional lead paragraph, left-aligned.
 *
 * It replaces the pill label, white-and-gradient h2 and centred grey paragraph
 * that twelve sections each wrote out by hand. `aside` sits to the right of the
 * heading on wide screens: a link, usually.
 */
type SectionHeadingProps = {
  /** "01", "02", … in page order. */
  index: string;
  label: string;
  title: React.ReactNode;
  children?: React.ReactNode;
  aside?: React.ReactNode;
  headingId?: string;
};

export function SectionHeading({ index, label, title, children, aside, headingId }: SectionHeadingProps) {
  return (
    <Reveal className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        <p className="mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-paper-faint">
          <span className="text-accent">{index}</span>
          <span aria-hidden="true" className="h-px w-8 bg-rule-strong" />
          {label}
        </p>
        <h2
          id={headingId}
          className="text-balance font-display text-[clamp(2rem,4.4vw,3.5rem)] font-semibold leading-[1.04] tracking-[-0.03em] text-paper"
        >
          {title}
        </h2>
        {children && <div className="mt-5 max-w-2xl text-lg leading-relaxed text-paper-dim">{children}</div>}
      </div>
      {aside && <div className="flex-shrink-0">{aside}</div>}
    </Reveal>
  );
}
