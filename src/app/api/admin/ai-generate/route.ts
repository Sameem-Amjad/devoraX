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

  // This prompt used to ask for descriptions that were "impressive", results with
  // "measurable outcomes ... or success metrics", and stats with "real metrics if
  // visible" or labels like "Bank-grade". Numbers visible in a screenshot are
  // usually demo data, and that is how a demo dashboard's sample revenue became a
  // published "result". The portfolio now publishes only figures a reader can
  // check (claims ledger, Oct 2026), so the model is told not to produce any.
  const systemPrompt = `You analyze software project screenshots and draft plain, factual portfolio entries for a two-person software studio.
Describe only what the screenshot and the user's context show. Never invent or copy usage, revenue, uptime, rating, satisfaction or growth figures: numbers inside a screenshot are usually demo data. Never claim who the client was or who built it; the admin adds that.
Respond ONLY with valid JSON — no markdown fences, no extra text.`;

  const userPrompt = `Analyze this project screenshot and generate comprehensive portfolio metadata.
${context ? `Additional context from the user: "${context}"` : ""}

Return a JSON object with exactly these fields:
{
  "title": "Short project name (2-5 words)",
  "description": "1-2 plain sentences: what the product is and who uses it. No figures, no superlatives.",
  "content": "3-4 sentences of detailed content for the case study page. Include technical architecture, key features, and what makes it stand out.",
  "category": "Primary tech stack label, e.g.: React Native & Node.js, Next.js & Microservices, MERN Stack, Node.js Backend & AWS, FastAPI & AI, React.js Frontend, Flutter & Firebase",
  "slug": "url-friendly-slug-from-title",
  "accent": "One of: from-teal-400 to-emerald-400, from-cyan-400 to-blue-500, from-sky-400 to-blue-500, from-orange-400 to-red-500, from-purple-400 to-indigo-500, from-pink-400 to-rose-500, from-lime-400 to-green-500, from-fuchsia-400 to-purple-500, from-yellow-400 to-orange-500",
  "featured": true,
  "problem": "1-2 sentences describing the specific challenge or pain point this project solved. Be concrete.",
  "solution": "1-2 sentences describing the technical approach, architecture decisions, and key implementation details.",
  "result": "1 sentence on where the product can be seen (live site, store listing or demo build) if the context says so; otherwise \"Not confirmed yet\". Never an outcome or metric.",
  "tags": ["Tag1", "Tag2", "Tag3", "Tag4"],
  "techstack": [
    {"icon": "Code2", "name": "Primary Framework"},
    {"icon": "Server", "name": "Backend Technology"}
  ],
  "stats": {
    "Fact Name": "Value (e.g. Platform: iOS & Android)",
    "Second Fact": "Value",
    "Third Fact": "Value"
  },
  "confidence": "high | medium | low"
}

Rules for techstack icon field — use ONLY these exact values: Code2, Server, Database, Cpu, Monitor, Smartphone, Cloud, Zap, CreditCard, MapPin, ShieldCheck, Activity, Layout, Navigation.
Rules for stats — use 2-4 short key-value facts about the build: framework, backend, platform, payments provider, "Real-time", "Multi-vendor". Never usage, revenue, uptime, rating or satisfaction numbers, and never security or compliance labels such as "Bank-grade", "ISO 27001" or "HIPAA".
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
