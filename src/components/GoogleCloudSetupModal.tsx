import React, { useState } from 'react';
import {
  X,
  Settings,
  Copy,
  Check,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  KeyRound,
  Layers,
  Cloud,
  Terminal,
  ShieldCheck,
  Save,
} from 'lucide-react';
import type { ConfigStatus } from '../types.ts';
import { saveCredentials } from '../services/api.ts';

interface GoogleCloudSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ConfigStatus | null;
  onConfigUpdated: () => void;
}

export const GoogleCloudSetupModal: React.FC<GoogleCloudSetupModalProps> = ({
  isOpen,
  onClose,
  config,
  onConfigUpdated,
}) => {
  const [copiedRedirect, setCopiedRedirect] = useState(false);
  const [copiedCli, setCopiedCli] = useState(false);

  // Runtime credential inputs for rapid testing
  const [clientIdInput, setClientIdInput] = useState('');
  const [clientSecretInput, setClientSecretInput] = useState('');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [geminiApiKeyInput, setGeminiApiKeyInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  // Exact OAuth Redirect URI built from window.location.origin + /api/auth/callback
  const exactRedirectUri = typeof window !== 'undefined'
    ? `${window.location.origin}/api/auth/callback`
    : 'https://your-domain.workers.dev/api/auth/callback';

  const handleCopy = (text: string, type: 'redirect' | 'cli') => {
    navigator.clipboard.writeText(text);
    if (type === 'redirect') {
      setCopiedRedirect(true);
      setTimeout(() => setCopiedRedirect(false), 2000);
    } else {
      setCopiedCli(true);
      setTimeout(() => setCopiedCli(false), 2000);
    }
  };

  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveCredentials({
        clientId: clientIdInput || undefined,
        clientSecret: clientSecretInput || undefined,
        youtubeApiKey: apiKeyInput || undefined,
        geminiApiKey: geminiApiKeyInput || undefined,
      });
      setSaveSuccess(true);
      onConfigUpdated();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save credentials:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Google Cloud & Cloudflare Workers Configuration</h3>
              <p className="text-xs text-slate-400">OAuth 2.0 Credentials, Redirect URIs & Environment Secrets</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
          {/* Status Alert Banner */}
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              config?.hasGoogleClientId
                ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                : 'bg-amber-950/30 border-amber-500/30 text-amber-200'
            }`}
          >
            {config?.hasGoogleClientId ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="font-bold text-sm">
                {config?.hasGoogleClientId
                  ? 'Google Cloud OAuth Client ID is Active'
                  : 'Google Cloud Credentials Pending Configuration'}
              </h4>
              <p className="text-xs mt-1 leading-relaxed opacity-90">
                {config?.hasGoogleClientId
                  ? 'Your Cloudflare Worker has OAuth client credentials active. Creators can connect their YouTube channels directly via official Google OAuth 2.0.'
                  : 'To enable creators to connect their channels securely, add your OAuth Client ID and Secret in Cloudflare Workers environment variables or test immediately using Test Mode.'}
              </p>
            </div>
          </div>

          {/* Section: Exact Authorized Redirect URI */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-400" />
                Exact Authorized Redirect URI
              </h4>
              <span className="text-[11px] text-slate-400 font-mono">Cloudflare Worker Endpoint</span>
            </div>

            <p className="text-xs text-slate-400">
              In your <strong className="text-slate-200">Google Cloud Console</strong> under{' '}
              <em>APIs & Services &gt; Credentials &gt; OAuth 2.0 Client IDs</em>, paste this exact URI into{' '}
              <strong className="text-amber-300">Authorized redirect URIs</strong>:
            </p>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                  Redirect URI (Dynamically computed from origin + /api/auth/callback)
                </span>
                <code className="text-xs font-mono text-emerald-300 truncate block">
                  {exactRedirectUri}
                </code>
              </div>
              <button
                onClick={() => handleCopy(exactRedirectUri, 'redirect')}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-1.5 shrink-0 transition"
              >
                {copiedRedirect ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedRedirect ? 'Copied!' : 'Copy URI'}</span>
              </button>
            </div>
          </div>

          {/* Section: 5 Environment Secrets for Cloudflare */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <h4 className="font-semibold text-white text-sm flex items-center gap-2">
              <Cloud className="w-4 h-4 text-cyan-400" />
              The 5 Required Cloudflare Worker Secrets
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Read by <code className="text-amber-300">src/worker.ts</code> via the <code className="text-slate-200">env</code> object. Add them in Cloudflare Dashboard (<em>Workers &gt; youtub-analyzer &gt; Settings &gt; Variables & Secrets</em>) or via Wrangler CLI:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-mono text-cyan-300 font-bold block">GOOGLE_CLIENT_ID</span>
                <span className="text-[11px] text-slate-400">Google Cloud OAuth Web Client ID</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-mono text-cyan-300 font-bold block">GOOGLE_CLIENT_SECRET</span>
                <span className="text-[11px] text-slate-400">Google Cloud OAuth Web Client Secret</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-mono text-cyan-300 font-bold block">YOUTUBE_API_KEY</span>
                <span className="text-[11px] text-slate-400">YouTube Data API v3 key for public queries</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-mono text-cyan-300 font-bold block">GEMINI_API_KEY</span>
                <span className="text-[11px] text-slate-400">Google Gemini API key for real-time AI</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 sm:col-span-2">
                <span className="font-mono text-cyan-300 font-bold block">SESSION_SECRET</span>
                <span className="text-[11px] text-slate-400">Random 32+ character string used for Web Crypto HMAC cookie signing</span>
              </div>
            </div>

            <div className="p-2.5 bg-slate-900/90 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
              <code className="text-[11px] font-mono text-slate-300">
                npx wrangler secret put SESSION_SECRET
              </code>
              <button
                onClick={() => handleCopy('npx wrangler secret put SESSION_SECRET', 'cli')}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
              >
                {copiedCli ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCli ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Section: Complete Setup Checklist */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              Step-by-Step Google Cloud Setup Walkthrough
            </h4>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <strong className="text-white block mb-1">Step 1: Create or Select Google Cloud Project</strong>
                <p className="text-slate-400 leading-relaxed">
                  Go to{' '}
                  <a
                    href="https://console.cloud.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 underline inline-flex items-center gap-0.5"
                  >
                    Google Cloud Console <ExternalLink className="w-2.5 h-2.5" />
                  </a>{' '}
                  and select or create a project (e.g. <em>YouTube-Analyzer-AI</em>).
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <strong className="text-white block mb-1">Step 2: Enable YouTube APIs</strong>
                <p className="text-slate-400 leading-relaxed">
                  In <em>APIs & Services &gt; Library</em>, search for and enable:
                  <br />&bull; <strong className="text-slate-200">YouTube Data API v3</strong> (for channels, playlists, statistics, and video metadata)
                  <br />&bull; <strong className="text-slate-200">YouTube Analytics API</strong> (for private watch time, traffic, and retention)
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <strong className="text-white block mb-1">Step 3: Configure OAuth Consent Screen</strong>
                <p className="text-slate-400 leading-relaxed">
                  Navigate to <em>APIs & Services &gt; OAuth consent screen</em>:
                  <br />&bull; <strong>User Type:</strong> External.
                  <br />&bull; <strong>App Name:</strong> <em>YouTube Analyzer PRO</em>.
                  <br />&bull; <strong>Scopes:</strong> Add <code className="text-amber-300">https://www.googleapis.com/auth/youtube.readonly</code>, <code className="text-amber-300">userinfo.profile</code>, <code className="text-amber-300">userinfo.email</code>.
                  <br />&bull; <strong>Test Users:</strong> Add your Google account email while publishing status is <em>Testing</em>.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <strong className="text-white block mb-1">Step 4: Create OAuth 2.0 Web Client ID</strong>
                <p className="text-slate-400 leading-relaxed">
                  Navigate to <em>APIs & Services &gt; Credentials &gt; Create Credentials &gt; OAuth client ID</em>:
                  <br />&bull; <strong>Application Type:</strong> Web application.
                  <br />&bull; <strong>Authorized JavaScript origins:</strong> Add your root origin <code className="text-slate-200">{typeof window !== 'undefined' ? window.location.origin : 'https://...'}</code>.
                  <br />&bull; <strong>Authorized redirect URIs:</strong> Paste the exact URI from the box above (<code className="text-emerald-300">{exactRedirectUri}</code>).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <span className="text-xs text-slate-400">Deployed on Cloudflare Workers & Static Assets</span>
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
