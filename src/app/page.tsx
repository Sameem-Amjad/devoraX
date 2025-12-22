import { createClient } from "@/lib/server";
import HomeClient from "@/app/_components/homeClient";

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