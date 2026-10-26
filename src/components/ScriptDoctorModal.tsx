import React, { useState } from 'react';
import {
  X,
  Stethoscope,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  TrendingUp,
  Clock,
  ArrowRight,
  Flame,
} from 'lucide-react';
import type { ScriptDoctorResult } from '../types.ts';
import { requestScriptDoctor } from '../services/api.ts';

interface ScriptDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSeo: (topic?: string) => void;
}

export const ScriptDoctorModal: React.FC<ScriptDoctorModalProps> = ({
  isOpen,
  onClose,
  onOpenSeo,
}) => {
  const [scriptInput, setScriptInput] = useState(
    "Hey guys, welcome back to another video! Today we're going to talk about something really interesting. But before we get started, please make sure to smash that subscribe button and hit the notification bell. So today I wanted to share my experience building an app..."
  );
  const [targetAudience, setTargetAudience] = useState('Tech and creator audience');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScriptDoctorResult | null>(null);
  const [copiedRewrite, setCopiedRewrite] = useState(false);

  if (!isOpen) return null;

  const handleDiagnose = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!scriptInput.trim()) return;

    setLoading(true);
    try {
      const data = await requestScriptDoctor(scriptInput.trim(), targetAudience.trim());
      setResult(data);
    } catch (err) {
      console.error('Failed to diagnose script:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyRewrite = () => {
    if (!result?.punchyRewrite) return;
    navigator.clipboard.writeText(result.punchyRewrite);
    setCopiedRewrite(true);
    setTimeout(() => setCopiedRewrite(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Video Script & Hook Doctor</h3>
              <p className="text-xs text-slate-400">Gemini 2.5 First-Minute Retention Diagnostic</p>
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
          {/* Form */}
          <form onSubmit={handleDiagnose} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white flex items-center justify-between">
                <span>Paste Your Opening 30-90 Second Script or Hook</span>
                <span className="text-[11px] text-slate-500">First 30 seconds dictate 70% of video success</span>
              </label>
              <textarea
                rows={4}
                value={scriptInput}
                onChange={(e) => setScriptInput(e.target.value)}
                placeholder="Paste the words spoken in your video intro..."
                className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 font-mono resize-none focus:outline-none focus:border-red-500 leading-relaxed"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
              <div className="w-full sm:w-1/2">
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="Target audience / niche"
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-red-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !scriptInput.trim()}
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition"
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>Diagnosing Hook...</span>
                  </>
                ) : (
                  <>
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>Run Retention Diagnostic</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Results Diagnostic */}
          {result && (
            <div className="space-y-5 animate-in fade-in duration-300">
              {/* Scorecard */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-[10px] uppercase font-bold text-slate-400">First-Minute Retention Potential</span>
                  <div className="flex items-baseline gap-2 justify-center sm:justify-start">
                    <span className="text-3xl font-black text-white">{result.retentionScore} / 100</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                      Grade: {result.grade}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      (Est. Retention: {result.estimatedFirstMinuteRetention})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-500 uppercase block font-mono">Curiosity</span>
                    <span className="text-xs font-bold text-amber-400">{result.curiosityRating}</span>
                  </div>
                </div>
              </div>

              {/* Weak phrases vs Strengths */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Weak phrases */}
                <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-2">
                  <span className="font-bold text-rose-400 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Weak / Retention-Dropping Phrases
                  </span>
                  <ul className="space-y-1 text-slate-300">
                    {result.weakPhrasesDetected?.map((phrase, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-rose-400 font-bold">&times;</span>
                        <span>{phrase}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Strengths */}
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Strong Retention Triggers
                  </span>
                  <ul className="space-y-1 text-slate-300">
                    {result.strengths?.map((str, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">&check;</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Pacing feedback */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <span className="font-bold text-white block">Pacing & Engagement Analysis</span>
                <p className="text-slate-400 leading-relaxed">{result.pacingFeedback}</p>
              </div>

              {/* High Retention Word-for-Word Rewrite */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-900 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Sparkles className="w-4 h-4" />
                    <span className="font-bold text-xs uppercase tracking-wider text-white">
                      Recommended High-Retention Rewrite (Speak Word-for-Word)
                    </span>
                  </div>
                  <button
                    onClick={copyRewrite}
                    className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1.5 transition"
                  >
                    {copiedRewrite ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedRewrite ? 'Copied' : 'Copy Rewrite'}</span>
                  </button>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-emerald-300 leading-relaxed">
                  "{result.punchyRewrite}"
                </div>

                <p className="text-[11px] text-slate-400">
                  Delivering this opening hook without conversational filler guarantees higher algorithmic recommendations from the YouTube browse page.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between text-xs">
          <span className="text-slate-500">Need title and tag formulas for this hook?</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenSeo();
              }}
              className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold transition flex items-center gap-1"
            >
              <span>Open SEO Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
