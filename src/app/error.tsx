'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 border border-red-500/20">
                <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>

            <h2 className="text-3xl font-bold text-white mb-3">System Malfunction</h2>
            <p className="text-gray-400 max-w-md mb-8">
                We encountered an unexpected error while processing your request.
                <br />
                <span className="text-xs font-mono text-gray-600 mt-2 block">
                    Error Code: {error.digest || 'UNKNOWN_ERROR'}
                </span>
            </p>

            <div className="flex gap-4">
                <button
                    onClick={reset}
                    className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-bold transition-all"
                >
                    <RefreshCw className="w-4 h-4" /> Retry Connection
                </button>
                <Link
                    href="/"
                    className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg font-bold transition-all"
                >
                    <Home className="w-4 h-4" /> Return Home
                </Link>
            </div>
        </div>
    );
}