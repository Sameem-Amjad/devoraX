import { Metadata } from "next";
import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/app/admin/dashboard/_components/adminDashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard | DevoraX",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.app_metadata?.role !== "admin") {
    redirect("/admin/login");
  }

  const [projectsRes, inquiriesRes, bookingsRes] = await Promise.all([
    supabase.from("projects").select("*").order("created_at", { ascending: false }),
    supabase.from("inquiries").select("*").order("created_at", { ascending: false }),
    supabase.from("bookings").select("*").order("created_at", { ascending: false }),
  ]);

  return (
    <AdminDashboard
      initialProjects={projectsRes.data ?? []}
      initialInquiries={inquiriesRes.data ?? []}
      initialBookings={bookingsRes.data ?? []}
      user={{ email: user.email ?? "", id: user.id }}
    />
  );
}
