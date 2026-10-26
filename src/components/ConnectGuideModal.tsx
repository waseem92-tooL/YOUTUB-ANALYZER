import React, { useState } from 'react';
import {
  X,
  Youtube,
  LogIn,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface ConnectGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartConnect: () => void;
  onOpenGcpModal: () => void;
}

export const ConnectGuideModal: React.FC<ConnectGuideModalProps> = ({
  isOpen,
  onClose,
  onStartConnect,
  onOpenGcpModal,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);

  if (!isOpen) return null;

  const steps = [
    {
      num: 1,
      title: 'Click "Connect Your YouTube Channel"',
      desc: 'Initiate the official Google OAuth 2.0 flow from the navigation bar or home hero section. This opens a secure Google authorization popup directly.',
      badge: 'Step 1 of 5',
      tip: 'Ensure your browser allows popups for this site so the Google sign-in window opens without interruption.',
    },
    {
      num: 2,
      title: 'Select the Google Account with Your Channel',
      desc: 'Choose the exact Google account or Google Workspace account associated with the YouTube channel you want to analyze.',
      badge: 'Step 2 of 5',
      tip: 'If your channel is on a Brand Account, select your main Google account first, then pick the YouTube Brand Account on the subsequent screen.',
    },
    {
      num: 3,
      title: 'Review & Approve Requested Permissions',
      desc: 'Carefully review the requested permissions. We request read-only access (https://www.googleapis.com/auth/youtube.readonly) and basic profile info to fetch your channel stats.',
      badge: 'Step 3 of 5',
      tip: 'We never request permission to edit, delete, or upload videos. Access is strictly read-only for analytics and SEO inspection.',
    },
    {
      num: 4,
      title: 'Wait for Your Dashboard to Load',
      desc: 'The popup will verify your authorization, exchange the temporary code for a secure session token on our backend, and close automatically.',
      badge: 'Step 4 of 5',
      tip: 'Your tokens are cached only in secure, encrypted HTTP-only backend cookies and are never exposed to browser scripts.',
    },
    {
      num: 5,
      title: 'Explore Analytics, AI Audits & SEO Tools',
      desc: 'Once connected, your dashboard displays your live channel metrics, recent uploads, estimated watch time, retention analysis, and unlockable Gemini AI strategic tools.',
      badge: 'Step 5 of 5',
      tip: 'You can disconnect and revoke access at any time using the "Disconnect Channel" button in your user menu.',
    },
  ];

  const commonErrors = [
    {
      error: 'Google Sign-In Popup Blocked',
      reason: 'Your web browser or ad blocker blocked the popup window.',
      fix: 'Look for the popup icon in your browser address bar, click "Always allow popups from this site", and retry.',
    },
    {
      error: 'No Channel Found on Google Account',
      reason: 'The selected Google account has not created a YouTube channel yet.',
      fix: 'Visit youtube.com/create_channel to create your channel handle, or select the specific account that hosts your videos.',
    },
    {
      error: 'Access Denied / Permissions Refused',
      reason: 'You clicked "Cancel" on the Google consent screen or unticked required scopes.',
      fix: 'Click "Connect Channel" again and ensure you click "Allow" on the Google consent screen.',
    },
    {
      error: 'OAuth Error 400: redirect_uri_mismatch',
      reason: 'Google Cloud Console OAuth Client ID has not registered this application URL in its Authorized Redirect URIs.',
      fix: 'Open GCP Setup in the top bar to review and copy the exact Redirect URIs into your Google Cloud Console credentials.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Youtube className="w-4 h-4 fill-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">How to Connect Your YouTube Channel</h3>
              <p className="text-xs text-slate-400">Step-by-step guide for creators and channel managers</p>
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
          {/* Step indicator bar */}
          <div className="flex items-center justify-between gap-1 p-2 bg-slate-950 rounded-xl border border-slate-800">
            {steps.map((s) => (
              <button
                key={s.num}
                onClick={() => setActiveStep(s.num)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition ${
                  activeStep === s.num
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] bg-slate-900/60 font-bold">
                  {s.num}
                </span>
                <span className="hidden sm:inline truncate">Step {s.num}</span>
              </button>
            ))}
          </div>

          {/* Active Step Card */}
          <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                {steps[activeStep - 1].badge}
              </span>
              <div className="flex gap-2">
                {activeStep > 1 && (
                  <button
                    onClick={() => setActiveStep((prev) => prev - 1)}
                    className="text-xs px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-800"
                  >
                    Previous
                  </button>
                )}
                {activeStep < steps.length && (
                  <button
                    onClick={() => setActiveStep((prev) => prev + 1)}
                    className="text-xs px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium flex items-center gap-1"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            <h4 className="text-base font-bold text-white">
              {steps[activeStep - 1].title}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {steps[activeStep - 1].desc}
            </p>

            <div className="p-3 rounded-lg bg-blue-950/30 border border-blue-500/20 text-xs text-blue-200 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-blue-300">Creator Tip: </strong>
                {steps[activeStep - 1].tip}
              </div>
            </div>
          </div>

          {/* Common Errors & Troubleshooting */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              Common Connection Errors & Fixes
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {commonErrors.map((err, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 text-rose-400 font-semibold">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{err.error}</span>
                  </div>
                  <p className="text-slate-400">{err.reason}</p>
                  <div className="pt-1 border-t border-slate-900 text-slate-300">
                    <strong className="text-emerald-400">Solution: </strong>
                    {err.fix}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Google Cloud setup reference */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-white">Need to configure Google Cloud OAuth keys?</p>
              <p className="text-[11px] text-slate-400">
                View required redirect URLs, API enablement and consent screen instructions.
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenGcpModal();
              }}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 shrink-0 transition"
            >
              Open GCP Setup
            </button>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <span className="text-xs text-slate-400">Ready to inspect your channel?</span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onStartConnect();
              }}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30 transition flex items-center gap-1.5"
            >
              <Youtube className="w-3.5 h-3.5 fill-white" />
              <span>Connect Channel Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
