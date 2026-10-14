"use server";
import { createClient } from "@/lib/server";
import { revalidatePath } from "next/cache";
import { notifyIndexNow } from "@/lib/indexnow";

/**
 * A project was created, edited or deleted. The public pages that render
 * projects, and the sitemaps that list them, are cached for an hour: refresh
 * them now so the change is live at once, then ask IndexNow to recrawl.
 */
async function publishProjectChange(id: string | number | null | undefined) {
  const detail = id == null ? [] : [`/projects/${id}`];
  for (const path of [
    "/",
    "/projects",
    "/case-study",
    ...detail,
    "/sitemaps/case-studies.xml",
    // The homepage's lastmod is the newest project's date.
    "/sitemaps/pages.xml",
    "/sitemap.xml",
  ]) {
    revalidatePath(path);
  }
  // Each service page lists the projects linked to it.
  revalidatePath("/services/[id]", "page");
  await notifyIndexNow([...detail, "/projects", "/case-study"]);
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
