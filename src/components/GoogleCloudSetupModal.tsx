import React, { useState } from 'react';
import {
  X,
  Settings,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  KeyRound,
  Layers,
  HelpCircle,
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
  const [copiedDev, setCopiedDev] = useState(false);
  const [copiedShared, setCopiedShared] = useState(false);
  const [copiedActive, setCopiedActive] = useState(false);

  // Runtime credential inputs
  const [clientIdInput, setClientIdInput] = useState('');
  const [clientSecretInput, setClientSecretInput] = useState('');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const devUri = config?.redirectUriDev || 'https://ais-dev-xtgbaubcni3vo2kxlksk7n-580910617019.asia-northeast1.run.app/auth/callback';
  const sharedUri = config?.redirectUriShared || 'https://ais-pre-xtgbaubcni3vo2kxlksk7n-580910617019.asia-northeast1.run.app/auth/callback';
  const activeUri = config?.activeRedirectUri || devUri;

  const handleCopy = (text: string, type: 'dev' | 'shared' | 'active') => {
    navigator.clipboard.writeText(text);
    if (type === 'dev') {
      setCopiedDev(true);
      setTimeout(() => setCopiedDev(false), 2000);
    } else if (type === 'shared') {
      setCopiedShared(true);
      setTimeout(() => setCopiedShared(false), 2000);
    } else {
      setCopiedActive(true);
      setTimeout(() => setCopiedActive(false), 2000);
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
              <h3 className="font-bold text-white text-base">Google Cloud Configuration & OAuth Verification</h3>
              <p className="text-xs text-slate-400">Settings and instructions required for public multi-user channel connection</p>
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
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            config?.hasGoogleClientId
              ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
              : 'bg-amber-950/30 border-amber-500/30 text-amber-200'
          }`}>
            {config?.hasGoogleClientId ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="font-bold text-sm">
                {config?.hasGoogleClientId
                  ? 'Google Cloud OAuth Client ID is Configured'
                  : 'Google Cloud Credentials Pending Configuration'}
              </h4>
              <p className="text-xs mt-1 leading-relaxed opacity-90">
                {config?.hasGoogleClientId
                  ? 'Your application has OAuth client credentials active. Visitors can connect their YouTube channels directly via Google OAuth 2.0.'
                  : 'To allow public users to connect their YouTube channels securely, configure your Google Cloud OAuth Client ID below, or test the creator dashboard using Test Mode.'}
              </p>
            </div>
          </div>

          {/* Section: Authorized Redirect URIs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-400" />
                Required Authorized Redirect URIs
              </h4>
              <span className="text-[11px] text-slate-400">Add both to your Google Cloud Console</span>
            </div>

            <p className="text-xs text-slate-400">
              When creating your OAuth 2.0 Web Client ID in the Google Cloud Console, you must add these exact URLs under <strong className="text-slate-200">Authorized redirect URIs</strong>:
            </p>

            {/* Development URI */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Development Environment URL</span>
                <code className="text-xs font-mono text-amber-300 truncate block">
                  {devUri}
                </code>
              </div>
              <button
                onClick={() => handleCopy(devUri, 'dev')}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-1.5 shrink-0 transition"
              >
                {copiedDev ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedDev ? 'Copied!' : 'Copy URI'}</span>
              </button>
            </div>

            {/* Shared URI */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Shared / Production Deployment URL</span>
                <code className="text-xs font-mono text-emerald-300 truncate block">
                  {sharedUri}
                </code>
              </div>
              <button
                onClick={() => handleCopy(sharedUri, 'shared')}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-1.5 shrink-0 transition"
              >
                {copiedShared ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedShared ? 'Copied!' : 'Copy URI'}</span>
              </button>
            </div>
          </div>

          {/* Section: Complete Setup Checklist */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              Complete Google Cloud Setup Walkthrough
            </h4>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <strong className="text-white block mb-1">Step 1: Create or Select Google Cloud Project</strong>
                <p className="text-slate-400 leading-relaxed">
                  Go to <a href="https://console.cloud.google.com" target="_blank" rel="noreferrer" className="text-blue-400 underline inline-flex items-center gap-0.5">Google Cloud Console <ExternalLink className="w-2.5 h-2.5" /></a> and create a project (e.g. <em>YouTube-Analyzer-AI</em>).
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
                  <br />&bull; <strong>User Type:</strong> Choose <em>External</em> so public users can sign in.
                  <br />&bull; <strong>App Information:</strong> Set App name: <em>YouTube Analyzer AI</em>, User support email, Developer contact email.
                  <br />&bull; <strong>Scopes:</strong> Add <code className="text-amber-300">https://www.googleapis.com/auth/youtube.readonly</code>, <code className="text-amber-300">userinfo.profile</code>, <code className="text-amber-300">userinfo.email</code>.
                  <br />&bull; <strong>Test Users:</strong> While publishing status is <em>Testing</em>, add your test Google account emails (e.g., your channel account).
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <strong className="text-white block mb-1">Step 4: Create OAuth 2.0 Web Client ID</strong>
                <p className="text-slate-400 leading-relaxed">
                  Navigate to <em>APIs & Services &gt; Credentials &gt; Create Credentials &gt; OAuth client ID</em>:
                  <br />&bull; <strong>Application Type:</strong> Web application.
                  <br />&bull; <strong>Authorized JavaScript origins:</strong> Add <code className="text-slate-200">https://ais-dev-xtgbaubcni3vo2kxlksk7n-580910617019.asia-northeast1.run.app</code> and <code className="text-slate-200">https://ais-pre-xtgbaubcni3vo2kxlksk7n-580910617019.asia-northeast1.run.app</code>.
                  <br />&bull; <strong>Authorized redirect URIs:</strong> Paste both development and shared callback URIs from above.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <strong className="text-white block mb-1">Step 5: Verification & Production Deployment Notes</strong>
                <p className="text-slate-400 leading-relaxed">
                  Before launching to unlimited uninvited public users, Google requires verification for sensitive scopes like <code className="text-slate-200">youtube.readonly</code>. In Testing mode, up to 100 designated test accounts can connect immediately without verification.
                </p>
              </div>
            </div>
          </div>

          {/* Section: In-App Credential Setup Form */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <h4 className="font-semibold text-white text-sm mb-2 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-emerald-400" />
              Configure Credentials (Instant In-Memory Update)
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              Enter your Google Client ID and Secret to test real OAuth right away without redeploying.
            </p>

            <form onSubmit={handleSaveCredentials} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">
                  Google Client ID (.apps.googleusercontent.com)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 123456789-abc.apps.googleusercontent.com"
                  value={clientIdInput}
                  onChange={(e) => setClientIdInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white font-mono focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">
                  Google Client Secret
                </label>
                <input
                  type="password"
                  placeholder="GOCSPX-..."
                  value={clientSecretInput}
                  onChange={(e) => setClientSecretInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white font-mono focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">
                  Optional YouTube Data API v3 Key (for public channel lookup)
                </label>
                <input
                  type="text"
                  placeholder="AIzaSy..."
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white font-mono focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                {saveSuccess ? (
                  <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                    <Check className="w-4 h-4" /> Credentials saved successfully!
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-500">Values are stored in secure session memory.</span>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Apply Credentials'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <span className="text-xs text-slate-400">Have questions? Check the Google Cloud Console documentation.</span>
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
