import type { Metadata } from "next";
import { createClient } from "@/lib/server";
import HomeClient from "@/app/_components/homeClient";

const BASE_URL = "https://thedevorax.tech";

export const metadata: Metadata = {
  title: "DevoraX | AI-Powered Mobile & Web Development Agency",
  description:
    "DevoraX is an AI-powered software development agency building high-performance mobile apps, Next.js web platforms, cloud infrastructure, and AI integrations. Trusted by founders and CTOs worldwide.",
  alternates: {
    canonical: BASE_URL,
  },
};

// ✅ Caching works here
export const revalidate = 3600;

export default async function Home() {
  const supabase = await createClient();

  // ✅ Fetching data on the server is faster and more secure
  const [projectsRes, servicesRes] = await Promise.all([
    supabase.from("projects").select("*").order("created_at", { ascending: false }),
    supabase.from("services").select("*")
  ]);

  // Pass the data to the Client Component
  return (
    <HomeClient
      initialProjects={projectsRes.data || []}
      initialServices={servicesRes.data || []}
    />
  );
}