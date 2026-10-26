import React, { useState } from 'react';
import {
  GitCompare,
  Sparkles,
  Search,
  Trophy,
  TrendingUp,
  Award,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Users,
  Eye,
  Video,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import type { ChannelData, ChannelComparisonResult } from '../types.ts';
import { analyzePublicChannel, requestChannelComparison } from '../services/api.ts';

interface ChannelBenchmarkProps {
  initialChannelA?: ChannelData | null;
  onOpenAudit: (channel: ChannelData) => void;
  onOpenSeo: (topic?: string) => void;
}

export const ChannelBenchmark: React.FC<ChannelBenchmarkProps> = ({
  initialChannelA,
  onOpenAudit,
  onOpenSeo,
}) => {
  const [queryA, setQueryA] = useState(initialChannelA?.customUrl || '@MrBeast');
  const [queryB, setQueryB] = useState('@veritasium');

  const [channelA, setChannelA] = useState<ChannelData | null>(initialChannelA || null);
  const [channelB, setChannelB] = useState<ChannelData | null>(null);

  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingCompare, setLoadingCompare] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comparison, setComparison] = useState<ChannelComparisonResult | null>(null);

  const handleFetchChannels = async () => {
    if (!queryA.trim() || !queryB.trim()) return;
    setLoadingSearch(true);
    setError(null);
    try {
      const [resA, resB] = await Promise.all([
        analyzePublicChannel(queryA.trim()),
        analyzePublicChannel(queryB.trim()),
      ]);
      setChannelA(resA.channel);
      setChannelB(resB.channel);

      // Trigger Gemini Gap Analysis
      setLoadingCompare(true);
      const comp = await requestChannelComparison(resA.channel, resB.channel);
      setComparison(comp);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch one or both channels for comparison');
    } finally {
      setLoadingSearch(false);
      setLoadingCompare(false);
    }
  };

  const formatNumber = (numStr?: string | number) => {
    if (!numStr) return '0';
    const n = typeof numStr === 'string' ? parseInt(numStr, 10) : numStr;
    if (isNaN(n)) return '0';
    if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'B';
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
    return n.toLocaleString();
  };

  const calcAverageViews = (channel: ChannelData) => {
    const views = parseInt(channel.statistics.viewCount || '0', 10);
    const videos = Math.max(1, parseInt(channel.statistics.videoCount || '1', 10));
    return Math.round(views / videos);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
          <GitCompare className="w-3.5 h-3.5" />
          <span>Gemini 2.5 Algorithmic Head-to-Head Comparison</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Channel Benchmarking & Competitor Gap Analysis
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          Compare any two YouTube channels side-by-side. Benchmark view velocity, subscriber efficiency,
          and discover tactical growth opportunities to outrank competitors.
        </p>
      </div>

      {/* Input Selector Cards */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Channel A Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-red-500/20 text-red-400 font-bold flex items-center justify-center text-[10px]">
                  A
                </span>
                <span>Channel A (Your Channel or Focus)</span>
              </label>
              {channelA && <span className="text-[11px] text-emerald-400 font-mono">Loaded</span>}
            </div>
            <input
              type="text"
              value={queryA}
              onChange={(e) => setQueryA(e.target.value)}
              placeholder="e.g. @MrBeast, @WasimAkramTech"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500 font-mono"
            />
          </div>

          {/* Channel B Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-[10px]">
                  B
                </span>
                <span>Channel B (Competitor or Benchmark)</span>
              </label>
              {channelB && <span className="text-[11px] text-blue-400 font-mono">Loaded</span>}
            </div>
            <input
              type="text"
              value={queryB}
              onChange={(e) => setQueryB(e.target.value)}
              placeholder="e.g. @MKBHD, @veritasium"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Quick matchups:</span>
            <button
              onClick={() => {
                setQueryA('@MrBeast');
                setQueryB('@veritasium');
              }}
              className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono hover:text-white"
            >
              MrBeast vs Veritasium
            </button>
            <button
              onClick={() => {
                setQueryA('@MKBHD');
                setQueryB('@MrBeast');
              }}
              className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono hover:text-white"
            >
              MKBHD vs MrBeast
            </button>
          </div>

          <button
            onClick={handleFetchChannels}
            disabled={loadingSearch || loadingCompare || !queryA.trim() || !queryB.trim()}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition active:scale-95"
          >
            {loadingSearch || loadingCompare ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span>Analyzing Matchup...</span>
              </>
            ) : (
              <>
                <GitCompare className="w-4 h-4" />
                <span>Run Head-to-Head Comparison</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Head-to-Head Side by Side Cards */}
      {channelA && channelB && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Channel A Card */}
            <div className="p-6 rounded-2xl bg-slate-900 border-2 border-red-500/30 shadow-xl space-y-4 relative overflow-hidden">
              <div className="flex items-center gap-3.5">
                <img
                  src={
                    channelA.thumbnails.high?.url ||
                    channelA.thumbnails.default?.url ||
                    'https://api.dicebear.com/7.x/identicon/svg?seed=' + channelA.title
                  }
                  alt={channelA.title}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-700 shadow-md"
                />
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 block">
                    Channel A
                  </span>
                  <h3 className="font-extrabold text-base text-white truncate">{channelA.title}</h3>
                  <span className="text-xs font-mono text-slate-400">{channelA.customUrl || channelA.id}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Subs</span>
                  <span className="text-sm font-black text-white">{formatNumber(channelA.statistics.subscriberCount)}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Views</span>
                  <span className="text-sm font-black text-white">{formatNumber(channelA.statistics.viewCount)}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Uploads</span>
                  <span className="text-sm font-black text-white">{formatNumber(channelA.statistics.videoCount)}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
                <span className="text-slate-400">Views per Video Ratio:</span>
                <span className="font-black text-white font-mono">{formatNumber(calcAverageViews(channelA))}</span>
              </div>
            </div>

            {/* Channel B Card */}
            <div className="p-6 rounded-2xl bg-slate-900 border-2 border-blue-500/30 shadow-xl space-y-4 relative overflow-hidden">
              <div className="flex items-center gap-3.5">
                <img
                  src={
                    channelB.thumbnails.high?.url ||
                    channelB.thumbnails.default?.url ||
                    'https://api.dicebear.com/7.x/identicon/svg?seed=' + channelB.title
                  }
                  alt={channelB.title}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-700 shadow-md"
                />
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block">
                    Channel B
                  </span>
                  <h3 className="font-extrabold text-base text-white truncate">{channelB.title}</h3>
                  <span className="text-xs font-mono text-slate-400">{channelB.customUrl || channelB.id}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Subs</span>
                  <span className="text-sm font-black text-white">{formatNumber(channelB.statistics.subscriberCount)}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Views</span>
                  <span className="text-sm font-black text-white">{formatNumber(channelB.statistics.viewCount)}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Uploads</span>
                  <span className="text-sm font-black text-white">{formatNumber(channelB.statistics.videoCount)}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
                <span className="text-slate-400">Views per Video Ratio:</span>
                <span className="font-black text-white font-mono">{formatNumber(calcAverageViews(channelB))}</span>
              </div>
            </div>
          </div>

          {/* Gemini AI Strategic Gap Analysis */}
          {comparison && (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl space-y-6 animate-in fade-in duration-300">
              {/* Verdict Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/40 via-slate-950 to-blue-950/40 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span className="text-xs uppercase font-bold text-amber-300">
                      Algorithmic Edge: <strong className="text-white">{comparison.winner}</strong>
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                    {comparison.verdictSummary}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-center p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[9px] uppercase font-bold text-red-400 block">Score A</span>
                    <span className="text-xl font-black text-white">{comparison.benchmarkScore?.channelA || 82}</span>
                  </div>
                  <span className="text-slate-600 font-bold">vs</span>
                  <div className="text-center p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[9px] uppercase font-bold text-blue-400 block">Score B</span>
                    <span className="text-xl font-black text-white">{comparison.benchmarkScore?.channelB || 88}</span>
                  </div>
                </div>
              </div>

              {/* Content Strategy Breakdown */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-red-400" />
                  Content Strategy & Audience Retention Contrast
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {comparison.contentStrategyContrast}
                </p>
              </div>

              {/* Advantages Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-red-400 block uppercase">
                    {channelA.title} Core Strengths
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {comparison.channelAAdvantages?.map((adv, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                        <span>{adv}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-blue-400 block uppercase">
                    {channelB.title} Core Strengths
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {comparison.channelBAdvantages?.map((adv, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                        <span>{adv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actionable Opportunities */}
              <div className="p-5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Tactical Opportunities for {channelA.title} to Accelerate Growth
                </h4>
                <div className="space-y-2 text-xs">
                  {comparison.growthOpportunitiesForA?.map((opp, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-bold text-[10px] shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-slate-200">{opp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
