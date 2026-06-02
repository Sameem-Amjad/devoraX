"use client";

export const FluidBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* Blob 1 — top left, slow drift */}
      <div className="fluid-blob fluid-blob-1 absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(20,184,166,0.07) 0%, transparent 70%)" }}
      />
      {/* Blob 2 — top right, medium drift */}
      <div className="fluid-blob fluid-blob-2 absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)" }}
      />
      {/* Blob 3 — bottom center, fast drift */}
      <div className="fluid-blob fluid-blob-3 absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)" }}
      />
    </div>
  );
};
