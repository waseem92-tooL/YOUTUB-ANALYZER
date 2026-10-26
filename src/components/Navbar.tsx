import React, { useState } from 'react';
import {
  Youtube,
  Sparkles,
  Search,
  BookOpen,
  Settings,
  Info,
  LogOut,
  ShieldCheck,
  ExternalLink,
  ChevronDown,
  Layers,
  Wand2,
  GitCompare,
  Stethoscope,
  Clock,
  Target,
  Rocket,
} from 'lucide-react';
import type { UserProfile, ConfigStatus } from '../types.ts';

interface NavbarProps {
  user: UserProfile | null;
  config: ConfigStatus | null;
  activeTab: 'connected' | 'public' | 'benchmark' | 'best-time' | 'keyword-gap' | 'next-plan' | 'seo' | 'ideator';
  setActiveTab: (tab: 'connected' | 'public' | 'benchmark' | 'best-time' | 'keyword-gap' | 'next-plan' | 'seo' | 'ideator') => void;
  onOpenConnectModal: () => void;
  onOpenGuideModal: () => void;
  onOpenGcpModal: () => void;
  onOpenAboutModal: () => void;
  onOpenScriptDoctor: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  config,
  activeTab,
  setActiveTab,
  onOpenConnectModal,
  onOpenGuideModal,
  onOpenGcpModal,
  onOpenAboutModal,
  onOpenScriptDoctor,
  onLogout,
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-lg shadow-red-600/30">
            <Youtube className="w-5 h-5 fill-white" />
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-slate-950 text-[8px] font-black">
              AI
            </span>
          </div>
          <div className="cursor-pointer" onClick={() => setActiveTab(user ? 'connected' : 'public')}>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                YouTube Analyzer
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 font-semibold border border-red-500/20">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">By Wasim Akram</p>
          </div>
        </div>

        {/* Navigation Tabs (Desktop) */}
        <nav className="hidden xl:flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-xl overflow-x-auto">
          <button
            onClick={() => setActiveTab('connected')}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all shrink-0 ${
              activeTab === 'connected'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>My Channel {user && '✓'}</span>
          </button>

          <button
            onClick={() => setActiveTab('public')}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all shrink-0 ${
              activeTab === 'public'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Public</span>
          </button>

          <button
            onClick={() => setActiveTab('benchmark')}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all shrink-0 ${
              activeTab === 'benchmark'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Benchmark</span>
          </button>

          {/* FEATURE 1: Best Time */}
          <button
            onClick={() => setActiveTab('best-time')}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all shrink-0 ${
              activeTab === 'best-time'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Best Time</span>
          </button>

          {/* FEATURE 2: Keyword Gap */}
          <button
            onClick={() => setActiveTab('keyword-gap')}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all shrink-0 ${
              activeTab === 'keyword-gap'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-emerald-400" />
            <span>Keyword Gap</span>
          </button>

          {/* FEATURE 3: Next Video Plan */}
          <button
            onClick={() => setActiveTab('next-plan')}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all shrink-0 ${
              activeTab === 'next-plan'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Rocket className="w-3.5 h-3.5 text-purple-400" />
            <span>Next Video Plan</span>
          </button>

          <button
            onClick={() => setActiveTab('seo')}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all shrink-0 ${
              activeTab === 'seo'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>SEO Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('ideator')}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all shrink-0 ${
              activeTab === 'ideator'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Viral Ideas</span>
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Hook Doctor Quick Launch */}
          <button
            onClick={onOpenScriptDoctor}
            title="Hook & Script Retention Doctor"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-emerald-300 hover:text-white bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 rounded-lg transition shadow-sm"
          >
            <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />
            <span>Hook Doctor</span>
          </button>

          {/* Quick Help / Guide button */}
          <button
            onClick={onOpenGuideModal}
            title="How to Connect Guide"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Guide</span>
          </button>

          {/* GCP Setup status & instructions */}
          <button
            onClick={onOpenGcpModal}
            title="Google Cloud Setup & Verification"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition"
          >
            <Settings className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">GCP</span>
            {config?.hasGoogleClientId ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-950"></span>
            ) : (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            )}
          </button>

          {/* User state / Connect Button */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
              >
                <img
                  src={user.picture || 'https://api.dicebear.com/7.x/identicon/svg?seed=' + user.name}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover border border-slate-700"
                />
                <div className="text-left hidden lg:block">
                  <div className="text-xs font-medium text-slate-200 line-clamp-1 max-w-[120px]">
                    {user.channelTitle || user.name}
                  </div>
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    {user.isSimulation ? 'Test Channel' : 'Connected'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userMenuOpen && (
                <div
                  onMouseLeave={() => setUserMenuOpen(false)}
                  className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2"
                >
                  <div className="p-2 border-b border-slate-800/80 mb-1">
                    <p className="text-xs font-semibold text-white line-clamp-1">{user.channelTitle || user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    {user.channelCustomUrl && (
                      <p className="text-[11px] text-red-400 font-mono mt-0.5">{user.channelCustomUrl}</p>
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <button
                      onClick={() => {
                        setActiveTab('connected');
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-300 hover:bg-slate-800 rounded-lg text-left"
                    >
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      Channel Analytics
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('best-time');
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-300 hover:bg-slate-800 rounded-lg text-left"
                    >
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      Best Time to Post
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('keyword-gap');
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-300 hover:bg-slate-800 rounded-lg text-left"
                    >
                      <Target className="w-3.5 h-3.5 text-emerald-400" />
                      Keyword Gap Checker
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('next-plan');
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-300 hover:bg-slate-800 rounded-lg text-left"
                    >
                      <Rocket className="w-3.5 h-3.5 text-purple-400" />
                      Next Video Plan
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('benchmark');
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-300 hover:bg-slate-800 rounded-lg text-left"
                    >
                      <GitCompare className="w-3.5 h-3.5 text-blue-400" />
                      Benchmark with Competitors
                    </button>
                    <button
                      onClick={() => {
                        onOpenGuideModal();
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-300 hover:bg-slate-800 rounded-lg text-left"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      Connection Guide
                    </button>
                    <button
                      onClick={() => {
                        onOpenAboutModal();
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-300 hover:bg-slate-800 rounded-lg text-left"
                    >
                      <Info className="w-3.5 h-3.5 text-slate-400" />
                      About YouTube Analyzer AI
                    </button>
                  </div>

                  <div className="border-t border-slate-800/80 mt-1 pt-1">
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg text-left font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Disconnect Channel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenConnectModal}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-600/30 transition transform active:scale-95"
            >
              <Youtube className="w-4 h-4 fill-white" />
              <span>Connect Channel</span>
            </button>
          )}

          {/* About trigger */}
          <button
            onClick={onOpenAboutModal}
            title="About Creator & Platform"
            className="p-2 text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl transition"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile nav pills (Horizontal scrolling for all 8 views) */}
      <div className="xl:hidden flex items-center gap-1.5 border-t border-slate-800/80 bg-slate-950 px-3 py-2 text-xs overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('connected')}
          className={`px-2.5 py-1 rounded-lg shrink-0 ${activeTab === 'connected' ? 'bg-red-600 text-white font-semibold' : 'text-slate-400 bg-slate-900/60'}`}
        >
          My Channel
        </button>
        <button
          onClick={() => setActiveTab('public')}
          className={`px-2.5 py-1 rounded-lg shrink-0 ${activeTab === 'public' ? 'bg-red-600 text-white font-semibold' : 'text-slate-400 bg-slate-900/60'}`}
        >
          Public
        </button>
        <button
          onClick={() => setActiveTab('benchmark')}
          className={`px-2.5 py-1 rounded-lg shrink-0 ${activeTab === 'benchmark' ? 'bg-red-600 text-white font-semibold' : 'text-slate-400 bg-slate-900/60'}`}
        >
          Benchmark
        </button>
        <button
          onClick={() => setActiveTab('best-time')}
          className={`px-2.5 py-1 rounded-lg shrink-0 ${activeTab === 'best-time' ? 'bg-red-600 text-white font-semibold' : 'text-slate-400 bg-slate-900/60'}`}
        >
          Best Time
        </button>
        <button
          onClick={() => setActiveTab('keyword-gap')}
          className={`px-2.5 py-1 rounded-lg shrink-0 ${activeTab === 'keyword-gap' ? 'bg-red-600 text-white font-semibold' : 'text-slate-400 bg-slate-900/60'}`}
        >
          Keyword Gap
        </button>
        <button
          onClick={() => setActiveTab('next-plan')}
          className={`px-2.5 py-1 rounded-lg shrink-0 ${activeTab === 'next-plan' ? 'bg-red-600 text-white font-semibold' : 'text-slate-400 bg-slate-900/60'}`}
        >
          Next Video Plan
        </button>
        <button
          onClick={() => setActiveTab('seo')}
          className={`px-2.5 py-1 rounded-lg shrink-0 ${activeTab === 'seo' ? 'bg-red-600 text-white font-semibold' : 'text-slate-400 bg-slate-900/60'}`}
        >
          SEO Studio
        </button>
        <button
          onClick={() => setActiveTab('ideator')}
          className={`px-2.5 py-1 rounded-lg shrink-0 ${activeTab === 'ideator' ? 'bg-red-600 text-white font-semibold' : 'text-slate-400 bg-slate-900/60'}`}
        >
          Viral Ideas
        </button>
      </div>
    </header>
  );
};
