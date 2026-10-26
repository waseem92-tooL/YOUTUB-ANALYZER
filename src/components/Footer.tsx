import React from 'react';
import { Youtube, Shield, CheckCircle2, Heart, ExternalLink, Code2 } from 'lucide-react';

interface FooterProps {
  onOpenAboutModal: () => void;
  onOpenGuideModal: () => void;
  onOpenGcpModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAboutModal,
  onOpenGuideModal,
  onOpenGcpModal,
}) => {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/90 text-slate-400 text-xs py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1: App Info & Creator Credit */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-red-600 text-white">
                <Youtube className="w-4 h-4 fill-white" />
              </div>
              <span className="font-bold text-white text-sm">YouTube Analyzer AI</span>
              <span className="text-[10px] bg-red-500/10 text-red-400 font-semibold px-2 py-0.5 rounded border border-red-500/20">
                Official Creator Tool
              </span>
            </div>
            
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              A comprehensive intelligence and algorithmic optimization suite built for YouTube creators.
              Analyze public channels, evaluate audience retention patterns, discover high-CTR video hooks,
              and connect your own channel securely via official Google OAuth 2.0.
            </p>

            {/* MANDATORY PROMINENT CREATOR CREDIT */}
            <div className="pt-2 flex items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 shadow-sm text-slate-200">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-semibold tracking-wide">
                  Created and Published by <span className="text-white font-bold underline decoration-red-500 decoration-2 underline-offset-4">Wasim Akram</span>
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
              </div>
            </div>
          </div>

          {/* Column 2: Platform Links */}
          <div>
            <h4 className="text-slate-200 font-semibold text-xs uppercase tracking-wider mb-3">Resources & Guides</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenGuideModal}
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  <span>How to Connect Your Channel</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenGcpModal}
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  <span>Google Cloud & OAuth Guide</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAboutModal}
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  <span>About YouTube Analyzer AI</span>
                </button>
              </li>
              <li>
                <a
                  href="https://developers.google.com/youtube/v3"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition flex items-center gap-1"
                >
                  <span>YouTube Data API v3 Docs</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Security & Privacy Standard */}
          <div>
            <h4 className="text-slate-200 font-semibold text-xs uppercase tracking-wider mb-3">Multi-User Security</h4>
            <div className="space-y-2 text-[11px] text-slate-400">
              <div className="flex items-start gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Zero token exposure: Access tokens are stored exclusively on secure backend sessions.</span>
              </div>
              <div className="flex items-start gap-1.5">
                <Shield className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>Strict multi-user isolation: Each creator sees only their authorized channel data.</span>
              </div>
              <div className="flex items-start gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>Instant disconnect: Easily revoke and purge session permissions anytime.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} YouTube Analyzer AI. Engineered by Wasim Akram. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onOpenAboutModal} className="hover:text-slate-300 transition">
              About & Mission
            </button>
            <span>&bull;</span>
            <button onClick={onOpenGuideModal} className="hover:text-slate-300 transition">
              Connection Tutorial
            </button>
            <span>&bull;</span>
            <span className="text-slate-400">Powered by Gemini 2.5 & Google Cloud</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
