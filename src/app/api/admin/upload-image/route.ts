import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const BUCKET = "DevoraX";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const projectName = formData.get("projectName") as string | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filePath = projectName
    ? `projects/${projectName}/${fileName}`
    : `projects/${fileName}`;

  // Use service role client to bypass RLS for storage uploads
  const adminClient = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await adminClient.storage
    .from(BUCKET)
    .upload(filePath, file, { contentType: file.type, upsert: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: { publicUrl } } = adminClient.storage.from(BUCKET).getPublicUrl(data.path);

  return NextResponse.json({ url: publicUrl });
}
