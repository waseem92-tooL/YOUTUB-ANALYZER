import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  Copy,
  Check,
  AlertCircle,
  TrendingDown,
  TrendingUp,
  Tag,
  FileText,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Video,
  ExternalLink,
  Wand2,
  ArrowRight,
  Youtube,
} from 'lucide-react';
import type { KeywordGapResponse, ChannelData, UserProfile } from '../types.ts';
import { requestKeywordGap } from '../services/api.ts';

interface KeywordGapCheckerProps {
  user: UserProfile | null;
  channel: ChannelData | null;
  onOpenConnectModal: () => void;
  onOpenSeoStudio: (topic?: string) => void;
}

export const KeywordGapChecker: React.FC<KeywordGapCheckerProps> = ({
  user,
  channel,
  onOpenConnectModal,
  onOpenSeoStudio,
}) => {
  const [videoInput, setVideoInput] = useState<string>('How to build full stack apps with AI in 2026');
  const [topic, setTopic] = useState<string>('Software Engineering & AI');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<KeywordGapResponse | null>(null);

  // Copy states
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedDesc, setCopiedDesc] = useState(false);
  const [copiedTags, setCopiedTags] = useState(false);

  const handleAnalyze = async (customInput?: string) => {
    const input = customInput || videoInput;
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await requestKeywordGap({
        videoInput: input.trim(),
        topic: topic.trim(),
      });
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze keyword gap');
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text: string, setter: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
          <Search className="w-3.5 h-3.5" />
          <span>Competitive Search Intelligence</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Keyword Gap Checker
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          Compare your video title, description, and tags against the top-ranking videos on YouTube for your topic.
          Uncover missing search phrases, purge toxic tags, and boost organic browse velocity.
        </p>
      </div>

      {/* Input Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        {/* If channel has recent videos, allow picking directly */}
        {channel?.recentVideos && channel.recentVideos.length > 0 && (
          <div className="space-y-1.5 pb-2 border-b border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Video className="w-3 h-3 text-red-400" />
              Quick Pick from Your Channel:
            </span>
            <div className="flex flex-wrap gap-2">
              {channel.recentVideos.slice(0, 4).map((vid) => (
                <button
                  key={vid.id}
                  onClick={() => {
                    setVideoInput(vid.title);
                    handleAnalyze(vid.title);
                  }}
                  className="px-2.5 py-1 text-xs rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition truncate max-w-[280px]"
                  title={vid.title}
                >
                  {vid.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Form */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white flex items-center justify-between">
              <span>Enter YouTube Video URL or Draft Title</span>
              <span className="text-[11px] text-slate-500">Supports YouTube links or keywords</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={videoInput}
                onChange={(e) => setVideoInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                placeholder="Paste video link (https://youtube.com/watch?v=...) or title..."
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-red-500 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-400">Target Niche / Category (Optional)</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Gaming, Tech, Finance, Cooking"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="sm:self-end">
              <button
                onClick={() => handleAnalyze()}
                disabled={loading || !videoInput.trim()}
                className="w-full py-2.5 px-5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition active:scale-95"
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>Checking Keyword Gaps...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    <span>Run Keyword Gap Analysis</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Analysis Results */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* SEO Scorecard Hero */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  SEO Search Competitiveness
                </span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-black ${
                    result.seoScore >= 80
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : result.seoScore >= 60
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  Grade: {result.scoreGrade}
                </span>
              </div>

              <div className="flex items-baseline gap-2 justify-center sm:justify-start">
                <span className="text-4xl sm:text-5xl font-black text-white">{result.seoScore}</span>
                <span className="text-xl text-slate-400 font-bold">/ 100</span>
              </div>

              <p className="text-xs text-slate-300 max-w-lg leading-relaxed pt-1">
                {result.scoreExplanation}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center max-w-[220px] shrink-0">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Top Competitor Power Tag</span>
              <span className="text-xs font-mono font-bold text-amber-400">
                #{result.topCompetitorKeywords?.[0] || 'proven framework'}
              </span>
            </div>
          </div>

          {/* Simple Words Explanation: Why this video may not be ranking */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-900 border border-amber-500/30 space-y-2">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2 text-amber-400">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              Why This Video May Not Be Ranking (In Simple Words)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              {result.rankingDiagnosis}
            </p>
          </div>

          {/* Keyword Gaps Grid: Missing vs Weak vs Irrelevant */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Missing Keywords (Competitors Have, You Don't) */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Missing Power Keywords
              </span>
              <p className="text-[11px] text-slate-400">Top ranking videos use these, but your video lacks them:</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {result.missingKeywords?.map((kw, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono"
                  >
                    + {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Weak / Low Intent Keywords */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4" />
                Weak / Oversaturated Terms
              </span>
              <p className="text-[11px] text-slate-400">Too generic or low search intent; replace these:</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {result.weakKeywords?.map((kw, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs font-mono"
                  >
                    ! {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Irrelevant / Harmful Tags */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <XCircle className="w-4 h-4" />
                Irrelevant / Confusing Tags
              </span>
              <p className="text-[11px] text-slate-400">These confuse the recommendation algorithm:</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {result.irrelevantTags?.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-mono"
                  >
                    &times; {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Suggested Replacements (Title, Description Opening, Tags with Copy buttons) */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-emerald-400" />
                AI-Suggested Improvements & Fixes
              </h3>
              <span className="text-xs font-mono text-slate-400">One-click Copy</span>
            </div>

            {/* Suggested Title */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase text-emerald-400">
                  Optimized High-Rank Title
                </span>
                <button
                  onClick={() => copyText(result.suggestedTitle, setCopiedTitle)}
                  className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center gap-1 transition"
                >
                  {copiedTitle ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTitle ? 'Copied' : 'Copy Title'}</span>
                </button>
              </div>
              <p className="text-sm font-semibold text-white">{result.suggestedTitle}</p>
            </div>

            {/* Suggested Description Opening Hook */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase text-blue-400 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" />
                  Optimized Description Opening (First 2–3 Sentences)
                </span>
                <button
                  onClick={() => copyText(result.suggestedDescriptionOpening, setCopiedDesc)}
                  className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center gap-1 transition"
                >
                  {copiedDesc ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedDesc ? 'Copied' : 'Copy Description'}</span>
                </button>
              </div>
              <p className="text-xs text-slate-300 font-mono leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
                {result.suggestedDescriptionOpening}
              </p>
            </div>

            {/* Suggested Tag List */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase text-purple-400 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  Recommended High-Rank Tag List ({result.suggestedTags?.length || 0})
                </span>
                <button
                  onClick={() => copyText(result.suggestedTags?.join(', ') || '', setCopiedTags)}
                  className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center gap-1 transition"
                >
                  {copiedTags ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTags ? 'All Copied' : 'Copy All Tags'}</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {result.suggestedTags?.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-mono"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* MANDATORY Guide Tip */}
          <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 flex items-start gap-3 text-xs text-blue-200">
            <HelpCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-blue-300">Creator Guide Tip: </strong>
              <span>{result.guideTip}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
