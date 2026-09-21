"use client";

/* Booking modal.
 *
 * Slots arrive from /api/bookings/availability as ISO instants and are sent
 * back unchanged — the browser never invents a date. Everything the visitor
 * sees is that instant rendered in their own timezone, with the host's time
 * shown alongside so nobody has to do the arithmetic.
 *
 * Previously this generated its own dates with Date.getTime(), which captured
 * the page-load time down to the millisecond, so no two visitors ever produced
 * the same value for the same day and the duplicate check never fired. It also
 * wrote to Supabase directly with the anon key; writes are server-side now.
 */

import { motion } from "framer-motion";
import { X, Zap, Check, AlertCircle, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Availability = {
  slots: string[];
  timezone: string;
  slotMinutes: number;
};

const visitorZone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
};

/** "Tue 23 Sep" in a given zone — the key the day tabs group on. */
const dayKey = (iso: string, tz: string) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(iso));

const timeLabel = (iso: string, tz: string) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso));

const BookingModal = ({ isOpen, onClose }: BookingModalProps) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ startsAt: string; invited: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [availability, setAvailability] = useState<Availability | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [slotsError, setSlotsError] = useState(false);

  const [selected, setSelected] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", notes: "" });

  const tz = useMemo(visitorZone, []);

  const loadSlots = useCallback(async () => {
    setLoadingSlots(true);
    setSlotsError(false);
    try {
      const res = await fetch("/api/bookings/availability", { cache: "no-store" });
      if (!res.ok) throw new Error(String(res.status));
      setAvailability(await res.json());
    } catch {
      setSlotsError(true);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) loadSlots();
  }, [isOpen, loadSlots]);

  /* Group slots into days as the visitor's own calendar shows them — a 9pm
     PKT slot can be the previous afternoon in New York, and grouping by the
     host's day would put it under a heading the visitor doesn't recognise. */
  const days = useMemo(() => {
    const out = new Map<string, string[]>();
    for (const iso of availability?.slots ?? []) {
      const k = dayKey(iso, tz);
      if (!out.has(k)) out.set(k, []);
      out.get(k)!.push(iso);
    }
    return out;
  }, [availability, tz]);

  useEffect(() => {
    if (!activeDay && days.size) setActiveDay([...days.keys()][0]);
  }, [days, activeDay]);

  if (!isOpen) return null;

  const reset = () => {
    setSuccess(null);
    setError(null);
    setSelected(null);
    setForm({ name: "", email: "", notes: "" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!selected) {
      setError("Please pick a time first.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          notes: form.notes || null,
          startsAt: selected,
          timezone: tz,
        }),
      });
      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(body.error ?? "Something went wrong. Please try again.");
        // 409 means the slot went while they were typing — refresh the grid
        // so they aren't offered it a second time.
        if (res.status === 409 || res.status === 422) {
          setSelected(null);
          loadSlots();
        }
        return;
      }
      setSuccess({ startsAt: body.startsAt, invited: body.invited });
    } catch {
      setError("Couldn't reach the server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const daySlots = activeDay ? (days.get(activeDay) ?? []) : [];
  const hostTz = availability?.timezone;
  const showHostTime = hostTz && hostTz !== tz;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md scrollbar-hide">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#0a0a0a] border border-teal-500/20 w-full max-w-md rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(45,212,191,0.15)]"
      >
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-teal-400" />
            <h3 className="text-xl font-bold text-white">Book a Strategy Call</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close booking dialog"
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="h-125 overflow-y-auto scrollbar-hide">
          {success ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-teal-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-teal-400" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Booking confirmed</h4>
              <p className="text-white mb-1 font-medium">
                {new Intl.DateTimeFormat("en-GB", {
                  timeZone: tz,
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                  timeZoneName: "short",
                }).format(new Date(success.startsAt))}
              </p>
              {/* Says what actually happened. The old copy promised an invite
                  unconditionally, including when none was ever sent. */}
              <p className="text-gray-400 text-sm mb-6">
                {success.invited
                  ? "A calendar invitation with a Meet link is on its way to your inbox."
                  : "We've got your booking and will confirm by email shortly."}
              </p>
              <button
                onClick={() => {
                  reset();
                  onClose();
                }}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-lg"
              >
                Close
              </button>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              <p className="text-gray-400 text-sm">
                Schedule a {availability?.slotMinutes ?? 30}-minute consultation with Sameem
                Amjad. Times are shown in your timezone ({tz}).
              </p>

              {loadingSlots && (
                <div className="flex items-center gap-2 text-gray-400 text-sm py-8 justify-center">
                  <Loader2 className="w-4 h-4 animate-spin" /> Loading available times…
                </div>
              )}

              {slotsError && (
                <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <div>
                    Couldn&apos;t load available times.{" "}
                    <button onClick={loadSlots} className="underline hover:text-white">
                      Try again
                    </button>
                  </div>
                </div>
              )}

              {!loadingSlots && !slotsError && days.size === 0 && (
                <p className="text-gray-400 text-sm py-8 text-center">
                  No free slots in the next few weeks — please email instead and we&apos;ll
                  find a time.
                </p>
              )}

              {days.size > 0 && (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-teal-500 uppercase">
                      Select a date
                    </label>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                      {[...days.keys()].map((d) => {
                        const [wd, dayNum, mon] = d.split(" ");
                        return (
                          <button
                            key={d}
                            type="button"
                            onClick={() => {
                              setActiveDay(d);
                              setSelected(null);
                            }}
                            className={`flex flex-col items-center justify-center min-w-[3.5rem] h-16 rounded-lg border transition-colors ${
                              activeDay === d
                                ? "bg-teal-500/20 border-teal-400 text-white"
                                : "border-white/10 bg-white/5 hover:bg-teal-500/10 text-gray-500"
                            }`}
                          >
                            <span className="text-[10px] uppercase">{wd}</span>
                            <span className="text-lg font-bold leading-none">{dayNum}</span>
                            <span className="text-[10px]">{mon}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-teal-500 uppercase">
                      Select a time
                    </label>
                    <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto scrollbar-hide">
                      {daySlots.map((iso) => (
                        <button
                          key={iso}
                          type="button"
                          onClick={() => setSelected(iso)}
                          className={`py-2 text-sm rounded-md border transition-colors ${
                            selected === iso
                              ? "bg-teal-500/20 border-teal-400 text-white"
                              : "border-white/10 bg-white/5 text-gray-300 hover:bg-teal-500/10"
                          }`}
                        >
                          {timeLabel(iso, tz)}
                        </button>
                      ))}
                    </div>
                    {selected && showHostTime && (
                      <p className="text-[11px] text-gray-500">
                        That&apos;s {timeLabel(selected, hostTz!)} for Sameem ({hostTz}).
                      </p>
                    )}
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-3 pt-4 border-t border-white/10">
                    <input
                      required
                      type="text"
                      placeholder="Your Name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/50 transition-all placeholder:text-gray-600"
                    />
                    <input
                      required
                      type="email"
                      placeholder="Your Email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/50 transition-all placeholder:text-gray-600"
                    />
                    <textarea
                      rows={2}
                      placeholder="What would you like to discuss? (optional)"
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/50 transition-all placeholder:text-gray-600 resize-none"
                    />

                    {error && (
                      <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading || !selected}
                      className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-black font-bold py-3 rounded-lg transition-all shadow-[0_0_20px_rgba(45,212,191,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Confirming…" : selected ? "Confirm booking" : "Pick a time"}
                    </button>
                  </form>
                </>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default BookingModal;
