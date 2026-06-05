"use client";
import { Eye, Plus, Trash2, Sparkles, Upload, X, Loader2, ExternalLink } from "lucide-react";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface AdminProjectsManagerProps {
  projects: any[];
  onDelete: (id: number) => void;
  onAdd: (project: any) => void;
}

const EMPTY_FORM = {
  title: "",
  category: "",
  description: "",
  slug: "",
  accent: "from-teal-500 to-emerald-600",
  image: "",
  stats_users: "",
  stats_status: "Active",
  service_id: "",
};

const ACCENT_OPTIONS = [
  { label: "Teal", value: "from-teal-500 to-emerald-600" },
  { label: "Violet", value: "from-violet-500 to-purple-600" },
  { label: "Blue", value: "from-blue-500 to-cyan-600" },
  { label: "Orange", value: "from-orange-500 to-amber-600" },
  { label: "Rose", value: "from-rose-500 to-pink-600" },
  { label: "Indigo", value: "from-indigo-500 to-blue-600" },
];

export const AdminProjectsManager = ({ projects, onDelete, onAdd }: AdminProjectsManagerProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [aiContext, setAiContext] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImagePreview(dataUrl);
      setImageBase64(dataUrl);
      // Auto-set image field to the data URL (can be replaced by upload URL later)
      setForm((prev) => ({ ...prev, image: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleImageFile(file);
  };

  const handleAiGenerate = async () => {
    if (!imageBase64 && !form.image) {
      setAiError("Upload an image first.");
      return;
    }
    setIsGenerating(true);
    setAiError(null);
    try {
      const res = await fetch("/api/admin/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: imageBase64 ?? undefined,
          imageUrl: !imageBase64 ? form.image : undefined,
          context: aiContext,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Generation failed");
      const d = json.data;
      setForm((prev) => ({
        ...prev,
        title: d.title ?? prev.title,
        description: d.description ?? prev.description,
        category: d.category ?? prev.category,
        slug: d.slug ?? prev.slug,
        accent: d.accent ?? prev.accent,
        stats_users: d.stats?.users ?? prev.stats_users,
        stats_status: d.stats?.status ?? prev.stats_status,
      }));
    } catch (err: any) {
      setAiError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const project = {
      title: form.title,
      category: form.category,
      description: form.description,
      slug: form.slug || form.title.toLowerCase().replace(/\s+/g, "-"),
      accent: form.accent,
      image: form.image || "linear-gradient(135deg, #111 0%, #333 100%)",
      stats: { users: form.stats_users || "N/A", status: form.stats_status || "Active" },
      ...(form.service_id ? { service_id: form.service_id } : {}),
    };
    onAdd(project);
    setIsAdding(false);
    setForm(EMPTY_FORM);
    setImagePreview(null);
    setImageBase64(null);
    setAiContext("");
    setIsSaving(false);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setForm(EMPTY_FORM);
    setImagePreview(null);
    setImageBase64(null);
    setAiError(null);
    setAiContext("");
  };

  const formatDate = (dateStr: string) =>
    dateStr ? new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Project Management</h2>
          <p className="text-gray-500 text-sm mt-1">{projects.length} project{projects.length !== 1 ? "s" : ""} total</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 px-4 py-2 rounded-lg text-white font-bold transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {/* Add Project Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden"
          >
            {/* Form header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-white/5">
              <h3 className="font-bold text-white text-lg">New Project</h3>
              <button onClick={handleCancel} className="text-gray-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Image Upload + AI Section */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Image Upload */}
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Project Image</label>
                  <div
                    className="relative h-52 rounded-xl border-2 border-dashed border-white/10 hover:border-teal-500/40 transition-colors cursor-pointer bg-[#111] overflow-hidden group"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleFileDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {imagePreview ? (
                      <>
                        <Image src={imagePreview} alt="preview" fill className="object-cover" />
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
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageFile(file);
                      }}
                    />
                  </div>
                  {/* Or paste URL */}
                  <input
                    type="url"
                    placeholder="…or paste an image URL"
                    className="mt-2 w-full bg-black border border-white/10 px-3 py-2 rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-teal-500/50"
                    value={imageBase64 ? "" : form.image}
                    onChange={(e) => {
                      setImageBase64(null);
                      setImagePreview(e.target.value || null);
                      setForm((prev) => ({ ...prev, image: e.target.value }));
                    }}
                  />
                </div>

                {/* AI Generation Panel */}
                <div className="flex flex-col gap-3">
                  <label className="text-xs text-gray-400 uppercase tracking-wider">AI Content Generator</label>
                  <div className="bg-[#0d1117] border border-teal-500/20 rounded-xl p-4 flex flex-col gap-3 flex-1">
                    <p className="text-gray-400 text-xs leading-relaxed">
                      Upload a screenshot above, optionally add context, then let GPT-4o generate your project title, description, category, slug, and accent color.
                    </p>
                    <textarea
                      rows={3}
                      placeholder="Optional context: e.g. 'E-commerce app for fashion brands built with Next.js'"
                      className="w-full bg-black border border-white/10 px-3 py-2 rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-teal-500/50 resize-none"
                      value={aiContext}
                      onChange={(e) => setAiContext(e.target.value)}
                    />
                    {aiError && <p className="text-red-400 text-xs">{aiError}</p>}
                    <button
                      type="button"
                      onClick={handleAiGenerate}
                      disabled={isGenerating}
                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 disabled:opacity-50 px-4 py-2.5 rounded-lg text-white text-sm font-bold transition-all"
                    >
                      {isGenerating ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</>
                      ) : (
                        <><Sparkles className="w-4 h-4" /> Generate with AI</>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Core Fields */}
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
                    placeholder="e.g. React Native"
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
                    placeholder="linked service UUID (optional)"
                    className="w-full bg-black border border-white/10 px-3 py-2.5 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-teal-500/50"
                    value={form.service_id}
                    onChange={(e) => setForm({ ...form, service_id: e.target.value })}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Compelling 1-2 sentence description of the project…"
                  className="w-full bg-black border border-white/10 px-3 py-2.5 rounded-lg text-white focus:outline-none focus:border-teal-500/50 resize-none"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              {/* Stats + Accent */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Users Stat</label>
                  <input
                    placeholder="e.g. 2,000+"
                    className="w-full bg-black border border-white/10 px-3 py-2.5 rounded-lg text-white focus:outline-none focus:border-teal-500/50"
                    value={form.stats_users}
                    onChange={(e) => setForm({ ...form, stats_users: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Status</label>
                  <select
                    className="w-full bg-black border border-white/10 px-3 py-2.5 rounded-lg text-white focus:outline-none focus:border-teal-500/50"
                    value={form.stats_status}
                    onChange={(e) => setForm({ ...form, stats_status: e.target.value })}
                  >
                    {["Active", "Completed", "In Progress", "Archived"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Accent Color</label>
                  <div className="flex gap-2 flex-wrap mt-1">
                    {ACCENT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        title={opt.label}
                        onClick={() => setForm({ ...form, accent: opt.value })}
                        className={`w-7 h-7 rounded-full bg-gradient-to-br ${opt.value} ring-2 ring-offset-2 ring-offset-black transition-all ${form.accent === opt.value ? "ring-white scale-110" : "ring-transparent"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2 border-t border-white/5">
                <button type="button" onClick={handleCancel} className="px-5 py-2 text-gray-400 hover:text-white transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 px-6 py-2 rounded-lg text-white font-bold transition-colors"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Save Project
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
                <th className="px-4 py-3 hidden xl:table-cell">Slug</th>
                <th className="px-4 py-3 hidden md:table-cell">Status</th>
                <th className="px-4 py-3 hidden xl:table-cell">Users</th>
                <th className="px-4 py-3 hidden lg:table-cell">Created</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center text-gray-600">
                    No projects yet. Add your first one above.
                  </td>
                </tr>
              ) : (
                projects.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                    {/* Thumbnail */}
                    <td className="px-4 py-3">
                      <div className="w-12 h-9 rounded-lg overflow-hidden bg-[#111] relative flex-shrink-0">
                        {p.image && !p.image.startsWith("linear-gradient") ? (
                          <Image src={p.image} alt={p.title} fill className="object-cover" sizes="48px" />
                        ) : (
                          <div className={`absolute inset-0 bg-gradient-to-br ${p.accent || "from-teal-500 to-emerald-600"} opacity-60`} />
                        )}
                      </div>
                    </td>
                    {/* Title + Description */}
                    <td className="px-4 py-3">
                      <div className="font-semibold text-white group-hover:text-teal-400 transition-colors">{p.title}</div>
                      <div className="text-gray-500 text-xs mt-0.5 line-clamp-1 max-w-xs">{p.description}</div>
                    </td>
                    {/* Category */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-300 text-xs font-mono">
                        {p.category}
                      </span>
                    </td>
                    {/* Slug */}
                    <td className="px-4 py-3 hidden xl:table-cell text-gray-500 font-mono text-xs">
                      {p.slug || "—"}
                    </td>
                    {/* Status */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                        p.stats?.status === "Active" ? "text-emerald-400" :
                        p.stats?.status === "Completed" ? "text-blue-400" :
                        p.stats?.status === "In Progress" ? "text-amber-400" :
                        "text-gray-500"
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {p.stats?.status ?? "—"}
                      </span>
                    </td>
                    {/* Users stat */}
                    <td className="px-4 py-3 hidden xl:table-cell text-gray-400 text-xs">
                      {p.stats?.users ?? "—"}
                    </td>
                    {/* Created */}
                    <td className="px-4 py-3 hidden lg:table-cell text-gray-500 text-xs">
                      {formatDate(p.created_at)}
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
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
                          onClick={() => onDelete(p.id)}
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
    </div>
  );
};
