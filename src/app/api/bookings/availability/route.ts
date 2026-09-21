/* Free slots for the booking modal.
 *
 * Returns times only — never who booked them. The browser has no read access
 * to the bookings table (see the RLS migration), so this is the only way it
 * learns what is taken, and it learns nothing else.
 *
 * Availability is the intersection of two sources: slots already booked here,
 * and whatever is genuinely busy on the host's Google Calendar. Without the
 * second, the site would cheerfully book over meetings made anywhere else.
 */

import { NextResponse } from "next/server";
import { serviceClient } from "@/lib/booking/db";
import { fetchBusy } from "@/lib/booking/googleCalendar";
import {
  generateSlots,
  SLOT_MINUTES,
  HOST_TIMEZONE,
  MAX_DAYS_AHEAD,
} from "@/lib/booking/availability";

// Availability changes as people book; never serve it from a cache.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const now = new Date();
    const slots = generateSlots(now);

    if (slots.length === 0) {
      return NextResponse.json({
        slots: [],
        timezone: HOST_TIMEZONE,
        slotMinutes: SLOT_MINUTES,
        horizonDays: MAX_DAYS_AHEAD,
      });
    }

    const from = slots[0];
    const to = new Date(slots[slots.length - 1].getTime() + SLOT_MINUTES * 60_000);

    const supabase = serviceClient();
    const [{ data: taken, error }, busy] = await Promise.all([
      supabase
        .from("bookings")
        .select("starts_at")
        .neq("status", "cancelled")
        .gte("starts_at", from.toISOString())
        .lte("starts_at", to.toISOString()),
      fetchBusy(from, to),
    ]);

    if (error) throw error;

    const bookedMs = new Set((taken ?? []).map((r) => new Date(r.starts_at as string).getTime()));

    // A slot is out if it overlaps a busy interval at all, not just if it
    // starts inside one — a 15-minute meeting at 15:20 still kills 15:00.
    const overlapsBusy = (startMs: number) => {
      const endMs = startMs + SLOT_MINUTES * 60_000;
      return busy.some(([bStart, bEnd]) => startMs < bEnd && endMs > bStart);
    };

    const free = slots
      .map((s) => s.getTime())
      .filter((ms) => !bookedMs.has(ms) && !overlapsBusy(ms))
      .map((ms) => new Date(ms).toISOString());

    return NextResponse.json({
      slots: free,
      timezone: HOST_TIMEZONE,
      slotMinutes: SLOT_MINUTES,
      horizonDays: MAX_DAYS_AHEAD,
    });
  } catch (err) {
    console.error("[availability]", err);
    // Deliberately not a 200 with an empty list: the modal must be able to
    // tell "nothing free" from "we could not find out".
    return NextResponse.json({ error: "Could not load availability" }, { status: 503 });
  }
}
