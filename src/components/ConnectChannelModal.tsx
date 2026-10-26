import React, { useState } from 'react';
import {
  X,
  Youtube,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Settings,
  Flame,
} from 'lucide-react';
import type { ConfigStatus } from '../types.ts';
import { getGoogleAuthUrl, simulateConnect } from '../services/api.ts';

interface ConnectChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ConfigStatus | null;
  onOpenGcpModal: () => void;
  onSuccess: () => void;
}

export const ConnectChannelModal: React.FC<ConnectChannelModalProps> = ({
  isOpen,
  onClose,
  config,
  onOpenGcpModal,
  onSuccess,
}) => {
  const [connecting, setConnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStartGoogleOAuth = async () => {
    setConnecting(true);
    setErrorMessage(null);

    try {
      const authData = await getGoogleAuthUrl();
      if (!authData.url) {
        throw new Error('Google OAuth authorization URL could not be generated.');
      }

      // Open OAuth popup window directly to Google accounts authorization URL
      const popup = window.open(
        authData.url,
        'google_oauth_popup',
        'width=600,height=720,status=no,resizable=yes,scrollbars=yes'
      );

      if (!popup) {
        setErrorMessage(
          'Popup was blocked by your browser. Please allow popups for this site and click Connect again.'
        );
        setConnecting(false);
        return;
      }

      // Handler for popup postMessage
      const handleMessage = (event: MessageEvent) => {
        // Validate origin
        const origin = event.origin;
        if (!origin.endsWith('.run.app') && !origin.includes('localhost')) {
          return;
        }

        if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
          window.removeEventListener('message', handleMessage);
          setConnecting(false);
          onSuccess();
          onClose();
        } else if (event.data?.type === 'OAUTH_AUTH_ERROR') {
          window.removeEventListener('message', handleMessage);
          setConnecting(false);
          setErrorMessage(event.data.error || 'Authentication failed. Please check permissions.');
        }
      };

      window.addEventListener('message', handleMessage);
    } catch (err: any) {
      console.error('OAuth start error:', err);
      setConnecting(false);
      setErrorMessage(
        err.message || 'Failed to start Google OAuth process. Configure Google Cloud credentials or try Test Mode.'
      );
    }
  };

  const handleSimulate = async (persona: string) => {
    setConnecting(true);
    setErrorMessage(null);
    try {
      await simulateConnect(persona);
      setConnecting(false);
      onSuccess();
      onClose();
    } catch (err: any) {
      setConnecting(false);
      setErrorMessage(err.message || 'Simulation connection failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-600 text-white shadow-md shadow-red-600/30">
              <Youtube className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Connect Your YouTube Channel</h3>
              <p className="text-xs text-slate-400">Official Google OAuth 2.0 Authorization</p>
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
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-300">
          {/* Clear explanation of permissions */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Requested Channel Permissions (Read-Only)
            </h4>
            
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>View your YouTube channel details:</strong> Read subscriber counts, total views, channel ID, handle, and uploaded video list.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>View your basic profile & email:</strong> Used strictly to identify your creator session and display your avatar.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Zero Mutating Rights:</strong> We cannot edit, delete, or upload videos to your channel.
                </span>
              </div>
            </div>
          </div>

          {/* Error Message if any */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold">Connection Notice:</p>
                <p className="opacity-90">{errorMessage}</p>
                <button
                  onClick={onOpenGcpModal}
                  className="mt-1 text-xs text-rose-200 underline font-medium hover:text-white flex items-center gap-1"
                >
                  Configure Google Cloud Keys in GCP Setup &rarr;
                </button>
              </div>
            </div>
          )}

          {/* Connect Action Button */}
          <div className="space-y-3 pt-1">
            <button
              onClick={handleStartGoogleOAuth}
              disabled={connecting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 text-white font-semibold text-sm shadow-xl shadow-red-600/25 flex items-center justify-center gap-2.5 transition active:scale-[0.99]"
            >
              <Youtube className="w-5 h-5 fill-white" />
              <span>
                {connecting ? 'Waiting for Google Authorization...' : 'Sign in with Google & Authorize Channel'}
              </span>
            </button>

            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
              Every user authorizes their own channel. Your tokens are protected in backend session cookies and never shared.
            </p>
          </div>

          {/* Test / Simulation Option (Especially helpful before Google verification is complete) */}
          <div className="pt-3 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Want to preview immediately? Test Channels:
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Instant Sandbox</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleSimulate('tech')}
                disabled={connecting}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/60 transition text-left"
              >
                <span className="font-semibold text-xs text-white block">Wasim Akram Tech Lab</span>
                <span className="text-[11px] text-slate-400">154K Subs &bull; 96 Videos</span>
              </button>

              <button
                onClick={() => handleSimulate('creator-economy')}
                disabled={connecting}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/60 transition text-left"
              >
                <span className="font-semibold text-xs text-white block">Growth Velocity</span>
                <span className="text-[11px] text-slate-400">284K Subs &bull; 142 Videos</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between text-xs text-slate-400">
          <button
            onClick={onOpenGcpModal}
            className="text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Google Cloud Setup & Redirect URIs</span>
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
