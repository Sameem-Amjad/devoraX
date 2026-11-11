'use client';

/**
 * Tabs whose panels are all in the server HTML.
 *
 * The panels arrive as children, rendered on the server, and every one of
 * them is mounted: the ones not chosen carry `hidden`, never unmount. A
 * crawler or an AI assistant that runs no JavaScript reads every panel, and
 * the FAQPage markup built from them describes text that is on the page.
 * Without JavaScript the first panel shows and the tab buttons do nothing,
 * the same fallback the pricing section uses.
 *
 * Keyboard: the arrow keys move between tabs (left/right, and up/down for the
 * vertical list on wide screens), Home and End jump to the ends, and only the
 * chosen tab is in the tab order, as the WAI-ARIA tabs pattern asks.
 */
import { Children, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

export type TabItem = {
  /** Unique on the page: the tab is `${id}-tab`, its panel `${id}-panel`. */
  id: string;
  label: string;
};

type TabSetProps = {
  tabs: TabItem[];
  /** The tablist's accessible name. */
  label: string;
  /** 'side': a vertical list beside the panel from `lg`. 'top': a row above it. */
  layout?: 'top' | 'side';
  children: ReactNode;
};

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

export function TabSet({ tabs, label, layout = 'top', children }: TabSetProps) {
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const panels = Children.toArray(children);
  const side = layout === 'side';

  const choose = (i: number) => {
    const next = (i + tabs.length) % tabs.length;
    setActive(next);
    buttons.current[next]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') choose(i + 1);
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') choose(i - 1);
    else if (e.key === 'Home') choose(0);
    else if (e.key === 'End') choose(tabs.length - 1);
    else return;
    e.preventDefault();
  };

  return (
    <div className={side ? 'lg:grid lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-start lg:gap-10' : ''}>
      {/* On a phone the tabs are one row to swipe; on wide screens the side
          layout stacks them in a column that stays in view. */}
      <div
        role="tablist"
        aria-label={label}
        className={`scrollbar-hide -mx-6 flex snap-x scroll-px-6 gap-2 overflow-x-auto px-6 pb-1 ${
          side ? 'lg:sticky lg:top-28 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0 lg:pb-0' : 'md:mx-0 md:flex-wrap md:px-0'
        }`}
      >
        {tabs.map((t, i) => {
          const selected = i === active;
          return (
            <button
              key={t.id}
              ref={(el) => {
                buttons.current[i] = el;
              }}
              id={`${t.id}-tab`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${t.id}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={`flex-shrink-0 snap-start whitespace-nowrap rounded-full border px-4 py-2 text-left text-sm font-medium transition-colors ${focusRing} ${
                side ? 'lg:whitespace-normal lg:rounded-xl lg:px-4 lg:py-3' : ''
              } ${
                selected
                  ? 'border-accent/50 bg-accent/[0.08] text-paper'
                  : 'border-rule text-paper-dim hover:border-rule-strong hover:text-paper'
              }`}
            >
              {side && (
                <span
                  aria-hidden="true"
                  className={`mr-2 font-mono text-[0.65rem] ${selected ? 'text-accent' : 'text-paper-faint'}`}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
              )}
              {t.label}
            </button>
          );
        })}
      </div>

      <div className={side ? 'mt-8 lg:mt-0' : 'mt-8'}>
        {panels.map((panel, i) => (
          <div
            key={tabs[i]?.id ?? i}
            id={`${tabs[i]?.id}-panel`}
            role="tabpanel"
            aria-labelledby={`${tabs[i]?.id}-tab`}
            hidden={i !== active}
            tabIndex={0}
            className={`rounded-2xl ${focusRing}`}
          >
            {panel}
          </div>
        ))}
      </div>
    </div>
  );
}
