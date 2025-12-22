"use client";
import Logo from "@/components/global/logo";
import { BarChart, Briefcase, Inbox, Layout, LogOut } from "lucide-react";
import CONSTANTS from "@/utils/constants/constants";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/client";
import { AdminProjectsManager } from "@/app/admin/_components/adminProjectManager";
import { deleteProjectAction, addProjectAction } from "@/app/admin/dashboard/_components/adminActions";
import { useRouter } from "next/navigation";

// --- Admin Dashboard ---
export const AdminDashboard = ({ initialProjects, initialInquiries, initialBookingCount }: any) => {

  const [activeTab, setActiveTab] = useState('overview'); // overview, projects, inquiries
  const [projects, setProjects] = useState(initialProjects);
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push('/admin/login');
  }

  const handleDeleteProject = async (id: number) => {
    // Optimistic Update: Remove from UI immediately
    setProjects(projects.filter((p: any) => p.id !== id));

    // Perform actual deletion on server
    const { error } = await deleteProjectAction(id.toString());
    if (error) {
      alert("Failed to delete. Reverting...");
      setProjects(initialProjects); // Rollback on error
    }
  };

  const handleAddProject = async (project: any) => {
    const { data, error } = await addProjectAction(project);
    if (data) setProjects([data[0], ...projects]);
  };

  return (
    <div className="min-h-screen bg-[#020405] text-white font-sans">
      <div className="fixed left-0 top-0 h-full w-64 bg-[#050505] border-r border-white/5 hidden md:flex flex-col">
        <div className="p-6 border-b border-white/5">
          <Logo />
          <div className="mt-4 px-2 py-1 bg-teal-500/10 rounded border border-teal-500/20 text-xs text-teal-400 font-mono text-center">ADMIN PORTAL</div>
        </div>
        <div className="p-4 space-y-2 flex-grow">
          {['Overview', 'Projects', 'Inquiries', 'Settings'].map((item, i) => (
            <button key={item} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${i === 0 ? 'bg-gradient-to-r from-teal-500/10 to-transparent border-l-2 border-teal-500 text-teal-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
              {i === 0 && <BarChart className="w-4 h-4" />}
              {i === 1 && <Briefcase className="w-4 h-4" />}
              {i === 2 && <Inbox className="w-4 h-4" />}
              {i === 3 && <Layout className="w-4 h-4" />}
              {item}
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-white/5">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      <div className="md:ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Welcome back, {CONSTANTS.CEO_NAME}</h1>
            <p className="text-gray-500 text-sm">System Status: <span className="text-emerald-400">● Online</span></p>
          </div>
          <div className="flex gap-4">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center font-bold text-white shadow-lg">SA</div>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Total Revenue', val: '$124,500', trend: '+12%', color: 'text-emerald-400', border: 'border-emerald-500/20' },
                { label: 'Active Projects', val: projects.length, trend: 'Updated just now', color: 'text-cyan-400', border: 'border-cyan-500/20' },
                { label: 'New Leads', val: initialInquiries.length, trend: '+2 today', color: 'text-teal-400', border: 'border-teal-500/20' },
              ].map((stat, i) => (
                <div key={i} className={`bg-[#080808] border ${stat.border} p-6 rounded-xl`}>
                  <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">{stat.label}</div>
                  <div className="text-3xl font-bold text-white mb-1">{stat.val}</div>
                  <div className={`text-xs ${stat.color}`}>{stat.trend}</div>
                </div>
              ))}
            </div>
            <div className="bg-[#080808] border border-white/5 rounded-xl p-6">
              <h3 className="font-bold text-white mb-4">Quick Actions</h3>
              <div className="flex gap-4">
                <button onClick={() => setActiveTab('projects')} className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg text-sm text-white">Manage Projects</button>
                <button onClick={() => setActiveTab('inquiries')} className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg text-sm text-white">View Messages</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <AdminProjectsManager projects={projects} onDelete={handleDeleteProject} onAdd={handleAddProject} />
        )}

        {activeTab === 'inquiries' && (
          <div className="bg-[#080808] border border-white/5 rounded-xl overflow-hidden">
            <div className="divide-y divide-white/5">
              {initialInquiries.map((inq: any) => (
                <div key={inq.id} className={`p-4 hover:bg-white/5 transition-colors cursor-pointer flex justify-between items-center ${!inq.read ? 'bg-teal-500/5' : ''}`}>
                  <div className="flex gap-4 items-center">
                    <div className={`w-2 h-2 rounded-full ${!inq.read ? 'bg-teal-500' : 'bg-transparent'}`} />
                    <div>
                      <div className="font-bold text-white text-sm">{inq.name} <span className="text-gray-500 font-normal text-xs ml-2">{inq.company}</span></div>
                      <div className="text-gray-400 text-sm">{inq.message}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">{inq.created_at}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Total Revenue', val: '$124,500', trend: '+12%', color: 'text-emerald-400', border: 'border-emerald-500/20' },
          { label: 'Active Projects', val: '12', trend: '3 due soon', color: 'text-cyan-400', border: 'border-cyan-500/20' },
          { label: 'New Leads', val: '28', trend: '+5 this week', color: 'text-teal-400', border: 'border-teal-500/20' },
        ].map((stat, i) => (
          <div key={i} className={`bg-[#080808] border ${stat.border} p-6 rounded-xl relative overflow-hidden group`}>
            <div className={`absolute top-0 right-0 p-20 opacity-5 rounded-full ${i === 0 ? 'bg-emerald-500' : i === 1 ? 'bg-cyan-500' : 'bg-teal-500'} blur-3xl group-hover:opacity-10 transition-opacity`} />
            <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">{stat.label}</div>
            <div className="text-3xl font-bold text-white mb-1">{stat.val}</div>
            <div className={`text-xs ${stat.color} font-mono`}>{stat.trend}</div>
          </div>
        ))}
      </div>

      <div className="bg-[#080808] border border-white/5 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h3 className="font-bold text-white">Recent Inquiries</h3>
          <button className="text-xs text-teal-400 hover:text-teal-300">View All</button>
        </div>
        <div className="divide-y divide-white/5">
          {initialInquiries.map((lead: any, i: any) => (
            <div key={i} className="p-4 hover:bg-white/5 transition-colors cursor-pointer flex justify-between items-center group">
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-bold text-sm text-gray-400 group-hover:text-white group-hover:bg-teal-500/20 transition-colors">
                  {lead.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{lead.name} <span className="text-gray-500 font-normal">• {lead.company || 'N/A'}</span></div>
                  <div className="text-sm text-gray-400 truncate max-w-md">{lead.message || lead.msg}</div>
                </div>
              </div>
              <div className="text-xs text-gray-600 font-mono">{lead.created_at || lead.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div >
  );
};