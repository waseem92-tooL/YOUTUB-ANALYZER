import React, { useState } from 'react';
import {
  Search,
  Youtube,
  Users,
  Eye,
  Video,
  Lock,
  ShieldAlert,
  Sparkles,
  ExternalLink,
  Calendar,
  AlertCircle,
  TrendingUp,
  CheckCircle2,
  Wand2,
  Clock,
  Target,
  Rocket,
  ArrowRight,
} from 'lucide-react';
import type { ChannelData } from '../types.ts';
import { analyzePublicChannel } from '../services/api.ts';

interface PublicAnalyzerProps {
  onOpenConnectModal: () => void;
  onRunAudit: (channel: ChannelData) => void;
  onGenerateIdeas: (channel: ChannelData) => void;
  onOpenSeo: (topic?: string) => void;
  onOpenBestTime: () => void;
  onOpenKeywordGap: () => void;
  onOpenNextPlan: () => void;
}

export const PublicAnalyzer: React.FC<PublicAnalyzerProps> = ({
  onOpenConnectModal,
  onRunAudit,
  onGenerateIdeas,
  onOpenSeo,
  onOpenBestTime,
  onOpenKeywordGap,
  onOpenNextPlan,
}) => {
  const [query, setQuery] = useState('@MrBeast');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [channelResult, setChannelResult] = useState<ChannelData | null>(null);
  const [restrictedNotice, setRestrictedNotice] = useState<any>(null);

  const handleSearch = async (targetQuery?: string) => {
    const q = targetQuery || query;
    if (!q.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await analyzePublicChannel(q.trim());
      setChannelResult(data.channel);
      setRestrictedNotice(data.restrictedMetricsExplanation);
    } catch (err: any) {
      setError(err.message || 'Could not analyze public channel. Please check the URL or handle.');
    } finally {
      setLoading(false);
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

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Search Header Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
          <Search className="w-3.5 h-3.5" />
          <span>Public YouTube Channel Intelligence</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Analyze Any Public YouTube Channel
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          Inspect public video performance, subscriber scale, and upload frequency without signing in.
          Compare metrics and discover why private audience retention requires channel connection.
        </p>

        {/* Input Bar */}
        <div className="relative max-w-2xl mx-auto mt-4">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-2xl p-1.5 focus-within:border-red-500/60 focus-within:ring-2 focus-within:ring-red-500/20 shadow-xl transition">
            <div className="pl-3 text-slate-500">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Enter channel handle (e.g. @MrBeast, @mkbhd) or YouTube URL..."
              className="w-full bg-transparent border-none text-white text-xs sm:text-sm px-3 py-2.5 focus:outline-none placeholder:text-slate-500 font-medium"
            />
            <button
              onClick={() => handleSearch()}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-semibold text-xs transition shadow-md shadow-red-600/30 flex items-center gap-1.5 shrink-0"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span>Analyze</span>
                </>
              )}
            </button>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-slate-400">
            <span className="text-[11px] text-slate-500">Quick explore:</span>
            {['@MrBeast', '@MKBHD', '@veritasium', '@hubermanlab'].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setQuery(tag);
                  handleSearch(tag);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition text-[11px] font-mono"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured PRO Tool Cards below Search Box */}
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            New Creator Intelligence Tools
          </span>
          <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
            Click any card to launch full analysis
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Best Time to Post */}
          <div
            onClick={onOpenBestTime}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpenBestTime()}
            className="group relative p-5 rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-red-500/50 transition-all duration-200 shadow-xl cursor-pointer flex flex-col justify-between hover:shadow-red-950/20 hover:-translate-y-0.5 text-left"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  Heatmap Matrix
                </span>
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-white group-hover:text-red-300 transition flex items-center gap-1.5">
                  Best Time to Post
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Analyze last 50 uploads across day & hour vs views & engagement with top 3 slots in plain English and audience activity.
                </p>
              </div>

              <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-slate-400">
                <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-300">7×24 Heatmap</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-300">Timezone Sync</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between text-xs text-amber-400 font-bold group-hover:text-amber-300">
              <span>Open Heatmap Tool</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 2: Keyword Gap Checker */}
          <div
            onClick={onOpenKeywordGap}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpenKeywordGap()}
            className="group relative p-5 rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-red-500/50 transition-all duration-200 shadow-xl cursor-pointer flex flex-col justify-between hover:shadow-red-950/20 hover:-translate-y-0.5 text-left"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-rose-600/20 border border-red-500/30 flex items-center justify-center text-red-400 group-hover:scale-105 transition">
                  <Target className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/10 text-red-300 border border-red-500/20">
                  Search Gap AI
                </span>
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-white group-hover:text-red-300 transition flex items-center gap-1.5">
                  Keyword Gap Checker
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Compare your video title, description & tags against top ranking competitors. Uncover missing high-volume tags & SEO score.
                </p>
              </div>

              <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-slate-400">
                <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-300">Score /100</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-300">One-Click Copy</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between text-xs text-red-400 font-bold group-hover:text-red-300">
              <span>Find Keyword Gaps</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 3: Next Video Plan */}
          <div
            onClick={onOpenNextPlan}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpenNextPlan()}
            className="group relative p-5 rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-red-500/50 transition-all duration-200 shadow-xl cursor-pointer flex flex-col justify-between hover:shadow-red-950/20 hover:-translate-y-0.5 text-left"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition">
                  <Rocket className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  5 Next Blueprints
                </span>
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-white group-hover:text-red-300 transition flex items-center gap-1.5">
                  Next Video Plan
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Decodes top-performing patterns to generate 5 complete next video concepts with 15s retention hooks, 10 tags & thumbnail ideas.
                </p>
              </div>

              <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-slate-400">
                <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-300">15s Hook Script</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-300">Thumbnail Idea</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between text-xs text-purple-400 font-bold group-hover:text-purple-300">
              <span>Generate 5 Plans</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="max-w-2xl mx-auto p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Analysis Notice:</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Results Section */}
      {channelResult && (
        <div className="space-y-6">
          {/* Channel Header Banner */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <img
                  src={
                    channelResult.thumbnails.high?.url ||
                    channelResult.thumbnails.default?.url ||
                    'https://api.dicebear.com/7.x/identicon/svg?seed=' + channelResult.title
                  }
                  alt={channelResult.title}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-700 shadow-md"
                />

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      {channelResult.title}
                    </h3>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30">
                      Public Profile
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    {channelResult.customUrl && (
                      <span className="font-mono text-red-400 font-semibold">{channelResult.customUrl}</span>
                    )}
                    <span>&bull;</span>
                    <span className="font-mono text-slate-400">ID: {channelResult.id}</span>
                    {channelResult.country && (
                      <>
                        <span>&bull;</span>
                        <span>Region: {channelResult.country}</span>
                      </>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 max-w-2xl line-clamp-2 pt-0.5">
                    {channelResult.description || 'Public YouTube channel.'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => onRunAudit(channelResult)}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-600/30 flex items-center gap-2 transition"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Run AI Channel Audit</span>
                </button>

                <button
                  onClick={() => onGenerateIdeas(channelResult)}
                  className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 flex items-center gap-2 transition"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Generate Video Ideas</span>
                </button>
              </div>
            </div>
          </div>

          {/* Public Metrics KPI Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-medium uppercase tracking-wider">Subscribers</span>
                <Users className="w-4 h-4 text-red-400" />
              </div>
              <div className="text-2xl font-black text-white">
                {formatNumber(channelResult.statistics.subscriberCount)}
              </div>
              <p className="text-[11px] text-slate-400">Public subscriber count</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-medium uppercase tracking-wider">Lifetime Views</span>
                <Eye className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-black text-white">
                {formatNumber(channelResult.statistics.viewCount)}
              </div>
              <p className="text-[11px] text-slate-400">Total channel views</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-medium uppercase tracking-wider">Total Uploads</span>
                <Video className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-white">
                {formatNumber(channelResult.statistics.videoCount)}
              </div>
              <p className="text-[11px] text-slate-400">Public video count</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-medium uppercase tracking-wider">Est. Views / Video</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-white">
                {formatNumber(
                  Math.round(
                    parseInt(channelResult.statistics.viewCount, 10) /
                      Math.max(1, parseInt(channelResult.statistics.videoCount, 10))
                  )
                )}
              </div>
              <p className="text-[11px] text-emerald-400">Pillar distribution average</p>
            </div>
          </div>

          {/* CRITICAL REQUIREMENT 3: EXPLANATION OF RESTRICTED/PRIVATE METRICS */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-900 border border-amber-500/20 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2.5 text-amber-300">
                <Lock className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm sm:text-base text-white">
                  Public Data vs. Restricted Private Analytics
                </h3>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-medium">
                YouTube Privacy Policy
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              The metrics above are publicly indexed through standard YouTube Data API endpoints.
              However, <strong>private audience activity reports, watch time, retention drop-offs, and RPM monetization</strong> are restricted by YouTube to protect creator privacy.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Publicly Available via YouTube Data API
                </span>
                <ul className="text-slate-400 space-y-1 pl-4 list-disc">
                  <li>Public Subscriber Count</li>
                  <li>Total Channel Lifetime Views</li>
                  <li>Published Video Catalog & Timestamps</li>
                  <li>Public Comments & Likes counts</li>
                  <li>Channel Descriptions & Custom Handles</li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                <span className="font-bold text-amber-400 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  Requires Google OAuth Channel Connection
                </span>
                <ul className="text-slate-400 space-y-1 pl-4 list-disc">
                  <li>Total Watch Time in Hours</li>
                  <li>Audience Retention % & Second-by-Second Drops</li>
                  <li>Thumbnail Click-Through Rate (CTR %)</li>
                  <li>Real-time 48-Hour Live Velocity & Traffic Sources</li>
                  <li>Monetization, Estimated Revenue & RPM</li>
                </ul>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800/80">
              <span className="text-xs text-slate-400">
                Do you own this channel or want to test authorized private metrics?
              </span>
              <button
                onClick={onOpenConnectModal}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold text-xs shadow-md shadow-red-600/20 transition flex items-center justify-center gap-2"
              >
                <Youtube className="w-3.5 h-3.5 fill-white" />
                <span>Connect Your YouTube Channel</span>
              </button>
            </div>
          </div>

          {/* Recent Public Videos */}
          {channelResult.recentVideos && channelResult.recentVideos.length > 0 && (
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white">Recent Public Videos</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {channelResult.recentVideos.map((video) => (
                  <div
                    key={video.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <h4 className="font-bold text-xs text-white line-clamp-2">
                        {video.title}
                      </h4>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3 text-blue-400" />
                          {formatNumber(video.statistics?.viewCount)} views
                        </span>
                        {video.statistics?.likeCount && (
                          <span>&bull; {formatNumber(video.statistics.likeCount)} likes</span>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-900 mt-3 flex items-center justify-between">
                      <button
                        onClick={() => onOpenSeo(video.title)}
                        className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1"
                      >
                        <Wand2 className="w-3 h-3" />
                        <span>Run SEO Audit on Title</span>
                      </button>

                      <a
                        href={`https://www.youtube.com/watch?v=${video.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                      >
                        <span>Open on YouTube</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
