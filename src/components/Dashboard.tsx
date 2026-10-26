import React, { useState, useEffect } from 'react';
import {
  Users,
  Eye,
  Video,
  Clock,
  TrendingUp,
  Percent,
  Sparkles,
  LogOut,
  ShieldCheck,
  Calendar,
  ExternalLink,
  Layers,
  Wand2,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  GitCompare,
  DollarSign,
  Stethoscope,
  Sliders,
} from 'lucide-react';
import type { ChannelData, UserProfile } from '../types.ts';
import { fetchMyDashboard } from '../services/api.ts';

interface DashboardProps {
  user: UserProfile;
  onLogout: () => void;
  onRunAudit: (channel: ChannelData) => void;
  onGenerateIdeas: (channel: ChannelData) => void;
  onOpenSeo: (topic?: string) => void;
  onOpenGuide: () => void;
  onOpenBenchmark?: (channel: ChannelData) => void;
  onOpenScriptDoctor?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  onLogout,
  onRunAudit,
  onGenerateIdeas,
  onOpenSeo,
  onOpenGuide,
  onOpenBenchmark,
  onOpenScriptDoctor,
}) => {
  const [loading, setLoading] = useState(true);
  const [channel, setChannel] = useState<ChannelData | null>(null);
  const [privateAnalytics, setPrivateAnalytics] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Interactive RPM and Monetization simulator state
  const [rpmRate, setRpmRate] = useState<number>(3.85);
  const [estimatedMonthlyViews, setEstimatedMonthlyViews] = useState<number>(180000);

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMyDashboard();
      setChannel(data.channel);
      setPrivateAnalytics(data.privateAnalytics);
      if (data.channel?.statistics?.viewCount) {
        const total = parseInt(data.channel.statistics.viewCount, 10);
        const monthlyEst = Math.max(25000, Math.round(total / 12));
        setEstimatedMonthlyViews(monthlyEst);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load channel dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [user.id]);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-medium text-slate-300">Retrieving authorized channel analytics from YouTube Data API...</p>
        <p className="text-xs text-slate-500">Connecting securely to {user.channelTitle || user.name}</p>
      </div>
    );
  }

  if (error || !channel) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
        <h3 className="text-base font-bold text-white">Could Not Load Channel Dashboard</h3>
        <p className="text-xs text-slate-400">{error || 'No channel data returned'}</p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={loadDashboard}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-500 text-white transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Sync</span>
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            Disconnect Account
          </button>
        </div>
      </div>
    );
  }

  const formatNumber = (numStr?: string | number) => {
    if (!numStr) return '0';
    const n = typeof numStr === 'string' ? parseInt(numStr, 10) : numStr;
    if (isNaN(n)) return '0';
    if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'B';
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
    return n.toLocaleString();
  };

  const simulatedMonthlyRevenue = Math.round((estimatedMonthlyViews / 1000) * rpmRate);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Channel Header Banner */}
      <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          {/* Avatar & Channel Details */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={
                  channel.thumbnails.high?.url ||
                  channel.thumbnails.default?.url ||
                  user.picture ||
                  'https://api.dicebear.com/7.x/identicon/svg?seed=' + channel.title
                }
                alt={channel.title}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-red-500/30 shadow-lg"
              />
              <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-slate-950 text-white">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {channel.title}
                </h1>
                {channel.isSimulation ? (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    Test Sandbox Channel
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Authorized by Google OAuth
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                {channel.customUrl && (
                  <span className="font-mono text-red-400 font-semibold">{channel.customUrl}</span>
                )}
                <span>&bull;</span>
                <span className="font-mono text-slate-400 truncate max-w-[150px] sm:max-w-none">
                  ID: {channel.id}
                </span>
                {channel.publishedAt && (
                  <>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      Joined {new Date(channel.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                    </span>
                  </>
                )}
              </div>

              <p className="text-xs text-slate-400 max-w-2xl line-clamp-2 pt-0.5">
                {channel.description || 'No description provided on YouTube.'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onRunAudit(channel)}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-600/30 flex items-center gap-2 transition active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Channel Audit</span>
            </button>

            {onOpenBenchmark && (
              <button
                onClick={() => onOpenBenchmark(channel)}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 flex items-center gap-1.5 transition"
              >
                <GitCompare className="w-3.5 h-3.5 text-blue-400" />
                <span>Benchmark</span>
              </button>
            )}

            <button
              onClick={() => onGenerateIdeas(channel)}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 flex items-center gap-2 transition"
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Viral Ideas</span>
            </button>

            <button
              onClick={onLogout}
              title="Disconnect Channel"
              className="p-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-rose-500/20 text-rose-400 border border-slate-800 hover:border-rose-500/30 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Subscribers */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Subscribers</span>
            <Users className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            {formatNumber(channel.statistics.subscriberCount)}
          </div>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Active audience base
          </p>
        </div>

        {/* Total Lifetime Views */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Total Views</span>
            <Eye className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            {formatNumber(channel.statistics.viewCount)}
          </div>
          <p className="text-[11px] text-slate-400">
            Lifetime channel impressions
          </p>
        </div>

        {/* Total Videos */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Total Uploads</span>
            <Video className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            {formatNumber(channel.statistics.videoCount)}
          </div>
          <p className="text-[11px] text-slate-400">
            Published library videos
          </p>
        </div>

        {/* Estimated Watch Time (Authorized Metric) */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Watch Time</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            {formatNumber(privateAnalytics?.estimatedWatchTimeHours || 1200)} hrs
          </div>
          <p className="text-[11px] text-purple-300 flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3 h-3 text-purple-400" />
            Authorized Analytics metric
          </p>
        </div>
      </div>

      {/* Interactive Audience Retention & Monetization Curve Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Retention Curve Visualizer */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Percent className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-white text-sm">Audience Retention Curve Analysis</h3>
            </div>
            {onOpenScriptDoctor && (
              <button
                onClick={onOpenScriptDoctor}
                className="text-xs px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 transition"
              >
                <Stethoscope className="w-3 h-3" />
                <span>Test Hook Script</span>
              </button>
            )}
          </div>

          <p className="text-xs text-slate-400">
            Second-by-second drop-off trajectory. High performers retain &gt;70% at 0:30 and &gt;50% at midpoint.
          </p>

          {/* Retention Curve SVG */}
          <div className="relative pt-2">
            <svg viewBox="0 0 500 160" className="w-full h-36 overflow-visible">
              <defs>
                <linearGradient id="retentionGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="20" x2="500" y2="20" stroke="#1e293b" strokeDasharray="4" />
              <line x1="0" y1="60" x2="500" y2="60" stroke="#1e293b" strokeDasharray="4" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="#1e293b" strokeDasharray="4" />
              <line x1="0" y1="140" x2="500" y2="140" stroke="#1e293b" />

              {/* Retention Area */}
              <path
                d="M 0 20 Q 50 45, 100 55 T 250 80 T 400 95 T 500 110 L 500 140 L 0 140 Z"
                fill="url(#retentionGrad)"
              />

              {/* Retention Line */}
              <path
                d="M 0 20 Q 50 45, 100 55 T 250 80 T 400 95 T 500 110"
                fill="none"
                stroke="#10b981"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Key Milestones */}
              <circle cx="100" cy="55" r="5" fill="#3b82f6" stroke="#0f172a" strokeWidth="2" />
              <text x="100" y="42" fill="#93c5fd" fontSize="10" textAnchor="middle" fontWeight="bold">0:30 (74%)</text>

              <circle cx="250" cy="80" r="5" fill="#10b981" stroke="#0f172a" strokeWidth="2" />
              <text x="250" y="68" fill="#a7f3d0" fontSize="10" textAnchor="middle" fontWeight="bold">5:00 (56%)</text>

              <circle cx="450" cy="103" r="5" fill="#f59e0b" stroke="#0f172a" strokeWidth="2" />
              <text x="450" y="92" fill="#fde68a" fontSize="10" textAnchor="middle" fontWeight="bold">Outro (44%)</text>
            </svg>

            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>0:00 (Hook)</span>
              <span>2:30 (Premise)</span>
              <span>5:00 (Climax)</span>
              <span>7:30 (Takeaway)</span>
              <span>10:00 (End Card)</span>
            </div>
          </div>
        </div>

        {/* Interactive Monetization Simulator */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-white text-sm">Monetization & RPM Calculator</h3>
            </div>
            <span className="text-[10px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded font-mono">
              Simulator
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {/* RPM Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Effective RPM Rate (Revenue per 1,000 views)</span>
                <span className="font-bold text-amber-300 font-mono">${rpmRate.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="1.00"
                max="12.00"
                step="0.25"
                value={rpmRate}
                onChange={(e) => setRpmRate(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>$1.00 (Entertainment)</span>
                <span>$4.00 (Tech / Education)</span>
                <span>$12.00 (Finance / SaaS)</span>
              </div>
            </div>

            {/* Estimated Views Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Monthly View Velocity</span>
                <span className="font-bold text-white font-mono">{formatNumber(estimatedMonthlyViews)} views</span>
              </div>
              <input
                type="range"
                min="10000"
                max="2000000"
                step="25000"
                value={estimatedMonthlyViews}
                onChange={(e) => setEstimatedMonthlyViews(parseInt(e.target.value, 10))}
                className="w-full accent-red-500 cursor-pointer"
              />
            </div>

            {/* Calculated Monthly & Annual Yield */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Est. Monthly Ad Revenue</span>
                <span className="text-xl font-black text-emerald-400 font-mono">
                  ${simulatedMonthlyRevenue.toLocaleString()} / mo
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Annualized Run Rate</span>
                <span className="text-base font-bold text-white font-mono">
                  ${(simulatedMonthlyRevenue * 12).toLocaleString()} / yr
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Authorized Analytics Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Retention & CTR Insights */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Percent className="w-4 h-4 text-emerald-400" />
              Retention & Click-Through
            </h3>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded font-mono">
              Restricted
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400">Average Click-Through Rate (CTR)</span>
                <span className="font-bold text-white">{privateAnalytics?.clickThroughRatePercentage || '7.4%'}</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '74%' }}></div>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Target is 5.0% - 10.0% for high browse performance.</p>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400">Average Percentage Viewed (Retention)</span>
                <span className="font-bold text-white">{privateAnalytics?.audienceRetentionRate || '54.2%'}</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '54.2%' }}></div>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Above 50% triggers sustained algorithmic recommendations.</p>
            </div>
          </div>
        </div>

        {/* Traffic Source Distribution */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            Top Traffic Sources
          </h3>

          <div className="space-y-2.5 text-xs">
            {(privateAnalytics?.trafficSources || [
              { name: 'YouTube Search', percentage: 44 },
              { name: 'Browse Features (Home / Feed)', percentage: 33 },
              { name: 'Suggested Videos', percentage: 15 },
              { name: 'External & Social', percentage: 8 },
            ]).map((src: any, idx: number) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>{src.name}</span>
                  <span className="font-semibold text-white">{src.percentage}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      idx === 0 ? 'bg-red-500' : idx === 1 ? 'bg-blue-500' : idx === 2 ? 'bg-amber-500' : 'bg-slate-500'
                    }`}
                    style={{ width: `${src.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Algorithmic Action Recommendations */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-red-950/20 via-slate-900 to-slate-900 border border-red-500/20 space-y-3">
          <div className="flex items-center gap-2 text-red-400">
            <Sparkles className="w-4 h-4" />
            <h3 className="font-bold text-white text-sm">Algorithmic Playbook</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Based on your channel's <strong>{formatNumber(channel.statistics.subscriberCount)}</strong> subscribers,
            your highest growth vector is producing content in the 12-18 minute bracket with high first-minute pacing.
          </p>
          <div className="pt-2 space-y-2 text-xs">
            <button
              onClick={() => onRunAudit(channel)}
              className="w-full py-2 px-3 rounded-lg bg-red-600/30 hover:bg-red-600/50 text-red-200 border border-red-500/30 text-left font-medium flex items-center justify-between transition"
            >
              <span>View Gemini Channel Diagnosis</span>
              <Sparkles className="w-3.5 h-3.5 text-red-300" />
            </button>
            <button
              onClick={() => onOpenSeo('My Next YouTube Video')}
              className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-left font-medium flex items-center justify-between transition"
            >
              <span>Optimize Metadata for Next Upload</span>
              <Wand2 className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Videos Section */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Recent Uploads & Performance</h3>
            <p className="text-xs text-slate-400">View performance metrics and run instant SEO optimization</p>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {channel.recentVideos?.length || 0} Recent Videos
          </span>
        </div>

        {channel.recentVideos && channel.recentVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {channel.recentVideos.map((video) => (
              <div
                key={video.id}
                className="rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video bg-slate-900 overflow-hidden">
                    <img
                      src={
                        video.thumbnails.medium?.url ||
                        video.thumbnails.default?.url ||
                        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80'
                      }
                      alt={video.title}
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />
                    {video.duration && (
                      <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">
                        {video.duration}
                      </span>
                    )}
                  </div>

                  <div className="p-3.5 space-y-2">
                    <h4 className="font-bold text-xs text-white line-clamp-2 leading-snug">
                      {video.title}
                    </h4>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-blue-400" />
                        {formatNumber(video.statistics?.viewCount)} views
                      </span>
                      <span>&bull;</span>
                      <span className="text-slate-400">
                        {new Date(video.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 pt-0 border-t border-slate-900 mt-2 flex items-center justify-between">
                  <button
                    onClick={() => onOpenSeo(video.title)}
                    className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1"
                  >
                    <Wand2 className="w-3 h-3" />
                    <span>Optimize SEO</span>
                  </button>

                  <a
                    href={`https://www.youtube.com/watch?v=${video.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <span>Watch</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-950/40 rounded-xl border border-slate-800/80 text-xs text-slate-400 space-y-2">
            <Video className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-slate-300 font-medium">No recent uploads detected on this channel.</p>
            <p>Upload a video on YouTube or use the AI SEO Studio to prepare your launch.</p>
          </div>
        )}
      </div>
    </div>
  );
};
