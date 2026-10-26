import React from 'react';
import { X, Youtube, Shield, Sparkles, CheckCircle2, User, Globe, Code, ArrowRight } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenGuide: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, onOpenGuide }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-600 text-white">
              <Youtube className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">About YouTube Analyzer AI</h3>
              <p className="text-xs text-slate-400">Created and Published by Wasim Akram</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
          {/* Creator Attribution Spotlight */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 border border-red-500/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 font-bold">
                WA
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-white text-sm">Created and Published by Wasim Akram</h4>
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                </div>
                <p className="text-xs text-slate-400">Software Engineer & Creator Technology Specialist</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              "YouTube Analyzer AI was engineered to bridge the gap between raw YouTube Data APIs and actionable algorithmic intelligence. By combining Google OAuth 2.0 authorization with Gemini 2.5 generative reasoning, our mission is to empower every creator to understand audience retention, optimize metadata packaging, and scale viewership predictably."
            </p>
          </div>

          {/* Purpose of the Application */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-red-400" />
              Purpose of YouTube Analyzer AI
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              YouTube Analyzer AI is a multi-user intelligence platform for creators, video strategists, and researchers. Unlike generic analytics tools, this platform provides:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="font-semibold text-white block mb-1">1. Connected Channel Intelligence</span>
                <span className="text-slate-400">
                  Securely connects your own YouTube channel via Google OAuth 2.0 to access your verified subscriber metrics, view trajectories, and upload performance.
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="font-semibold text-white block mb-1">2. Public Channel Analysis</span>
                <span className="text-slate-400">
                  Inspect any public YouTube channel without connecting a Google account, displaying public views, subscriber ratios, and publishing cadence.
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="font-semibold text-white block mb-1">3. AI Channel Health Auditing</span>
                <span className="text-slate-400">
                  Deep strategic diagnosis of thumbnail clickability, viewer retention bottlenecks, and strategic algorithmic recommendations powered by Gemini 2.5.
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="font-semibold text-white block mb-1">4. High-CTR SEO Studio</span>
                <span className="text-slate-400">
                  Generate high-curiosity video titles, high-retention 30-second video hook scripts, SEO descriptions, and long-tail tags.
                </span>
              </div>
            </div>
          </div>

          {/* Public vs Private Data Notice */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              Data Privacy & Multi-User Isolation
            </h4>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1.5">
              <p>
                &bull; <strong className="text-slate-200">No Shared Credentials:</strong> This platform is designed for public use. Each visitor authorizes their own Google account. The website owner's credentials are never used for other visitors.
              </p>
              <p>
                &bull; <strong className="text-slate-200">Strict Backend Storage:</strong> OAuth tokens are held only in encrypted server-side session memory and are never exposed in browser JavaScript or localStorage.
              </p>
              <p>
                &bull; <strong className="text-slate-200">Zero Data Resale:</strong> Channel analytics and video data are used exclusively to generate your personalized dashboards and AI audits.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onOpenGuide();
            }}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1.5"
          >
            <span>Read Connection Guide</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
