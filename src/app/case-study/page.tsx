import { createClient } from "@/lib/server";
import CaseStudyClient from "./CaseStudyClient";
import { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Case Studies | DevoraX",
  description:
    "Explore our portfolio of high-impact digital products — web apps, mobile apps, AI solutions, and more built for global clients.",
};

export default async function CaseStudyPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  return <CaseStudyClient projects={projects || []} />;
}
