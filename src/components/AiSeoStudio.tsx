import React, { useState } from 'react';
import {
  Wand2,
  Sparkles,
  Copy,
  Check,
  Tag,
  FileText,
  Clock,
  TrendingUp,
  Flame,
  Search,
  Image as ImageIcon,
  Palette,
  Stethoscope,
  Lightbulb,
} from 'lucide-react';
import type { SeoOptimizationResult, ThumbnailStudioResult } from '../types.ts';
import { requestSeoOptimization, requestThumbnailStudio } from '../services/api.ts';

interface AiSeoStudioProps {
  initialTopic?: string;
  onOpenIdeator: () => void;
  onOpenScriptDoctor?: () => void;
}

export const AiSeoStudio: React.FC<AiSeoStudioProps> = ({
  initialTopic = '',
  onOpenIdeator,
  onOpenScriptDoctor,
}) => {
  const [topic, setTopic] = useState(initialTopic || 'How to build full stack apps with AI in 2026');
  const [niche, setNiche] = useState('Tech, Coding & Software Development');
  const [loading, setLoading] = useState(false);
  const [loadingThumbnails, setLoadingThumbnails] = useState(false);
  const [result, setResult] = useState<SeoOptimizationResult | null>(null);
  const [thumbnailData, setThumbnailData] = useState<ThumbnailStudioResult | null>(null);

  const [copiedTitle, setCopiedTitle] = useState<string | null>(null);
  const [copiedDesc, setCopiedDesc] = useState(false);
  const [copiedHook, setCopiedHook] = useState(false);
  const [copiedTags, setCopiedTags] = useState(false);
  const [copiedPromptIdx, setCopiedPromptIdx] = useState<number | null>(null);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    try {
      const data = await requestSeoOptimization(topic.trim(), niche.trim());
      setResult(data);
    } catch (err) {
      console.error('Failed to generate SEO optimization:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchThumbnails = async () => {
    if (!topic.trim()) return;
    setLoadingThumbnails(true);
    try {
      const data = await requestThumbnailStudio(topic.trim(), niche.trim());
      setThumbnailData(data);
    } catch (err) {
      console.error('Failed to generate thumbnail concepts:', err);
    } finally {
      setLoadingThumbnails(false);
    }
  };

  const copyToClipboard = (text: string, setter: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
          <Wand2 className="w-3.5 h-3.5" />
          <span>Gemini 2.5 YouTube SEO, Packaging & Thumbnail Studio</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Optimize Titles, Tags & 30-Second Hooks
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          Transform any video concept into an algorithmic powerhouse. Generate curiosity-driven titles,
          structured description templates, ranked tags, retention-tested hook scripts, and thumbnail visual blueprints.
        </p>
      </div>

      {/* Input Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-slate-200">
                Video Topic or Draft Title
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., How I built a full stack app in 24 hours"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200">
                Target Niche / Audience
              </label>
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g. Gaming, Tech, Finance"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onOpenIdeator}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Open Viral Ideator &rarr;</span>
              </button>

              {onOpenScriptDoctor && (
                <button
                  type="button"
                  onClick={onOpenScriptDoctor}
                  className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition"
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Hook Doctor</span>
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="px-6 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 text-white shadow-lg shadow-red-600/30 flex items-center gap-2 transition active:scale-95"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Optimizing Metadata...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Generate Full SEO Package</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Estimated Boost Badge */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-300 font-semibold">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Packaging Performance Forecast:</span>
              <span className="text-white font-bold">{result.estimatedClickThroughRateBoost}</span>
            </div>
            <button
              onClick={handleFetchThumbnails}
              disabled={loadingThumbnails}
              className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition shadow-sm"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{loadingThumbnails ? 'Generating Visuals...' : 'Generate Thumbnail Blueprints'}</span>
            </button>
          </div>

          {/* Title Variations Grid */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-red-500" />
              A/B Testable Title Formulas
            </h3>

            <div className="space-y-3">
              {/* Curiosity Title */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                <div className="space-y-0.5 min-w-0">
                  <span className="text-[10px] uppercase font-bold text-amber-400">Curiosity Gap Formula (Highest CTR)</span>
                  <p className="text-xs sm:text-sm font-semibold text-white truncate">{result.titleVariations.curiosity}</p>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(result.titleVariations.curiosity);
                    setCopiedTitle('curiosity');
                    setTimeout(() => setCopiedTitle(null), 2000);
                  }}
                  className="px-2.5 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg shrink-0 flex items-center gap-1"
                >
                  {copiedTitle === 'curiosity' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTitle === 'curiosity' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* High Stakes Title */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                <div className="space-y-0.5 min-w-0">
                  <span className="text-[10px] uppercase font-bold text-rose-400">High Stakes & Challenge Framing</span>
                  <p className="text-xs sm:text-sm font-semibold text-white truncate">{result.titleVariations.highStakes}</p>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(result.titleVariations.highStakes);
                    setCopiedTitle('highStakes');
                    setTimeout(() => setCopiedTitle(null), 2000);
                  }}
                  className="px-2.5 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg shrink-0 flex items-center gap-1"
                >
                  {copiedTitle === 'highStakes' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTitle === 'highStakes' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Search Optimized */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                <div className="space-y-0.5 min-w-0">
                  <span className="text-[10px] uppercase font-bold text-blue-400">YouTube & Google Search Optimized (Evergreen)</span>
                  <p className="text-xs sm:text-sm font-semibold text-white truncate">{result.titleVariations.searchOptimized}</p>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(result.titleVariations.searchOptimized);
                    setCopiedTitle('search');
                    setTimeout(() => setCopiedTitle(null), 2000);
                  }}
                  className="px-2.5 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg shrink-0 flex items-center gap-1"
                >
                  {copiedTitle === 'search' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTitle === 'search' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 30-Second Hook Script */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" />
                30-Second Retention Hook Script
              </h3>
              <div className="flex items-center gap-2">
                {onOpenScriptDoctor && (
                  <button
                    onClick={onOpenScriptDoctor}
                    className="px-2.5 py-1 text-xs bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-lg flex items-center gap-1"
                  >
                    <Stethoscope className="w-3 h-3" />
                    <span>Diagnose Hook</span>
                  </button>
                )}
                <button
                  onClick={() => copyToClipboard(result.thirtySecondHook, setCopiedHook)}
                  className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center gap-1"
                >
                  {copiedHook ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedHook ? 'Copied Script' : 'Copy Script'}</span>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed font-mono">
              "{result.thirtySecondHook}"
            </div>
            <p className="text-[11px] text-slate-500">
              Speak these exact opening lines without pleasantries ("Hey guys welcome back") to maintain over 65% initial retention.
            </p>
          </div>

          {/* Thumbnail Concepts (If Generated) */}
          {thumbnailData && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-emerald-400" />
                  Thumbnail Blueprints & AI Visual Prompts
                </h3>
                <span className="text-[11px] text-emerald-400 font-mono">High CTR Formulations</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {thumbnailData.concepts.map((concept, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black px-2 py-0.5 rounded bg-red-600 text-white">
                        {concept.badgeText}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-bold">
                        {concept.ctrExpectedImpact}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs">
                      <span className="font-bold text-white block">Visual Focal Point:</span>
                      <p className="text-slate-400">{concept.focalSubject}</p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 text-[11px] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-300 flex items-center gap-1">
                          <Palette className="w-3 h-3 text-amber-400" />
                          Color Palette:
                        </span>
                        <span className="text-slate-400 font-mono">{concept.colorPalette.primary}</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-[11px]">
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="font-mono text-purple-400 font-semibold">AI Generation Prompt:</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(concept.aiImagePrompt);
                            setCopiedPromptIdx(idx);
                            setTimeout(() => setCopiedPromptIdx(null), 2000);
                          }}
                          className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                        >
                          {copiedPromptIdx === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedPromptIdx === idx ? 'Copied' : 'Copy Prompt'}</span>
                        </button>
                      </div>
                      <p className="p-2 bg-slate-900/90 rounded border border-slate-800 font-mono text-[10px] text-slate-400 leading-snug">
                        {concept.aiImagePrompt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEO Description & Tags Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Description */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  SEO Description Template
                </h3>
                <button
                  onClick={() => copyToClipboard(result.description, setCopiedDesc)}
                  className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center gap-1"
                >
                  {copiedDesc ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedDesc ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <textarea
                readOnly
                rows={8}
                value={result.description}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-mono resize-none focus:outline-none"
              />
            </div>

            {/* Ranking Tags */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Tag className="w-4 h-4 text-emerald-400" />
                  Target Ranking Tags ({result.tags?.length || 0})
                </h3>
                <button
                  onClick={() => copyToClipboard(result.tags?.join(', ') || '', setCopiedTags)}
                  className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center gap-1"
                >
                  {copiedTags ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTags ? 'All Copied' : 'Copy All Tags'}</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 p-3 bg-slate-950 border border-slate-800 rounded-xl min-h-[190px]">
                {result.tags?.map((tag, i) => (
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
        </div>
      )}
    </div>
  );
};
