"use client";

/* The dashboard's lead tracking: the controls that set a booking's owner-set
 * columns, and the report of bookings by channel. Both read the rows the
 * dashboard already holds; saving is the dashboard's job (it applies the
 * change at once and puts it back if the save fails), so these only report
 * what the owner chose. */

import { useId } from "react";
import { ChevronRight } from "lucide-react";
import { LEAD_CHANNELS, leadChannelLabel } from "@/lib/booking/attribution";
import { cleanText } from "@/lib/booking/brief";
import {
  FIRST_STEPS,
  MAX_QUALIFIED_NOTE,
  firstStepLabel,
  isFirstStep,
  type LeadPatch,
} from "@/lib/booking/leadAssessment";
import { channelReport, type ReportedBooking } from "@/lib/booking/leadReport";

// The columns of a booking row these components read and the owner sets.
type LeadBooking = ReportedBooking & { qualified_note?: string | null };

const controlClass =
  "w-full rounded-lg border border-white/10 bg-black px-2.5 py-2 text-xs text-white focus:border-teal-500/50 focus:outline-none";
const labelClass = "mb-1 block text-[11px] uppercase tracking-wider text-gray-500";

// A yes/no column is three states, and "not set" is one of them: null means
// the owner has not assessed it yet, which is not the same as no.
const triValue = (value: unknown) => (value === true ? "yes" : value === false ? "no" : "");
const fromTri = (value: string) => (value === "yes" ? true : value === "no" ? false : null);

const TriSelect = ({ id, label, value, onChange }: {
  id: string;
  label: string;
  value: unknown;
  onChange: (value: boolean | null) => void;
}) => (
  <div>
    <label htmlFor={id} className={labelClass}>{label}</label>
    <select
      id={id}
      value={triValue(value)}
      onChange={(e) => onChange(fromTri(e.target.value))}
      className={controlClass}
    >
      <option value="">Not set</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </select>
  </div>
);

/** What is set on a booking, in a line, for the closed panel. */
const leadSummary = (b: LeadBooking): string => {
  const parts = [
    b.qualified === true ? "Qualified" : b.qualified === false ? "Not qualified" : null,
    b.new_channel === true ? "New channel" : b.new_channel === false ? "Not a new channel" : null,
    b.first_step_paid
      ? `First step: ${firstStepLabel(b.first_step_paid) ?? b.first_step_paid}`
      : null,
    b.lead_channel ? `Channel: ${leadChannelLabel(b.lead_channel) ?? b.lead_channel}` : null,
  ].filter(Boolean);
  return parts.length ? parts.join(" · ") : "Not assessed yet";
};

/**
 * One booking's owner-set columns, folded away under a line saying what is set
 * so a long list stays readable. Each control saves on change; the note saves
 * when the field loses focus, and is cleaned the way the server will clean it
 * so what shows is what was stored.
 */
export const LeadAssessment = ({ booking: b, onSave }: {
  booking: LeadBooking;
  onSave: (patch: LeadPatch) => void;
}) => {
  const uid = useId();
  const stored = b.qualified_note || null;

  // A value this build has no option for (set by hand in the table editor)
  // still shows, so the select never claims "None yet" over a real value.
  const unknownStep = b.first_step_paid && !isFirstStep(b.first_step_paid) ? b.first_step_paid : null;
  const unknownChannel =
    b.lead_channel && !(LEAD_CHANNELS as readonly string[]).includes(b.lead_channel)
      ? b.lead_channel
      : null;

  return (
    <details className="group">
      <summary className="flex cursor-pointer list-none items-center gap-2 text-xs text-gray-400 hover:text-white [&::-webkit-details-marker]:hidden">
        <ChevronRight className="h-3 w-3 shrink-0 transition-transform group-open:rotate-90" />
        <span className="font-medium text-gray-300">Lead details</span>
        <span className="min-w-0 truncate text-gray-500">{leadSummary(b)}</span>
      </summary>

      <div className="mt-3 grid grid-cols-1 gap-3 pb-1 sm:grid-cols-2 xl:grid-cols-4">
        <div>
          <label htmlFor={`${uid}-channel`} className={labelClass}>Channel</label>
          <select
            id={`${uid}-channel`}
            value={b.lead_channel ?? ""}
            onChange={(e) => onSave({ lead_channel: (e.target.value || null) as LeadPatch["lead_channel"] })}
            className={controlClass}
          >
            <option value="">None set</option>
            {unknownChannel && <option value={unknownChannel}>{unknownChannel}</option>}
            {LEAD_CHANNELS.map((key) => (
              <option key={key} value={key}>{leadChannelLabel(key)}</option>
            ))}
          </select>
        </div>

        <TriSelect
          id={`${uid}-new`}
          label="New channel"
          value={b.new_channel}
          onChange={(value) => onSave({ new_channel: value })}
        />
        <TriSelect
          id={`${uid}-qualified`}
          label="Qualified"
          value={b.qualified}
          onChange={(value) => onSave({ qualified: value })}
        />

        <div>
          <label htmlFor={`${uid}-step`} className={labelClass}>First step paid</label>
          <select
            id={`${uid}-step`}
            value={b.first_step_paid ?? ""}
            onChange={(e) => onSave({ first_step_paid: (e.target.value || null) as LeadPatch["first_step_paid"] })}
            className={controlClass}
          >
            <option value="">None yet</option>
            {unknownStep && <option value={unknownStep}>{unknownStep}</option>}
            {FIRST_STEPS.map((step) => (
              <option key={step.id} value={step.id}>{step.title}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2 xl:col-span-4">
          <label htmlFor={`${uid}-note`} className={labelClass}>Why, in a line</label>
          {/* Uncontrolled and keyed on the stored value: it shows what was
              saved, cleaned, and starts over if a failed save puts the old
              value back. */}
          <input
            key={stored ?? ""}
            id={`${uid}-note`}
            type="text"
            maxLength={MAX_QUALIFIED_NOTE}
            defaultValue={stored ?? ""}
            placeholder="Optional"
            onBlur={(e) => {
              const next = cleanText(e.currentTarget.value, MAX_QUALIFIED_NOTE);
              if (next !== stored) onSave({ qualified_note: next });
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
            }}
            className={controlClass}
          />
        </div>
      </div>
    </details>
  );
};

/**
 * Bookings by channel, with how many were qualified, qualified through a new
 * channel, and went on to pay for a first step. Counts every booking, whatever
 * its status, and only what the owner has set: a booking not yet assessed is
 * counted under Bookings and nowhere else.
 */
export const ChannelReport = ({ bookings }: { bookings: ReportedBooking[] }) => {
  if (bookings.length === 0) return null;
  const { rows, total } = channelReport(bookings);
  const cell = "px-4 py-2.5 text-right tabular-nums";
  return (
    <div className="overflow-hidden rounded-xl border border-white/5 bg-[#080808]">
      <div className="border-b border-white/5 px-6 py-4">
        <h3 className="font-bold text-white">Bookings by channel</h3>
        <p className="mt-1 text-xs text-gray-500">
          By the profile a booking link was on, or how the visitor said they heard about
          us when there is none. Every booking is counted, cancelled ones too.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-wider text-gray-400">
            <tr>
              <th scope="col" className="px-4 py-3">Channel</th>
              <th scope="col" className="px-4 py-3 text-right">Bookings</th>
              <th scope="col" className="px-4 py-3 text-right">Qualified</th>
              <th scope="col" className="px-4 py-3 text-right">Qualified, new channel</th>
              <th scope="col" className="px-4 py-3 text-right">First step paid</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((row) => (
              <tr key={row.key ?? "none"}>
                <th scope="row" className={`px-4 py-2.5 font-normal ${row.key === null ? "text-gray-500" : "text-gray-200"}`}>
                  {row.label}
                </th>
                <td className={`${cell} text-white`}>{row.bookings}</td>
                <td className={`${cell} text-gray-300`}>{row.qualified}</td>
                <td className={`${cell} text-gray-300`}>{row.qualifiedNew}</td>
                <td className={`${cell} text-gray-300`}>{row.firstStepPaid}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t border-white/10 bg-white/5 font-semibold text-white">
            <tr>
              <th scope="row" className="px-4 py-2.5 text-left">{total.label}</th>
              <td className={cell}>{total.bookings}</td>
              <td className={cell}>{total.qualified}</td>
              <td className={cell}>{total.qualifiedNew}</td>
              <td className={cell}>{total.firstStepPaid}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
