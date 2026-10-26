import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  Flame,
  ArrowRight,
  Wand2,
  Image,
  Tag,
  Clock,
  Play,
} from 'lucide-react';
import type { VideoIdea, ChannelData } from '../types.ts';
import { requestVideoIdeas } from '../services/api.ts';

interface AiIdeatorProps {
  channel: ChannelData | null;
  onSendToSeo: (title: string) => void;
}

export const AiIdeator: React.FC<AiIdeatorProps> = ({ channel, onSendToSeo }) => {
  const [topic, setTopic] = useState(channel?.title ? `${channel.title} content strategy` : 'Tech, AI & YouTube scaling');
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<VideoIdea[] | null>(null);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const data = await requestVideoIdeas(channel || {
        id: 'generic',
        title: topic,
        description: topic,
        publishedAt: '',
        thumbnails: {},
        statistics: { viewCount: '10000', subscriberCount: '1000', hiddenSubscriberCount: false, videoCount: '10' },
      }, topic);
      setIdeas(data);
    } catch (err) {
      console.error('Failed to generate video ideas:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gemini 2.5 Viral Video Concept Engine</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Generate High-Retention Video Concepts
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          Produce viral video ideas tailored to current algorithmic demand. Includes opening hooks,
          thumbnail visual blueprints, and keyword targets.
        </p>
      </div>

      {/* Input Form */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter niche, channel focus, or specific topic to brainstorm..."
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 text-white shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition shrink-0 active:scale-95"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span>Ideating Concepts...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate 5 Viral Concepts</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Results List */}
      {ideas && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>High Viral Potential Concepts ({ideas.length})</span>
            <span className="text-[11px] font-mono text-emerald-400">Algorithmic Scoring Ready</span>
          </div>

          <div className="space-y-4">
            {ideas.map((idea, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-3.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-red-600/20 text-red-400 border border-red-500/30 font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h3 className="font-bold text-sm sm:text-base text-white">
                      {idea.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        idea.viralPotential === 'Extreme'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {idea.viralPotential} Potential
                    </span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                      {idea.format}
                    </span>
                  </div>
                </div>

                {/* 5-second Hook Script */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                  <span className="text-[10px] uppercase font-bold text-amber-400 block mb-1">
                    First 5 Seconds Hook Script:
                  </span>
                  <p className="text-slate-200 italic font-mono">"{idea.hook}"</p>
                </div>

                {/* Thumbnail Visual Blueprint */}
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-blue-400 flex items-center gap-1.5">
                    <Image className="w-3 h-3" />
                    Thumbnail Visual Blueprint:
                  </span>
                  <p className="text-slate-400 leading-relaxed">{idea.thumbnailConcept}</p>
                </div>

                {/* Keywords & Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1 border-t border-slate-800/80">
                  <div className="flex flex-wrap gap-1.5">
                    {idea.targetKeywords?.map((kw, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 font-mono"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => onSendToSeo(idea.title)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/30 font-semibold flex items-center gap-1.5 transition ml-auto"
                  >
                    <Wand2 className="w-3 h-3 text-red-400" />
                    <span>Send to SEO Studio</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
