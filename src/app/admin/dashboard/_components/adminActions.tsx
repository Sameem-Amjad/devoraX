"use server";
import { createClient } from "@/lib/server";
import { revalidatePath } from "next/cache";

export async function deleteProjectAction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (!error) revalidatePath("/admin/dashboard");
  return { error: error?.message ?? null };
}

export async function addProjectAction(project: Record<string, unknown>) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("projects").insert([project]).select();
  if (!error) revalidatePath("/admin/dashboard");
  return { data, error: error?.message ?? null };
}

export async function updateProjectAction(id: string, project: Record<string, unknown>) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("projects").update(project).eq("id", id).select();
  if (!error) revalidatePath("/admin/dashboard");
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
