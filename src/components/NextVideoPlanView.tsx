import React, { useState, useEffect } from 'react';
import {
  Rocket,
  Sparkles,
  Copy,
  Check,
  Calendar,
  Clock,
  Tag,
  HelpCircle,
  Video,
  Layers,
  Image as ImageIcon,
  Flame,
  ArrowRight,
  Youtube,
  RefreshCw,
  Search,
  AlertCircle,
} from 'lucide-react';
import type { NextVideoPlanResponse, NextVideoPlanIdea, ChannelData, UserProfile } from '../types.ts';
import { requestNextVideoPlan } from '../services/api.ts';

interface NextVideoPlanViewProps {
  user: UserProfile | null;
  channel: ChannelData | null;
  onOpenConnectModal: () => void;
  onOpenSeoStudio: (topic: string) => void;
  onOpenBestTime: () => void;
}

export const NextVideoPlanView: React.FC<NextVideoPlanViewProps> = ({
  user,
  channel,
  onOpenConnectModal,
  onOpenSeoStudio,
  onOpenBestTime,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<NextVideoPlanResponse | null>(null);
  const [niche, setNiche] = useState<string>('Tech & Content Strategy');

  // Copied states per idea ID
  const [copiedIdeaId, setCopiedIdeaId] = useState<string | null>(null);
  const [copiedHookId, setCopiedHookId] = useState<string | null>(null);

  const loadPlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const activeChannel = channel || (user ? {
        id: user.channelId || 'my_channel',
        title: user.channelTitle || user.name,
        description: '',
        publishedAt: '',
        thumbnails: { default: { url: user.picture } },
        statistics: {
          subscriberCount: String(user.subscriberCount || '150000'),
          viewCount: String(user.viewCount || '18000000'),
          videoCount: String(user.videoCount || '90'),
          hiddenSubscriberCount: false,
        },
      } : undefined);

      const data = await requestNextVideoPlan({
        channel: activeChannel,
        niche,
      });
      setPlan(data);
    } catch (err: any) {
      setError(err.message || 'Failed to generate next video plan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlan();
  }, [user?.id, channel?.id]);

  const copyFullIdea = (idea: NextVideoPlanIdea) => {
    const text = `Title: ${idea.title}
Best Publish Time: ${idea.bestPublishTime}
Description: ${idea.shortDescription}
First 15s Hook: "${idea.hook15s}"
Thumbnail Concept: ${idea.thumbnailIdea}
Tags: ${idea.tags.join(', ')}`;

    navigator.clipboard.writeText(text);
    setCopiedIdeaId(idea.id);
    setTimeout(() => setCopiedIdeaId(null), 2000);
  };

  const copyHookOnly = (idea: NextVideoPlanIdea) => {
    navigator.clipboard.writeText(idea.hook15s);
    setCopiedHookId(idea.id);
    setTimeout(() => setCopiedHookId(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
          <Rocket className="w-3.5 h-3.5" />
          <span>Algorithmic Pattern Blueprinter</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Next Video Plan
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          AI pattern analysis of your top-performing videos across topics, packaging, length, and hooks.
          Get 5 complete production blueprints ready for your next viral upload.
        </p>
      </div>

      {/* Channel & Controls bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 font-bold shrink-0">
            <Video className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Analyzing Creator Patterns For</span>
            <span className="text-xs font-bold text-white">
              {channel?.title || user?.channelTitle || user?.name || 'Creator Hub'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <input
            type="text"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            placeholder="Niche focus..."
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-red-500 max-w-[200px]"
          />
          <button
            onClick={loadPlan}
            disabled={loading}
            className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs shadow-md shadow-red-600/30 flex items-center gap-1.5 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Generate New 5 Ideas</span>
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
              <p className="text-xs font-bold text-white">Want blueprints tailored to your personal video library?</p>
              <p className="text-[11px] text-slate-400">
                Connect your YouTube channel to analyze your highest-retention videos and subscriber demographics.
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
      {loading && !plan && (
        <div className="py-24 text-center space-y-4">
          <div className="w-10 h-10 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-slate-300 font-medium">Extracting performance patterns from top videos...</p>
        </div>
      )}

      {/* Plan Results */}
      {plan && (
        <div className="space-y-6">
          {/* Top Performance Patterns Detected */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Patterns Detected in Top-Performing Videos
              </h3>
              <span className="text-[10px] font-mono bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                Algorithmic DNA
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Winning Topics</span>
                <p className="text-white font-semibold line-clamp-2">
                  {plan.patternsDetected.topTopics.join(', ')}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Optimal Video Length</span>
                <p className="text-emerald-400 font-bold font-mono text-sm">
                  {plan.patternsDetected.optimalLength}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Title Formula</span>
                <p className="text-slate-300 text-[11px] leading-snug">
                  {plan.patternsDetected.titleStylePattern}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Thumbnail Blueprint</span>
                <p className="text-slate-300 text-[11px] leading-snug">
                  {plan.patternsDetected.thumbnailStylePattern}
                </p>
              </div>
            </div>
          </div>

          {/* 5 Next Video Blueprints */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-red-500" />
                5 High-Demand Video Blueprints
              </h3>
              <span className="text-xs font-mono text-slate-500">Includes 15s Hook, 10 Tags & Publishing Slot</span>
            </div>

            <div className="space-y-4">
              {plan.ideas.map((idea, idx) => (
                <div
                  key={idea.id || idx}
                  className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition shadow-xl space-y-4"
                >
                  {/* Top Bar: Number, Title, Target Angle and Copy Full Idea */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start sm:items-center gap-3">
                      <span className="w-7 h-7 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center font-black text-xs shrink-0">
                        {idx + 1}
                      </span>
                      <div>
                        <h4 className="text-base font-extrabold text-white tracking-tight">
                          {idea.title}
                        </h4>
                        <span className="text-[11px] text-amber-400 font-medium">
                          {idea.targetAngle}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => copyFullIdea(idea)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-700"
                      >
                        {copiedIdeaId === idea.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedIdeaId === idea.id ? 'Copied All' : 'Copy Blueprint'}</span>
                      </button>

                      <button
                        onClick={() => onOpenSeoStudio(idea.title)}
                        className="px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 text-xs font-semibold flex items-center gap-1 transition border border-red-500/30"
                      >
                        <span>SEO Studio</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Best Publishing Slot Badge */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Best Day & Time to Publish:</span>
                      <strong className="text-emerald-400 font-mono">{idea.bestPublishTime}</strong>
                    </div>

                    <button
                      onClick={onOpenBestTime}
                      className="text-[11px] text-slate-400 hover:text-white underline font-medium"
                    >
                      View Heatmap &rarr;
                    </button>
                  </div>

                  {/* 15s Hook Script Box */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase text-purple-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        First 15 Seconds Hook Script (Speak Word-for-Word)
                      </span>
                      <button
                        onClick={() => copyHookOnly(idea)}
                        className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                      >
                        {copiedHookId === idea.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedHookId === idea.id ? 'Copied' : 'Copy Hook'}</span>
                      </button>
                    </div>
                    <p className="text-xs text-slate-200 font-mono italic leading-relaxed">
                      "{idea.hook15s}"
                    </p>
                  </div>

                  {/* Description & Thumbnail Concept */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Short Description</span>
                      <p className="text-slate-300 leading-relaxed">{idea.shortDescription}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" />
                        Thumbnail Visual Blueprint
                      </span>
                      <p className="text-slate-300 leading-relaxed">{idea.thumbnailIdea}</p>
                    </div>
                  </div>

                  {/* 10 Targeted Tags */}
                  <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                      <Tag className="w-3 h-3 text-slate-500" />
                      10 Targeted Tags:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {idea.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MANDATORY Guide Tip */}
          <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 flex items-start gap-3 text-xs text-blue-200">
            <HelpCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-blue-300">Creator Guide Tip: </strong>
              <span>{plan.guideTip}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
