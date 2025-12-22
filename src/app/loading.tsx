"use client";

export default function Loading() {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Grid Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

            {/* Spinner */}
            <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-teal-500 animate-spin" />
                    <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-cyan-500 animate-spin [animation-direction:reverse]" />
                    <div className="absolute inset-0 rounded-full bg-teal-500/10 blur-xl animate-pulse" />
                </div>

                <div className="flex flex-col items-center">
                    <span className="text-teal-400 font-mono text-sm tracking-[0.2em] animate-pulse">
                        INITIALIZING
                    </span>
                </div>
            </div>
        </div>
    );
}