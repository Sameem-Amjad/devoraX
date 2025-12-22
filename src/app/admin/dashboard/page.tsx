"use server"
import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/app/admin/dashboard/_components/adminDashboard";

export default async function DashboardPage() {
  const supabase = await createClient();
  // 1. Verify User & Role (Hard Security)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.app_metadata?.role !== "admin") {
    redirect("/admin/login");
  }

  // 2. Fetch all data in parallel on the server
  const [projectsRes, inquiriesRes, bookingsRes] = await Promise.all([
    supabase.from('projects').select('*').order('created_at', { ascending: false }),
    supabase.from('inquiries').select('*').order('created_at', { ascending: false }),
    supabase.from('bookings').select('*', { count: 'exact', head: true })
  ]);

  return (
    <AdminDashboard
      initialProjects={projectsRes.data || []}
      initialInquiries={inquiriesRes.data || []}
      initialBookingCount={bookingsRes.count || 0}
    />
  );
}