import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "./sectionHeading";

/**
 * The stack, once, and after the work.
 *
 * The homepage opened its second screen with a 24-item technology marquee and
 * followed it with a 36-tool "toolbox" grid, both ahead of any project. A
 * buyer weighs what was shipped before what it was shipped with, so this is
 * one compact table near the end of the page.
 *
 * Every tool the toolbox and the marquee listed is here, under the toolbox's
 * own names and groups (owner decision, 10 Nov 2026: no tool is dropped).
 * Added to them are the tools the portfolio's own project rows name that
 * neither list had: NestJS, Express, Socket.IO, Angular, Firebase,
 * Elasticsearch, Stripe, Sharetribe, Twilio, Gemini, Deepgram and MediaPipe.
 */
const STACK: { group: string; tools: string[] }[] = [
  {
    group: "AI & Intelligence",
    tools: [
      "OpenAI GPT-4o",
      "Claude API",
      "LangChain",
      "Hugging Face",
      "Pinecone",
      "LlamaIndex",
      "Gemini",
      "Deepgram",
      "MediaPipe",
    ],
  },
  {
    group: "Frontend & Mobile",
    tools: ["Next.js 15", "React 19", "React Native", "Flutter", "TypeScript", "Angular", "Framer Motion"],
  },
  {
    group: "Backend & APIs",
    tools: ["Node.js", "NestJS", "Express", "Python", "FastAPI", "GraphQL", "tRPC", "Prisma ORM", "Socket.IO"],
  },
  {
    group: "Cloud & DevOps",
    tools: ["AWS", "Docker", "Kubernetes", "Terraform", "GitHub Actions", "Vercel"],
  },
  {
    group: "Databases & Storage",
    tools: ["PostgreSQL", "MongoDB", "Redis", "Supabase", "Firebase", "Elasticsearch", "Weaviate", "S3 / R2"],
  },
  { group: "Payments & Platforms", tools: ["Stripe", "Sharetribe", "Twilio"] },
  {
    group: "Design & UI",
    tools: ["Figma", "Tailwind CSS", "shadcn/ui", "Radix UI", "Lucide Icons", "Storybook"],
  },
];

export const StackSection = () => {
  return (
    <section id="tools" aria-labelledby="stack-heading" className="scroll-mt-24 border-b border-rule bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading index="07" label="Stack" headingId="stack-heading" title="Tools we use">
          <p>The tools we use at each layer of a product, from AI inference to the interface.</p>
        </SectionHeading>

        <Reveal>
          <dl className="border-t border-rule">
            {STACK.map((row) => (
              <div key={row.group} className="grid gap-2 border-b border-rule py-5 md:grid-cols-[14rem_1fr] md:gap-8">
                <dt className="font-mono text-xs uppercase tracking-[0.18em] text-paper-faint md:pt-1.5">{row.group}</dt>
                <dd className="flex flex-wrap gap-x-6 gap-y-1 font-display text-lg text-paper md:text-xl">
                  {row.tools.map((tool) => (
                    <span key={tool}>{tool}</span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
};
