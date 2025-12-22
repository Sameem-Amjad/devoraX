"use client"
import { Eye, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface AdminProjectsManagerProps {
    projects: any[],
    onDelete: (id: number) => void,
    onAdd: (project: any) => void,
}

export const AdminProjectsManager = ({ projects, onDelete, onAdd }:AdminProjectsManagerProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', category: '', description: '' });

  const handleSubmit = (e:any) => {
    e.preventDefault();
    onAdd({ 
      ...newProject, 
      image: 'linear-gradient(135deg, #111 0%, #333 100%)', 
      accent: 'from-gray-700 to-gray-600',
      stats: { users: "N/A", status: "Active" }
    });
    setIsAdding(false);
    setNewProject({ title: '', category: '', description: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Project Management</h2>
        <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 px-4 py-2 rounded-lg text-white font-bold transition-colors">
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {isAdding && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-[#111] border border-white/10 p-6 rounded-xl overflow-hidden">
          <h3 className="font-bold text-white mb-4">New Project Details</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
             <div className="grid md:grid-cols-2 gap-4">
               <input placeholder="Project Title" required className="bg-black border border-white/10 p-3 rounded text-white" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} />
               <input placeholder="Category (e.g. React Native)" required className="bg-black border border-white/10 p-3 rounded text-white" value={newProject.category} onChange={e => setNewProject({...newProject, category: e.target.value})} />
             </div>
             <textarea placeholder="Short Description" required rows={3} className="w-full bg-black border border-white/10 p-3 rounded text-white" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} />
             <div className="flex justify-end gap-3">
               <button type="button" onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-white">Cancel</button>
               <button type="submit" className="bg-teal-600 text-white px-6 py-2 rounded font-bold">Save Project</button>
             </div>
          </form>
        </motion.div>
      )}

      <div className="bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-gray-400 text-sm uppercase">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4 hidden md:table-cell">Category</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {projects.map((p) => (
              <tr key={p.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 font-medium text-white">{p.title}</td>
                <td className="p-4 text-gray-400 hidden md:table-cell">{p.category}</td>
                <td className="p-4 text-right flex justify-end gap-3">
                  <button className="text-gray-500 hover:text-white transition-colors"><Eye className="w-4 h-4" /></button>
                  <button onClick={() => onDelete(p.id)} className="text-red-500/70 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
