"use server";
import { createClient } from "@/lib/server";
import { revalidatePath } from "next/cache";

export async function deleteProjectAction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('projects').delete().eq('id', id);
  
  if (!error) revalidatePath('/admin/dashboard');
  return { error };
}

export async function addProjectAction(project: any) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('projects').insert([project]).select();
  
  if (!error) revalidatePath('/admin/dashboard');
  return { data, error };
}