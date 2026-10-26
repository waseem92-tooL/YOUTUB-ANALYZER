import React, { useState, useEffect } from 'react';
import {
  Clock,
  Calendar,
  Sparkles,
  Globe,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Zap,
  Youtube,
  RefreshCw,
  Search,
  Sliders,
} from 'lucide-react';
import type { BestTimeAnalysisResponse, ChannelData, UserProfile } from '../types.ts';
import { fetchBestTimeToPost } from '../services/api.ts';

interface BestTimeToPostProps {
  user: UserProfile | null;
  channel: ChannelData | null;
  onOpenConnectModal: () => void;
  onOpenNextPlan: () => void;
}

const TIMEZONES = [
  { label: 'Eastern Time (US / New York - EST/EDT)', value: 'America/New_York' },
  { label: 'Pacific Time (US / Los Angeles - PST/PDT)', value: 'America/Los_Angeles' },
  { label: 'Central Time (US / Chicago - CST/CDT)', value: 'America/Chicago' },
  { label: 'Greenwich Mean Time (London - GMT/BST)', value: 'Europe/London' },
  { label: 'Central European Time (Berlin/Paris - CET)', value: 'Europe/Berlin' },
  { label: 'India Standard Time (IST)', value: 'Asia/Kolkata' },
  { label: 'Japan / Korea (JST / KST)', value: 'Asia/Tokyo' },
  { label: 'Australian Eastern Time (Sydney - AEST)', value: 'Australia/Sydney' },
  { label: 'Coordinated Universal Time (UTC)', value: 'UTC' },
];

export const BestTimeToPost: React.FC<BestTimeToPostProps> = ({
  user,
  channel,
  onOpenConnectModal,
  onOpenNextPlan,
}) => {
  const [timezone, setTimezone] = useState<string>('America/New_York');
  const [selectedChannelQuery, setSelectedChannelQuery] = useState<string>(
    channel?.customUrl || (user?.channelCustomUrl ?? '@MrBeast')
  );
  const [useConnectedChannel, setUseConnectedChannel] = useState<boolean>(!!user);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<BestTimeAnalysisResponse | null>(null);
  const [inspectedSlot, setInspectedSlot] = useState<{ day: string; hour: number; score: number; viewsAvg: number } | null>(null);

  const loadBestTime = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchBestTimeToPost({
        channelHandleOrId: selectedChannelQuery,
        timezone,
        useConnected: useConnectedChannel && !!user,
      });
      setData(res);
      if (res.topRecommendations?.[0]) {
        setInspectedSlot({
          day: res.topRecommendations[0].day,
          hour: res.topRecommendations[0].hour,
          score: res.topRecommendations[0].score,
          viewsAvg: 0,
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to analyze best posting time');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBestTime();
  }, [timezone, useConnectedChannel]);

  const getHeatmapColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-500 text-emerald-950 font-bold ring-1 ring-emerald-300';
    if (score >= 80) return 'bg-emerald-600 text-white font-medium';
    if (score >= 65) return 'bg-emerald-800 text-emerald-100';
    if (score >= 50) return 'bg-slate-800 text-slate-300';
    if (score >= 35) return 'bg-slate-900 text-slate-400';
    return 'bg-slate-950 text-slate-600';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
          <Clock className="w-3.5 h-3.5" />
          <span>Audience Velocity & Heatmap Engine</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Best Time to Post on YouTube
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          We analyzed the last 50 uploads across views, likes, and comment velocity to uncover your channel's
          peak audience activity windows. Learn exactly when your subscribers are online and ready to binge.
        </p>
      </div>

      {/* Control bar: Channel switcher & Timezone selector */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Mode / Channel */}
        <div className="w-full md:w-auto flex flex-wrap items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setUseConnectedChannel(true)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                  useConnectedChannel
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                My Channel ({user.channelTitle || user.name})
              </button>
              <button
                onClick={() => setUseConnectedChannel(false)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                  !useConnectedChannel
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                Analyze Public Channel
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Public Channel:</span>
            </div>
          )}

          {!useConnectedChannel && (
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1 focus-within:border-red-500/60">
              <Search className="w-3.5 h-3.5 text-slate-500 mr-1.5" />
              <input
                type="text"
                value={selectedChannelQuery}
                onChange={(e) => setSelectedChannelQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadBestTime()}
                placeholder="e.g. @MrBeast, @mkbhd"
                className="bg-transparent border-none text-xs text-white focus:outline-none w-36 sm:w-48 font-mono"
              />
              <button
                onClick={loadBestTime}
                className="text-[11px] text-red-400 hover:text-red-300 font-semibold px-1"
              >
                Check
              </button>
            </div>
          )}
        </div>

        {/* Right: Timezone selector */}
        <div className="w-full md:w-auto flex items-center justify-end gap-2">
          <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span className="text-xs text-slate-400 hidden sm:inline">Timezone:</span>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 text-xs rounded-xl text-slate-200 focus:outline-none focus:border-red-500 max-w-[260px] truncate"
          >
            {TIMEZONES.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>

          <button
            onClick={loadBestTime}
            disabled={loading}
            title="Refresh Analysis"
            className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Unconnected Channel Notice */}
      {!user && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/30 via-slate-900 to-slate-900 border border-red-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
              <Youtube className="w-5 h-5 fill-red-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Want your channel's exact YouTube Analytics data?</p>
              <p className="text-[11px] text-slate-400">
                Connect your channel via Google OAuth to unlock private viewer retention curves and real watch-time peaks.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenConnectModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/20 shrink-0 transition"
          >
            Connect Channel
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && !data && (
        <div className="py-24 text-center space-y-4">
          <div className="w-10 h-10 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-slate-300 font-medium">Analyzing 50 recent video uploads and engagement timestamps...</p>
        </div>
      )}

      {data && (
        <div className="space-y-6">
          {/* Top 3 Best Day & Time Combinations (Plain Language) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                Top 3 Recommended Publishing Windows
              </h3>
              <span className="text-xs font-mono text-emerald-400">
                {data.dataSource === 'youtube_analytics_api'
                  ? '✓ YouTube Analytics Live Data'
                  : data.dataSource === 'verified_simulation'
                  ? '✓ Verified Sandbox Model'
                  : '✓ 50-Upload Velocity Model'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.topRecommendations.map((rec, i) => (
                <div
                  key={i}
                  className={`p-5 rounded-2xl border transition relative overflow-hidden ${
                    i === 0
                      ? 'bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border-emerald-500/40 shadow-xl shadow-emerald-950/30 ring-1 ring-emerald-500/20'
                      : 'bg-slate-900/90 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        i === 0
                          ? 'bg-emerald-500 text-emerald-950 font-black'
                          : i === 1
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {i === 0 ? '★ Best Slot (#1)' : `#${i + 1} Best Slot`}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {rec.engagementLift}
                    </span>
                  </div>

                  {/* Plain Language Announcement */}
                  <h4 className="text-lg font-black text-white tracking-tight mt-1">
                    Your best time is <span className="text-emerald-400">{rec.timeFormatted}</span>
                  </h4>

                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {rec.why}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Performance Score:</span>
                    <span className="font-bold text-white font-mono">{rec.score} / 100</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Heatmap: Days of the week vs Hours of the day */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-red-500" />
                  Audience Activity Heatmap (7 Days × 24 Hours)
                </h3>
                <p className="text-xs text-slate-400">
                  Hover or click any slot to see view velocity and engagement score adjusted to {data.timezone}.
                </p>
              </div>

              {/* Heatmap legend */}
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <span>Low</span>
                <span className="w-3 h-3 rounded bg-slate-950 border border-slate-800"></span>
                <span className="w-3 h-3 rounded bg-slate-900"></span>
                <span className="w-3 h-3 rounded bg-slate-800"></span>
                <span className="w-3 h-3 rounded bg-emerald-800"></span>
                <span className="w-3 h-3 rounded bg-emerald-600"></span>
                <span className="w-3 h-3 rounded bg-emerald-500"></span>
                <span>Peak</span>
              </div>
            </div>

            {/* Heatmap Grid */}
            <div className="overflow-x-auto pb-2">
              <div className="min-w-[680px]">
                {/* Hours column labels */}
                <div className="grid grid-cols-[60px_repeat(24,_1fr)] gap-1 mb-1 text-[10px] text-slate-500 font-mono text-center">
                  <div></div>
                  {Array.from({ length: 24 }).map((_, h) => (
                    <div key={h} className="truncate">
                      {h % 3 === 0 ? (h === 0 ? '12a' : h < 12 ? `${h}a` : h === 12 ? '12p' : `${h - 12}p`) : '·'}
                    </div>
                  ))}
                </div>

                {/* Day rows */}
                <div className="space-y-1">
                  {data.heatmap.map((row) => (
                    <div key={row.dayIndex} className="grid grid-cols-[60px_repeat(24,_1fr)] gap-1 items-center">
                      <div className="text-xs font-semibold text-slate-300 pr-2 truncate">
                        {row.shortName}
                      </div>

                      {row.hours.map((slot) => {
                        const isInspected = inspectedSlot && inspectedSlot.day === row.dayName && inspectedSlot.hour === slot.hour;
                        return (
                          <button
                            key={slot.hour}
                            onClick={() =>
                              setInspectedSlot({
                                day: row.dayName,
                                hour: slot.hour,
                                score: slot.score,
                                viewsAvg: slot.viewsAvg,
                              })
                            }
                            className={`h-7 rounded transition flex items-center justify-center text-[10px] cursor-pointer ${getHeatmapColor(
                              slot.score
                            )} ${isInspected ? 'ring-2 ring-white scale-110 z-10' : 'hover:scale-105'}`}
                            title={`${row.dayName} at ${slot.label}: Score ${slot.score}/100`}
                          >
                            {slot.score >= 90 ? '★' : ''}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Inspected Slot Details Card */}
            {inspectedSlot && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-white font-bold">
                    Selected Window: {inspectedSlot.day} at {inspectedSlot.hour === 0 ? '12 AM' : inspectedSlot.hour < 12 ? `${inspectedSlot.hour} AM` : inspectedSlot.hour === 12 ? '12 PM' : `${inspectedSlot.hour - 12} PM`}
                  </span>
                  <span className="text-slate-400">({data.timezone})</span>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <span>
                    Engagement Index: <strong className="text-emerald-400">{inspectedSlot.score}/100</strong>
                  </span>
                  <button
                    onClick={onOpenNextPlan}
                    className="text-red-400 hover:text-red-300 font-semibold underline"
                  >
                    Plan Video For This Slot &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Plain language summary */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2 text-blue-400">
              <TrendingUp className="w-4 h-4" />
              Audience Velocity Summary
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {data.audiencePeakSummary}
            </p>
          </div>

          {/* MANDATORY Guide Tip */}
          <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 flex items-start gap-3 text-xs text-blue-200">
            <HelpCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-blue-300">Creator Guide Tip: </strong>
              <span>{data.guideTip}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
