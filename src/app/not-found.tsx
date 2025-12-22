import Link from 'next/link';
import { Terminal, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Decorative Blur */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-900/20 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 text-center max-w-2xl">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#0a0a0a] border border-white/10 mb-8">
                    <Terminal className="w-10 h-10 text-teal-500" />
                </div>

                <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 tracking-tighter">
                    4<span className="text-teal-500">0</span>4
                </h1>

                <h2 className="text-2xl font-bold text-gray-200 mb-4">Page Lost in Cyberspace</h2>
                <p className="text-gray-400 mb-10 text-lg">
                    The requested resource could not be found. It might have been moved, deleted, or never existed in this dimension.
                </p>

                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-teal-400 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" /> Return to Safety
                </Link>
            </div>

            <div className="absolute bottom-10 text-gray-600 font-mono text-xs">
                ERR_NOT_FOUND // DEVORA_SYSTEMS
            </div>
        </div>
    );
}