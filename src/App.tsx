import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Youtube,
  Search,
  Sparkles,
  ShieldCheck,
  BookOpen,
  Settings,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Lock,
  Wand2,
  Layers,
  Award,
  GitCompare,
  Stethoscope,
} from 'lucide-react';
import type { UserProfile, ConfigStatus, ChannelData } from './types.ts';
import { fetchAuthStatus, logoutUser } from './services/api.ts';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { PublicAnalyzer } from './components/PublicAnalyzer.tsx';
import { ChannelBenchmark } from './components/ChannelBenchmark.tsx';
import { BestTimeToPost } from './components/BestTimeToPost.tsx';
import { KeywordGapChecker } from './components/KeywordGapChecker.tsx';
import { NextVideoPlanView } from './components/NextVideoPlanView.tsx';
import { AiSeoStudio } from './components/AiSeoStudio.tsx';
import { AiIdeator } from './components/AiIdeator.tsx';
import { ConnectChannelModal } from './components/ConnectChannelModal.tsx';
import { ConnectGuideModal } from './components/ConnectGuideModal.tsx';
import { GoogleCloudSetupModal } from './components/GoogleCloudSetupModal.tsx';
import { AboutModal } from './components/AboutModal.tsx';
import { AiAuditorModal } from './components/AiAuditorModal.tsx';
import { ScriptDoctorModal } from './components/ScriptDoctorModal.tsx';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [config, setConfig] = useState<ConfigStatus | null>(null);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<
    'connected' | 'public' | 'benchmark' | 'best-time' | 'keyword-gap' | 'next-plan' | 'seo' | 'ideator'
  >('public');

  // Modals state
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isGcpModalOpen, setIsGcpModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isScriptDoctorOpen, setIsScriptDoctorOpen] = useState(false);

  // Selected channel for AI audit / context
  const [auditChannel, setAuditChannel] = useState<ChannelData | null>(null);
  const [selectedSeoTopic, setSelectedSeoTopic] = useState<string>('');

  const loadStatus = async () => {
    try {
      const data = await fetchAuthStatus();
      setUser(data.user);
      setConfig(data.config);

      // If user is already authenticated on boot, default to 'connected' tab
      if (data.authenticated && data.user) {
        setActiveTab('connected');
      }
    } catch (err) {
      console.error('Failed to load auth status:', err);
    } finally {
      setLoadingInitial(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setActiveTab('public');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleConnectionSuccess = () => {
    loadStatus();
    setActiveTab('connected');
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6'],
      });
    } catch (e) {
      // Ignored if confetti blocked
    }
  };

  const handleRunAudit = (targetChannel: ChannelData) => {
    setAuditChannel(targetChannel);
    setIsAuditModalOpen(true);
  };

  const handleGenerateIdeas = (targetChannel: ChannelData) => {
    setAuditChannel(targetChannel);
    setActiveTab('ideator');
  };

  const handleOpenSeo = (topic?: string) => {
    if (topic) setSelectedSeoTopic(topic);
    setActiveTab('seo');
  };

  const handleOpenBenchmark = (targetChannel: ChannelData) => {
    setAuditChannel(targetChannel);
    setActiveTab('benchmark');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-red-500/30 selection:text-red-200">
      {/* Top Navbar */}
      <Navbar
        user={user}
        config={config}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenConnectModal={() => setIsConnectModalOpen(true)}
        onOpenGuideModal={() => setIsGuideModalOpen(true)}
        onOpenGcpModal={() => setIsGcpModalOpen(true)}
        onOpenAboutModal={() => setIsAboutModalOpen(true)}
        onOpenScriptDoctor={() => setIsScriptDoctorOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loadingInitial ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-10 h-10 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-slate-400 font-medium">Initializing YouTube Analyzer AI...</p>
          </div>
        ) : (
          <>
            {/* View: Connected Channel Dashboard */}
            {activeTab === 'connected' && (
              <>
                {user ? (
                  <Dashboard
                    user={user}
                    onLogout={handleLogout}
                    onRunAudit={handleRunAudit}
                    onGenerateIdeas={handleGenerateIdeas}
                    onOpenSeo={handleOpenSeo}
                    onOpenGuide={() => setIsGuideModalOpen(true)}
                    onOpenBenchmark={handleOpenBenchmark}
                    onOpenScriptDoctor={() => setIsScriptDoctorOpen(true)}
                  />
                ) : (
                  <div className="max-w-3xl mx-auto py-12 text-center space-y-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white mx-auto shadow-xl shadow-red-600/30">
                      <Youtube className="w-8 h-8 fill-white" />
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                        Connect Your YouTube Channel
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
                        Authorize your channel via Google OAuth 2.0 to access verified subscriber counts,
                        watch time hours, audience retention curves, and algorithmic optimization audits.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                      <button
                        onClick={() => setIsConnectModalOpen(true)}
                        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 transition active:scale-95"
                      >
                        <Youtube className="w-4 h-4 fill-white" />
                        <span>Connect Your YouTube Channel</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('public')}
                        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs sm:text-sm border border-slate-800 transition"
                      >
                        <span>Analyze Public Channel Instead</span>
                      </button>
                    </div>

                    {/* Features overview pills */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 text-xs text-left max-w-2xl mx-auto">
                      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          Multi-User Isolated
                        </span>
                        <p className="text-slate-400 text-[11px]">
                          Each user connects their own account. Zero shared credentials.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-blue-400" />
                          Read-Only Access
                        </span>
                        <p className="text-slate-400 text-[11px]">
                          Tokens stored only in HTTP-only backend cookies. No edit rights.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          Gemini 2.5 Strategic
                        </span>
                        <p className="text-slate-400 text-[11px]">
                          Audit thumbnails, curiosity hooks, and discover viral opportunities.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* View: Public Channel Analyzer */}
            {activeTab === 'public' && (
              <PublicAnalyzer
                onOpenConnectModal={() => setIsConnectModalOpen(true)}
                onRunAudit={handleRunAudit}
                onGenerateIdeas={handleGenerateIdeas}
                onOpenSeo={handleOpenSeo}
                onOpenBestTime={() => setActiveTab('best-time')}
                onOpenKeywordGap={() => setActiveTab('keyword-gap')}
                onOpenNextPlan={() => setActiveTab('next-plan')}
              />
            )}

            {/* View: Best Time to Post */}
            {activeTab === 'best-time' && (
              <BestTimeToPost
                user={user}
                channel={auditChannel}
                onOpenConnectModal={() => setIsConnectModalOpen(true)}
                onOpenNextPlan={() => setActiveTab('next-plan')}
              />
            )}

            {/* View: Keyword Gap Checker */}
            {activeTab === 'keyword-gap' && (
              <KeywordGapChecker
                user={user}
                channel={auditChannel}
                onOpenConnectModal={() => setIsConnectModalOpen(true)}
                onOpenSeoStudio={handleOpenSeo}
              />
            )}

            {/* View: Next Video Plan */}
            {activeTab === 'next-plan' && (
              <NextVideoPlanView
                user={user}
                channel={auditChannel}
                onOpenConnectModal={() => setIsConnectModalOpen(true)}
                onOpenSeoStudio={handleOpenSeo}
                onOpenBestTime={() => setActiveTab('best-time')}
              />
            )}

            {/* View: Competitor Benchmarking */}
            {activeTab === 'benchmark' && (
              <ChannelBenchmark
                initialChannelA={auditChannel || (user ? {
                  id: user.channelId || 'my_channel',
                  title: user.channelTitle || user.name,
                  description: '',
                  publishedAt: '',
                  customUrl: user.channelCustomUrl,
                  thumbnails: { default: { url: user.picture } },
                  statistics: {
                    viewCount: String(user.viewCount || '18000000'),
                    subscriberCount: String(user.subscriberCount || '150000'),
                    hiddenSubscriberCount: false,
                    videoCount: String(user.videoCount || '90'),
                  },
                } : null)}
                onOpenAudit={handleRunAudit}
                onOpenSeo={handleOpenSeo}
              />
            )}

            {/* View: AI SEO Studio */}
            {activeTab === 'seo' && (
              <AiSeoStudio
                initialTopic={selectedSeoTopic}
                onOpenIdeator={() => setActiveTab('ideator')}
                onOpenScriptDoctor={() => setIsScriptDoctorOpen(true)}
              />
            )}

            {/* View: Viral Ideator */}
            {activeTab === 'ideator' && (
              <AiIdeator
                channel={auditChannel || (user ? {
                  id: user.channelId || 'my_channel',
                  title: user.channelTitle || user.name,
                  description: '',
                  publishedAt: '',
                  thumbnails: {},
                  statistics: {
                    viewCount: String(user.viewCount || '10000'),
                    subscriberCount: String(user.subscriberCount || '1000'),
                    hiddenSubscriberCount: false,
                    videoCount: String(user.videoCount || '10'),
                  },
                } : null)}
                onSendToSeo={handleOpenSeo}
              />
            )}
          </>
        )}
      </main>

      {/* Mandatory Footer with Wasim Akram credit */}
      <Footer
        onOpenAboutModal={() => setIsAboutModalOpen(true)}
        onOpenGuideModal={() => setIsGuideModalOpen(true)}
        onOpenGcpModal={() => setIsGcpModalOpen(true)}
      />

      {/* Modals */}
      <ConnectChannelModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        config={config}
        onOpenGcpModal={() => {
          setIsConnectModalOpen(false);
          setIsGcpModalOpen(true);
        }}
        onSuccess={handleConnectionSuccess}
      />

      <ConnectGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        onStartConnect={() => setIsConnectModalOpen(true)}
        onOpenGcpModal={() => {
          setIsGuideModalOpen(false);
          setIsGcpModalOpen(true);
        }}
      />

      <GoogleCloudSetupModal
        isOpen={isGcpModalOpen}
        onClose={() => setIsGcpModalOpen(false)}
        config={config}
        onConfigUpdated={loadStatus}
      />

      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
        onOpenGuide={() => setIsGuideModalOpen(true)}
      />

      <AiAuditorModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        channel={auditChannel}
        onOpenSeo={handleOpenSeo}
      />

      <ScriptDoctorModal
        isOpen={isScriptDoctorOpen}
        onClose={() => setIsScriptDoctorOpen(false)}
        onOpenSeo={handleOpenSeo}
      />
    </div>
  );
}
