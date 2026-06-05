import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
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

  const systemPrompt = `You are an expert at analyzing software project screenshots and generating compelling portfolio case study content for a web development agency.
Respond ONLY with valid JSON — no markdown fences, no extra text.`;

  const userPrompt = `Analyze this project screenshot and generate comprehensive portfolio metadata.
${context ? `Additional context from the user: "${context}"` : ""}

Return a JSON object with exactly these fields:
{
  "title": "Short project name (2-5 words)",
  "description": "1-2 sentence compelling description focusing on the business value and scale. Make it impressive.",
  "content": "3-4 sentences of detailed content for the case study page. Include technical architecture, key features, and what makes it stand out.",
  "category": "Primary tech stack label, e.g.: React Native & Node.js, Next.js & Microservices, MERN Stack, Node.js Backend & AWS, FastAPI & AI, React.js Frontend, Flutter & Firebase",
  "slug": "url-friendly-slug-from-title",
  "accent": "One of: from-teal-400 to-emerald-400, from-cyan-400 to-blue-500, from-sky-400 to-blue-500, from-orange-400 to-red-500, from-purple-400 to-indigo-500, from-pink-400 to-rose-500, from-lime-400 to-green-500, from-fuchsia-400 to-purple-500, from-yellow-400 to-orange-500",
  "featured": true,
  "problem": "1-2 sentences describing the specific challenge or pain point this project solved. Be concrete.",
  "solution": "1-2 sentences describing the technical approach, architecture decisions, and key implementation details.",
  "result": "1-2 sentences describing the measurable outcomes, impact, or success metrics achieved.",
  "tags": ["Tag1", "Tag2", "Tag3", "Tag4"],
  "techstack": [
    {"icon": "Code2", "name": "Primary Framework"},
    {"icon": "Server", "name": "Backend Technology"}
  ],
  "stats": {
    "Metric Name": "Value (e.g. 99.9%)",
    "Second Metric": "Value",
    "Third Metric": "Value"
  },
  "confidence": "high | medium | low"
}

Rules for techstack icon field — use ONLY these exact values: Code2, Server, Database, Cpu, Monitor, Smartphone, Cloud, Zap, CreditCard, MapPin, ShieldCheck, Activity, Layout, Navigation.
Rules for stats — use 2-4 meaningful key-value pairs that showcase project impact. Use real metrics if visible, otherwise use qualitative values like "Bank-grade", "Real-time", "Multi-vendor".
Rules for tags — include 3-6 relevant technology and domain tags.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 800,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [imageContent, { type: "text", text: userPrompt }],
        },
      ],
    });

    const raw     = response.choices[0].message.content ?? "{}";
    const cleaned = raw.replace(/```json\n?|```/g, "").trim();
    const generated = JSON.parse(cleaned);

    return NextResponse.json({ success: true, data: generated });
  } catch (err: any) {
    console.error("AI generate error:", err);
    return NextResponse.json({ error: err.message ?? "AI generation failed" }, { status: 500 });
  }
}
