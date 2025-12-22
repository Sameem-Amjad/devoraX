"use client";

import { Inter } from 'next/font/google';
import { Zap } from 'lucide-react';

// You generally want to define fonts here again since layout is bypassed
const inter = Inter({ subsets: ['latin'] });

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="en">
            <body className={`${inter.className} bg-black text-white min-h-screen flex items-center justify-center`}>
                <div className="max-w-lg w-full p-8 text-center">
                    <div className="flex justify-center mb-6">
                        <Zap className="w-12 h-12 text-teal-400" />
                    </div>

                    <h1 className="text-4xl font-bold mb-4">Critical System Failure</h1>
                    <p className="text-gray-400 mb-8">
                        A critical error has occurred in the application root. Please reload or try again later.
                    </p>

                    <button
                        onClick={() => reset()}
                        className="px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-black font-bold rounded-lg hover:opacity-90 transition-opacity"
                    >
                        Reboot System
                    </button>
                </div>
            </body>
        </html>
    );
}