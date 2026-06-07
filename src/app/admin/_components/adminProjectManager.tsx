"use client";
import {
  Plus, Trash2, Sparkles, Upload, X, Loader2, ExternalLink,
  Pencil, Search, AlertTriangle, Star, Globe,
  Code2, Server, Database, Cpu, Monitor, Smartphone, Cloud,
  Zap, CreditCard, MapPin, ShieldCheck, Activity, Layout, Navigation,
} from "lucide-react";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TechItem { icon: string; name: string; }
interface StatItem { key: string; value: string; }

interface AdminProjectsManagerProps {
  projects: any[];
  onDelete: (id: number) => void;
  onAdd: (project: any) => Promise<boolean>;
  onUpdate: (id: number, project: any) => Promise<boolean>;
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const ICON_MAP: Record<string, any> = {
  Code2, Server, Database, Cpu, Monitor, Smartphone, Cloud,
  Zap, CreditCard, MapPin, ShieldCheck, Activity, Layout, Navigation,
};

const ICON_OPTIONS = [
  { label: "Code",       value: "Code2"       },
  { label: "Server",     value: "Server"      },
  { label: "Database",   value: "Database"    },
  { label: "CPU / AI",   value: "Cpu"         },
  { label: "Monitor",    value: "Monitor"     },
  { label: "Mobile",     value: "Smartphone"  },
  { label: "Cloud",      value: "Cloud"       },
  { label: "Realtime",   value: "Zap"         },
  { label: "Payments",   value: "CreditCard"  },
  { label: "Location",   value: "MapPin"      },
  { label: "Security",   value: "ShieldCheck" },
  { label: "Analytics",  value: "Activity"    },
  { label: "Layout",     value: "Layout"      },
  { label: "Navigation", value: "Navigation"  },
];

const ACCENT_OPTIONS = [
  { label: "Teal",    value: "from-teal-400 to-emerald-400"   },
  { label: "Cyan",    value: "from-cyan-400 to-blue-500"      },
  { label: "Sky",     value: "from-sky-400 to-blue-500"       },
  { label: "Emerald", value: "from-emerald-400 to-teal-500"   },
  { label: "Green",   value: "from-green-400 to-emerald-500"  },
  { label: "Lime",    value: "from-lime-400 to-green-500"     },
  { label: "Orange",  value: "from-orange-400 to-red-500"     },
  { label: "Amber",   value: "from-orange-500 to-amber-600"   },
  { label: "Yellow",  value: "from-yellow-400 to-orange-500"  },
  { label: "Purple",  value: "from-purple-400 to-indigo-500"  },
  { label: "Violet",  value: "from-violet-500 to-purple-600"  },
  { label: "Fuchsia", value: "from-fuchsia-400 to-purple-500" },
  { label: "Pink",    value: "from-pink-400 to-rose-500"      },
  { label: "Rose",    value: "from-rose-500 to-pink-600"      },
  { label: "Indigo",  value: "from-indigo-500 to-blue-600"    },
];

const EMPTY_FORM = {
  title:       "",
  category:    "",
  description: "",
  content:     "",
  slug:        "",
  accent:      "from-teal-400 to-emerald-400",
  image:       "",
  featured:    false,
  web:         "",
  android:     "",
  ios:         "",
  problem:     "",
  solution:    "",
  result:      "",
  tags:        "",
  techstack:   [] as TechItem[],
  stats:       [{ key: "", value: "" }] as StatItem[],
  service_id:  "",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const safeField = (val: any): string =>
  !val || val === "null" || val === '""' ? "" : String(val);

const safeParse = <T,>(val: any, fallback: T): T => {
  if (!val || val === "null" || val === '""') return fallback;
  if (typeof val === "string") {
    try { return JSON.parse(val); } catch { return fallback; }
  }
  return val as T;
};

const isValidImage = (url: string) =>
  !!url && url !== "null" && url !== '""' && url.startsWith("http");

// ─── Component ────────────────────────────────────────────────────────────────

export const AdminProjectsManager = ({ projects, onDelete, onAdd, onUpdate }: AdminProjectsManagerProps) => {
  const [isFormOpen,      setIsFormOpen]    = useState(false);
  const [editProject,     setEditProject]   = useState<any | null>(null);
  const [form,            setForm]          = useState(EMPTY_FORM);
  const [imagePreview,    setImagePreview]  = useState<string | null>(null);
  const [aiContext,       setAiContext]     = useState("");
  const [isGenerating,    setIsGenerating]  = useState(false);
  const [isUploading,     setIsUploading]   = useState(false);
  const [isSaving,        setIsSaving]      = useState(false);
  const [aiError,         setAiError]       = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDelete] = useState<number | null>(null);
  const [search,          setSearch]        = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Derived ──────────────────────────────────────────────────────────────

  const filtered = projects.filter(
    (p) => !search ||
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase())
  );

  // ── Form helpers ─────────────────────────────────────────────────────────

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setImagePreview(null);
    setAiContext("");
    setAiError(null);
    setEditProject(null);
  };

  const openAdd = () => { resetForm(); setIsFormOpen(true); };

  const openEdit = (project: any) => {
    setEditProject(project);

    const tags      = safeParse<string[]>(project.tags, []);
    const techstack = safeParse<TechItem[]>(project.techstack, []);
    const statsObj  = safeParse<Record<string, string>>(project.stats, {});
    const statsArr: StatItem[] = Object.entries(statsObj).map(([key, value]) => ({ key, value: String(value) }));

    setForm({
      title:       project.title       ?? "",
      category:    project.category    ?? "",
      description: project.description ?? "",
      content:     project.content     ?? "",
      slug:        project.slug        ?? "",
      accent:      project.accent      ?? "from-teal-400 to-emerald-400",
      image:       safeField(project.image),
      featured:    project.featured    ?? false,
      web:         safeField(project.web),
      android:     safeField(project.android),
      ios:         safeField(project.ios),
      problem:     project.problem     ?? "",
      solution:    project.solution    ?? "",
      result:      project.result      ?? "",
      tags:        Array.isArray(tags) ? tags.join(", ") : "",
      techstack:   Array.isArray(techstack) ? techstack : [],
      stats:       statsArr.length > 0 ? statsArr : [{ key: "", value: "" }],
      service_id:  project.service_id?.toString() ?? "",
    });
    setImagePreview(isValidImage(project.image) ? project.image : null);
    setAiError(null);
    setAiContext("");
    setIsFormOpen(true);
  };

  const handleCancel = () => { setIsFormOpen(false); resetForm(); };

  // ── Tech stack helpers ───────────────────────────────────────────────────

  const addTechItem    = () => setForm(f => ({ ...f, techstack: [...f.techstack, { icon: "Code2", name: "" }] }));
  const removeTechItem = (i: number) => setForm(f => ({ ...f, techstack: f.techstack.filter((_, idx) => idx !== i) }));
  const updateTechItem = (i: number, field: "icon" | "name", val: string) =>
    setForm(f => ({ ...f, techstack: f.techstack.map((item, idx) => idx === i ? { ...item, [field]: val } : item) }));

  // ── Stats helpers ─────────────────────────────────────────────────────────

  const addStat    = () => setForm(f => ({ ...f, stats: [...f.stats, { key: "", value: "" }] }));
  const removeStat = (i: number) => setForm(f => ({ ...f, stats: f.stats.filter((_, idx) => idx !== i) }));
  const updateStat = (i: number, field: "key" | "value", val: string) =>
    setForm(f => ({ ...f, stats: f.stats.map((item, idx) => idx === i ? { ...item, [field]: val } : item) }));

  // ── Image upload ─────────────────────────────────────────────────────────

  const handleImageFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);

    setIsUploading(true);
    setAiError(null);
    const fd = new FormData();
    fd.append("file", file);
    if (form.title) fd.append("projectName", form.title.toLowerCase().replace(/\s+/g, "-"));

    try {
      const res  = await fetch("/api/admin/upload-image", { method: "POST", body: fd });
      const text = await res.text();
      const json = text ? JSON.parse(text) : {};
      if (!res.ok) throw new Error(json.error ?? `Upload failed (${res.status})`);
      setForm((prev) => ({ ...prev, image: json.url }));
    } catch (err: any) {
      setAiError(`Image upload failed: ${err.message}`);
      setImagePreview(null);
      setForm((prev) => ({ ...prev, image: "" }));
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleImageFile(file);
  };

  // ── AI generate ──────────────────────────────────────────────────────────

  const handleAiGenerate = async () => {
    if (!form.image) { setAiError("Upload an image first."); return; }
    setIsGenerating(true);
    setAiError(null);
    try {
      const res  = await fetch("/api/admin/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: form.image, context: aiContext }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Generation failed");
      const d = json.data;

      const aiStats: StatItem[] | null =
        d.stats && typeof d.stats === "object"
          ? Object.entries(d.stats).map(([key, value]) => ({ key, value: String(value) }))
          : null;

      setForm((prev) => ({
        ...prev,
        title:       d.title       ?? prev.title,
        description: d.description ?? prev.description,
        content:     d.content     ?? prev.content,
        category:    d.category    ?? prev.category,
        slug:        d.slug        ?? prev.slug,
        accent:      d.accent      ?? prev.accent,
        featured:    d.featured    ?? prev.featured,
        problem:     d.problem     ?? prev.problem,
        solution:    d.solution    ?? prev.solution,
        result:      d.result      ?? prev.result,
        tags:        Array.isArray(d.tags) ? d.tags.join(", ") : prev.tags,
        techstack:   Array.isArray(d.techstack) ? d.techstack : prev.techstack,
        stats:       aiStats ?? prev.stats,
      }));
    } catch (err: any) {
      setAiError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // ── Submit ───────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const tagsArr  = form.tags.split(",").map(t => t.trim()).filter(Boolean);
    const techArr  = form.techstack.filter(t => t.name.trim());
    const statsObj: Record<string, string> = {};
    form.stats.forEach(({ key, value }) => { if (key.trim()) statsObj[key.trim()] = value; });

    const project = {
      title:       form.title,
      category:    form.category,
      description: form.description,
      content:     form.content     || null,
      slug:        form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      accent:      form.accent,
      image:       form.image       || null,
      featured:    form.featured,
      web:         form.web         || null,
      android:     form.android     || null,
      ios:         form.ios         || null,
      problem:     form.problem     || null,
      solution:    form.solution    || null,
      result:      form.result      || null,
      tags:        tagsArr.length  > 0 ? tagsArr  : null,
      techstack:   techArr.length  > 0 ? techArr  : null,
      stats:       Object.keys(statsObj).length > 0 ? statsObj : null,
      ...(form.service_id ? { service_id: form.service_id } : {}),
    };

    const success = editProject
      ? await onUpdate(editProject.id, project)
      : await onAdd(project);

    setIsSaving(false);
    if (success) { setIsFormOpen(false); resetForm(); }
  };

  // ── Delete helpers ───────────────────────────────────────────────────────

  const handleDeleteConfirm = () => {
    if (confirmDeleteId !== null) { onDelete(confirmDeleteId); setConfirmDelete(null); }
  };

  const formatDate = (raw: string) =>
    raw ? new Date(raw).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

  // ─────────────────────────────────────────────────────────────────────────

  const SectionHeader = ({ title }: { title: string }) => (
    <div className="flex items-center gap-3 border-t border-white/5 pt-6">
      <span className="inline-block w-0.5 h-4 bg-teal-500 rounded-full flex-shrink-0" />
      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</h4>
    </div>
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Project Management</h2>
          <p className="text-gray-500 text-sm mt-1">
            {projects.length} project{projects.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 px-4 py-2 rounded-lg text-white font-bold transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        <input
          type="text"
          placeholder="Search by title or category…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#0a0a0a] border border-white/10 pl-9 pr-4 py-2.5 rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-teal-500/50"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Add / Edit Form */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden"
          >
            <div className="flex justify-between items-center px-6 py-4 border-b border-white/5">
              <h3 className="font-bold text-white text-lg">
                {editProject ? "Edit Project" : "New Project"}
              </h3>
              <button onClick={handleCancel} className="text-gray-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">

              {/* ── Image + AI ── */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Project Image</label>
                  <div
                    className="relative h-52 rounded-xl border-2 border-dashed border-white/10 hover:border-teal-500/40 transition-colors cursor-pointer bg-[#111] overflow-hidden group"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleFileDrop}
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                  >
                    {imagePreview ? (
                      <>
                        <Image src={imagePreview} alt="preview" fill className="object-cover" unoptimized />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-sm font-medium">Change image</span>
                        </div>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gray-500">
                        <Upload className="w-8 h-8" />
                        <span className="text-sm">Drop image or click to browse</span>
                      </div>
                    )}
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageFile(file);
                        e.target.value = "";
                      }}
                    />
                  </div>
                  <input
                    type="url"
                    placeholder="…or paste an image URL"
                    className="mt-2 w-full bg-black border border-white/10 px-3 py-2 rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-teal-500/50"
                    value={isValidImage(form.image) ? form.image : ""}
                    onChange={(e) => {
                      setImagePreview(e.target.value || null);
                      setForm((prev) => ({ ...prev, image: e.target.value }));
                    }}
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-xs text-gray-400 uppercase tracking-wider">AI Content Generator</label>
                  <div className="bg-[#0d1117] border border-teal-500/20 rounded-xl p-4 flex flex-col gap-3 flex-1">
                    <p className="text-gray-400 text-xs leading-relaxed">
                      Upload a screenshot, add optional context, then let AI generate all fields — title, descriptions, problem/solution/result, tags, tech stack, stats, and more.
                    </p>
                    <textarea
                      rows={3}
                      placeholder="Optional: e.g. 'E-commerce app for fashion brands built with Next.js and Stripe'"
                      className="w-full bg-black border border-white/10 px-3 py-2 rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-teal-500/50 resize-none"
                      value={aiContext}
                      onChange={(e) => setAiContext(e.target.value)}
                    />
                    {aiError && <p className="text-red-400 text-xs">{aiError}</p>}
                    <button
                      type="button"
                      onClick={handleAiGenerate}
                      disabled={isGenerating || isUploading || !form.image}
                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 disabled:opacity-50 px-4 py-2.5 rounded-lg text-white text-sm font-bold transition-all"
                    >
                      {isGenerating
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating all fields…</>
                        : <><Sparkles className="w-4 h-4" /> Generate with AI</>
                      }
                    </button>
                  </div>
                </div>
              </div>

              {/* ── Core Details ── */}
              <SectionHeader title="Core Details" />
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Title *</label>
                  <input
                    required
                    placeholder="e.g. FitTrack Pro"
                    className="w-full bg-black border border-white/10 px-3 py-2.5 rounded-lg text-white focus:outline-none focus:border-teal-500/50"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Category *</label>
                  <input
                    required
                    placeholder="e.g. React Native & Node.js"
                    className="w-full bg-black border border-white/10 px-3 py-2.5 rounded-lg text-white focus:outline-none focus:border-teal-500/50"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Slug</label>
                  <input
                    placeholder="url-friendly-slug"
                    className="w-full bg-black border border-white/10 px-3 py-2.5 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-teal-500/50"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Service ID</label>
                  <input
                    placeholder="linked service ID (optional)"
                    className="w-full bg-black border border-white/10 px-3 py-2.5 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-teal-500/50"
                    value={form.service_id}
                    onChange={(e) => setForm({ ...form, service_id: e.target.value })}
                  />
                </div>
              </div>

              {/* Featured + Accent */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <div
                    onClick={() => setForm(f => ({ ...f, featured: !f.featured }))}
                    className={`relative w-10 h-5 rounded-full transition-colors ${form.featured ? "bg-teal-500" : "bg-white/10"}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${form.featured ? "translate-x-5" : "translate-x-0.5"}`} />
                  </div>
                  <span className="text-sm text-gray-300 flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-400" /> Featured on homepage
                  </span>
                </label>

                <div className="flex items-center gap-3 flex-1">
                  <span className="text-xs text-gray-400 uppercase tracking-wider whitespace-nowrap">Accent Color</span>
                  <div className="flex gap-2 flex-wrap">
                    {ACCENT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        title={opt.label}
                        onClick={() => setForm({ ...form, accent: opt.value })}
                        className={`w-6 h-6 rounded-full bg-gradient-to-br ${opt.value} ring-2 ring-offset-2 ring-offset-black transition-all ${
                          form.accent === opt.value ? "ring-white scale-110" : "ring-transparent"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Descriptions ── */}
              <SectionHeader title="Descriptions" />
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Short Description * <span className="normal-case text-gray-600">(shown on project cards)</span></label>
                  <textarea
                    required
                    rows={2}
                    placeholder="1-2 sentence compelling summary of the project…"
                    className="w-full bg-black border border-white/10 px-3 py-2.5 rounded-lg text-white focus:outline-none focus:border-teal-500/50 resize-none"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Detailed Content <span className="normal-case text-gray-600">(shown on project detail page)</span></label>
                  <textarea
                    rows={4}
                    placeholder="3-4 sentences with technical depth — architecture, approach, key features…"
                    className="w-full bg-black border border-white/10 px-3 py-2.5 rounded-lg text-white focus:outline-none focus:border-teal-500/50 resize-none"
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                  />
                </div>
              </div>

              {/* ── Challenge & Results ── */}
              <SectionHeader title="Challenge & Results" />
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-amber-400" /> The Challenge / Problem
                  </label>
                  <textarea
                    rows={2}
                    placeholder="What specific problem or pain point did this project solve?"
                    className="w-full bg-black border border-white/10 px-3 py-2.5 rounded-lg text-white focus:outline-none focus:border-teal-500/50 resize-none"
                    value={form.problem}
                    onChange={(e) => setForm({ ...form, problem: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-400" /> Our Solution
                  </label>
                  <textarea
                    rows={2}
                    placeholder="What technical approach and key implementation decisions were made?"
                    className="w-full bg-black border border-white/10 px-3 py-2.5 rounded-lg text-white focus:outline-none focus:border-teal-500/50 resize-none"
                    value={form.solution}
                    onChange={(e) => setForm({ ...form, solution: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-teal-400" /> The Result
                  </label>
                  <textarea
                    rows={2}
                    placeholder="What measurable outcomes or impact did the project achieve?"
                    className="w-full bg-black border border-white/10 px-3 py-2.5 rounded-lg text-white focus:outline-none focus:border-teal-500/50 resize-none"
                    value={form.result}
                    onChange={(e) => setForm({ ...form, result: e.target.value })}
                  />
                </div>
              </div>

              {/* ── Platform Links ── */}
              <SectionHeader title="Platform Links" />
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block flex items-center gap-1.5">
                    <Globe className="w-3 h-3" /> Website URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com"
                    className="w-full bg-black border border-white/10 px-3 py-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-teal-500/50"
                    value={form.web}
                    onChange={(e) => setForm({ ...form, web: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block flex items-center gap-1.5">
                    <Smartphone className="w-3 h-3 text-green-400" /> Android URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://play.google.com/…"
                    className="w-full bg-black border border-white/10 px-3 py-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-teal-500/50"
                    value={form.android}
                    onChange={(e) => setForm({ ...form, android: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block flex items-center gap-1.5">
                    <Smartphone className="w-3 h-3 text-blue-400" /> iOS URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://apps.apple.com/…"
                    className="w-full bg-black border border-white/10 px-3 py-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-teal-500/50"
                    value={form.ios}
                    onChange={(e) => setForm({ ...form, ios: e.target.value })}
                  />
                </div>
              </div>

              {/* ── Tags ── */}
              <SectionHeader title="Tags" />
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Tags <span className="normal-case text-gray-600">(comma-separated)</span></label>
                <input
                  placeholder="React Native, Node.js, AWS, FinTech"
                  className="w-full bg-black border border-white/10 px-3 py-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-teal-500/50"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                />
                {form.tags && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {form.tags.split(",").map(t => t.trim()).filter(Boolean).map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-mono">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Tech Stack ── */}
              <SectionHeader title="Tech Stack" />
              <div className="space-y-2">
                {form.techstack.map((item, i) => {
                  const Icon = ICON_MAP[item.icon] ?? Code2;
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex-shrink-0">
                        <Icon className="w-4 h-4 text-teal-400" />
                      </div>
                      <select
                        value={item.icon}
                        onChange={(e) => updateTechItem(i, "icon", e.target.value)}
                        className="bg-black border border-white/10 px-2 py-2 rounded-lg text-white text-sm focus:outline-none focus:border-teal-500/50 flex-shrink-0"
                      >
                        {ICON_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <input
                        placeholder="Technology name (e.g. React Native)"
                        className="flex-1 bg-black border border-white/10 px-3 py-2 rounded-lg text-white text-sm focus:outline-none focus:border-teal-500/50"
                        value={item.name}
                        onChange={(e) => updateTechItem(i, "name", e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => removeTechItem(i)}
                        className="p-2 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
                <button
                  type="button"
                  onClick={addTechItem}
                  className="flex items-center gap-2 text-teal-400 hover:text-teal-300 text-sm transition-colors mt-1"
                >
                  <Plus className="w-4 h-4" /> Add technology
                </button>
              </div>

              {/* ── Project Stats ── */}
              <SectionHeader title="Project Stats" />
              <div className="space-y-2">
                {form.stats.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      placeholder="Key (e.g. Uptime)"
                      className="w-36 bg-black border border-white/10 px-3 py-2 rounded-lg text-white text-sm focus:outline-none focus:border-teal-500/50 flex-shrink-0"
                      value={item.key}
                      onChange={(e) => updateStat(i, "key", e.target.value)}
                    />
                    <input
                      placeholder="Value (e.g. 99.9%)"
                      className="flex-1 bg-black border border-white/10 px-3 py-2 rounded-lg text-white text-sm focus:outline-none focus:border-teal-500/50"
                      value={item.value}
                      onChange={(e) => updateStat(i, "value", e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => removeStat(i)}
                      className="p-2 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addStat}
                  className="flex items-center gap-2 text-teal-400 hover:text-teal-300 text-sm transition-colors mt-1"
                >
                  <Plus className="w-4 h-4" /> Add stat
                </button>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2 border-t border-white/5">
                <button type="button" onClick={handleCancel} className="px-5 py-2 text-gray-400 hover:text-white transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isUploading}
                  className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 px-6 py-2 rounded-lg text-white font-bold transition-colors"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editProject ? "Save Changes" : "Save Project"}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Projects Table */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 w-16">Image</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3 hidden lg:table-cell">Category</th>
                <th className="px-4 py-3 hidden md:table-cell">Featured</th>
                <th className="px-4 py-3 hidden xl:table-cell">Slug</th>
                <th className="px-4 py-3 hidden lg:table-cell">Created</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-gray-600">
                    {search ? "No projects match your search." : "No projects yet. Add your first one above."}
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="w-12 h-9 rounded-lg overflow-hidden bg-[#111] relative flex-shrink-0">
                        {isValidImage(p.image) ? (
                          <Image src={p.image} alt={p.title} fill className="object-cover" sizes="48px" unoptimized />
                        ) : (
                          <div className={`absolute inset-0 bg-gradient-to-br ${p.accent || "from-teal-400 to-emerald-400"} opacity-60`} />
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-semibold text-white group-hover:text-teal-400 transition-colors">{p.title}</div>
                      <div className="text-gray-500 text-xs mt-0.5 line-clamp-1 max-w-xs">{p.description}</div>
                    </td>

                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-300 text-xs font-mono">
                        {p.category}
                      </span>
                    </td>

                    <td className="px-4 py-3 hidden md:table-cell">
                      {p.featured ? (
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      ) : (
                        <span className="text-gray-700 text-xs">—</span>
                      )}
                    </td>

                    <td className="px-4 py-3 hidden xl:table-cell text-gray-500 font-mono text-xs">
                      {p.slug || "—"}
                    </td>

                    <td className="px-4 py-3 hidden lg:table-cell text-gray-500 text-xs">
                      {formatDate(p.created_at)}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <a
                          href={`/projects/${p.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded transition-colors"
                          title="View project"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => openEdit(p)}
                          className="p-1.5 text-gray-500 hover:text-teal-400 hover:bg-teal-500/10 rounded transition-colors"
                          title="Edit project"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(p.id)}
                          className="p-1.5 text-red-500/60 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                          title="Delete project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {confirmDeleteId !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setConfirmDelete(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0a0a0a] border border-red-500/20 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="font-bold text-white">Delete Project</h3>
              </div>
              <p className="text-gray-400 text-sm mb-6">
                This will permanently delete the project and all its data. This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-500 px-5 py-2 rounded-lg text-white font-bold text-sm transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
