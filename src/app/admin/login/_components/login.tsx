"use client"
import Logo from "@/components/global/logo";

import { Lock } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/client";
export const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Backend Integration: Supabase Auth
    const { error: authError, data } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
    } else {
      router.push('/admin/dashboard');
      setLoading(false);
      onLogin();
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl p-8">
        <div className="flex justify-center mb-8"><Logo /></div>
        <h2 className="text-xl font-bold text-white mb-6 text-center">System Access</h2>
        {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 uppercase block mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-black border border-white/10 rounded p-3 text-white focus:border-teal-500 outline-none" placeholder="admin@devorax.com" />
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase block mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-black border border-white/10 rounded p-3 text-white focus:border-teal-500 outline-none" placeholder="••••••••" />
          </div>
          <button disabled={loading} className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 rounded transition-colors flex items-center justify-center gap-2 cursor-pointer ">
            {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin cursor-pointer" /> : <Lock className="w-4 h-4 cursor-pointer" />}
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
        <p className="text-center text-xs text-gray-600 mt-4">Hint: admin@devorax.com / admin</p>
      </div>
    </div>
  );
};