import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  // Auth guard — only admins can use this endpoint
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.app_metadata?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { imageUrl, imageBase64, context } = body;

  if (!imageUrl && !imageBase64) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }

  const imageContent = imageBase64
    ? { type: "image_url" as const, image_url: { url: imageBase64 } }
    : { type: "image_url" as const, image_url: { url: imageUrl } };

  const systemPrompt = `You are an expert at analyzing software project screenshots and generating compelling portfolio content.
Given a project screenshot, generate concise, professional content for a web development agency portfolio.
Respond ONLY with valid JSON, no markdown fences.`;

  const userPrompt = `Analyze this project screenshot and generate portfolio metadata.
${context ? `Additional context from user: "${context}"` : ""}

Return a JSON object with exactly these fields:
{
  "title": "short project name (2-5 words)",
  "description": "1-2 sentence compelling description of what this project does, focusing on business value",
  "category": "one of: React Native, Next.js, MERN Stack, React.js, Node.js, Mobile App, Web App, E-Commerce, SaaS, Dashboard",
  "slug": "url-friendly-slug-from-title",
  "accent": "one of these tailwind gradient classes: from-teal-500 to-emerald-600, from-violet-500 to-purple-600, from-blue-500 to-cyan-600, from-orange-500 to-amber-600, from-rose-500 to-pink-600, from-indigo-500 to-blue-600",
  "stats": { "users": "estimated user count like 500+", "status": "Active" },
  "confidence": "high | medium | low"
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 500,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            imageContent,
            { type: "text", text: userPrompt },
          ],
        },
      ],
    });

    const raw = response.choices[0].message.content ?? "{}";
    const cleaned = raw.replace(/```json\n?|```/g, "").trim();
    const generated = JSON.parse(cleaned);

    return NextResponse.json({ success: true, data: generated });
  } catch (err: any) {
    console.error("AI generate error:", err);
    return NextResponse.json({ error: err.message ?? "AI generation failed" }, { status: 500 });
  }
}
