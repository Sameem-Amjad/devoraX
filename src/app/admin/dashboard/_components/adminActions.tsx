"use server";
import { createClient } from "@/lib/server";
import { revalidatePath } from "next/cache";
import { notifyIndexNow } from "@/lib/indexnow";
import { cleanLeadPatch } from "@/lib/booking/leadAssessment";

/**
 * A project was created, edited or deleted. The public pages that render
 * projects, and the sitemaps that list them, are cached for an hour: refresh
 * them now so the change is live at once, then ask IndexNow to recrawl.
 *
 * /case-study is gone from both lists: it redirects to /projects. The project
 * page itself is refreshed even when it is off the index allowlist, because
 * visitors still reach it from /projects; notifyIndexNow drops it from the
 * ping, since a noindex page has nothing for a search engine to pick up.
 */
async function publishProjectChange(id: string | number | null | undefined) {
  const detail = id == null ? [] : [`/projects/${id}`];
  for (const path of [
    "/",
    "/projects",
    ...detail,
    "/sitemaps/case-studies.xml",
    // The homepage's lastmod is the newest project's date.
    "/sitemaps/pages.xml",
    "/sitemap.xml",
    // Lists the allowlisted projects, with Hear With You's text from its row.
    "/llms.txt",
  ]) {
    revalidatePath(path);
  }
  // No /services/[id] any more: the service pages that listed each service's
  // projects redirect (next.config.ts), and the route is gone.
  await notifyIndexNow([...detail, "/projects"]);
}

export async function deleteProjectAction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (!error) {
    revalidatePath("/admin/dashboard");
    await publishProjectChange(id);
  }
  return { error: error?.message ?? null };
}

export async function addProjectAction(project: Record<string, unknown>) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("projects").insert([project]).select();
  if (!error) {
    revalidatePath("/admin/dashboard");
    await publishProjectChange(data?.[0]?.id);
  }
  return { data, error: error?.message ?? null };
}

export async function updateProjectAction(id: string, project: Record<string, unknown>) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("projects").update(project).eq("id", id).select();
  if (!error) {
    revalidatePath("/admin/dashboard");
    await publishProjectChange(id);
  }
  return { data, error: error?.message ?? null };
}

export async function markInquiryReadAction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("inquiries").update({ read: true }).eq("id", id);
  if (!error) revalidatePath("/admin/dashboard");
  return { error: error?.message ?? null };
}

export async function updateBookingStatusAction(id: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
  if (!error) revalidatePath("/admin/dashboard");
  return { error: error?.message ?? null };
}

/**
 * Set a booking's owner-set columns (lib/booking/leadAssessment.ts). Saved the
 * way the status above is: with the signed-in admin's own session, not the
 * service role, so the "admins update bookings" policy is what authorises it.
 * The patch is still checked here, because a server action is a public
 * endpoint and the dashboard is not what guards it.
 *
 * A write the policy refuses (no session, or not an admin) matches no rows and
 * raises no error, so the rows come back and an empty answer is reported
 * rather than shown as saved.
 */
export async function updateBookingLeadAction(id: string, patch: unknown) {
  if (typeof id !== "string" || !id || id.length > 64) return { error: "Unknown booking" };
  const cleaned = cleanLeadPatch(patch);
  if ("error" in cleaned) return { error: cleaned.error };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .update(cleaned.patch)
    .eq("id", id)
    .select("id");
  if (error) return { error: error.message };
  if (!data?.length) return { error: "Not saved. Sign in again as the admin and retry." };
  revalidatePath("/admin/dashboard");
  return { error: null };
}
