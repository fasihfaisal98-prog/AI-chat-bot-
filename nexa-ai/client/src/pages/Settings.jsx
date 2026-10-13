import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, User, Shield, Cpu, LogOut, CheckCircle } from 'lucide-react';

export const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen w-full bg-[#0B0F17] text-slate-100 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/chat')}
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Workspace</span>
          </button>
          <span className="text-xs font-mono text-slate-500">Nexa AI v3.0.0</span>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white">System Settings</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your account, view security properties, and configure AI environment preferences.
          </p>
        </div>

        {/* Profile Details */}
        <div className="bg-[#111522] border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-base">
              {user?.name ? user.name[0] : 'U'}
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">{user?.name}</h2>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block mb-1">User Identifier</span>
              <span className="font-mono text-slate-300 break-all">{user?._id}</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-1">Member Since</span>
              <span className="text-slate-300">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* AI Model Architecture Info */}
        <div className="bg-[#111522] border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span>AI Model Orchestration</span>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
              <span className="text-slate-400">Underlying LLM Engine</span>
              <span className="font-mono text-indigo-300 font-medium">OpenAI GPT-4o-mini</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
              <span className="text-slate-400">Key Protection</span>
              <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                <CheckCircle className="w-3.5 h-3.5" /> Server-side isolated
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-400">Context Window Compression</span>
              <span className="text-slate-300 font-medium">Active (Sliding 20-message buffer)</span>
            </div>
          </div>
        </div>

        {/* Security Info */}
        <div className="bg-[#111522] border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Security & Session Guard</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Authentication sessions use cryptographically signed JSON Web Tokens (JWT) stored in HTTP-only, SameSite secure cookies. Direct browser scripts cannot access your credentials.
          </p>
        </div>

        {/* Logout Action */}
        <div className="pt-2">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-medium transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of Nexa AI</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
