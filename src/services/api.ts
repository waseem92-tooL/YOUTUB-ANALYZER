import type {
  AuthStatusResponse,
  ChannelData,
  AiAuditReport,
  VideoIdea,
  SeoOptimizationResult,
  UserProfile,
  ChannelComparisonResult,
  ScriptDoctorResult,
  ThumbnailStudioResult,
} from '../types.ts';

export async function fetchAuthStatus(): Promise<AuthStatusResponse> {
  const res = await fetch('/api/auth/status');
  if (!res.ok) throw new Error('Failed to fetch auth status');
  return res.json();
}

export async function getGoogleAuthUrl(): Promise<{ url: string; redirectUri: string; scopes: string[] }> {
  const res = await fetch('/api/auth/google/url');
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to generate Google OAuth URL');
  }
  return data;
}

export async function simulateConnect(persona = 'tech'): Promise<{ success: boolean; user: UserProfile }> {
  const res = await fetch('/api/auth/simulate-connect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ persona }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Simulation connection failed');
  return data;
}

export async function logoutUser(): Promise<void> {
  const res = await fetch('/api/auth/logout', { method: 'POST' });
  if (!res.ok) throw new Error('Logout failed');
}

export async function saveCredentials(creds: {
  clientId?: string;
  clientSecret?: string;
  youtubeApiKey?: string;
}): Promise<any> {
  const res = await fetch('/api/config/save-credentials', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(creds),
  });
  return res.json();
}

export async function fetchMyDashboard(): Promise<{ channel: ChannelData; privateAnalytics: any }> {
  const res = await fetch('/api/channel/my-dashboard');
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch dashboard');
  }
  return data;
}

export async function analyzePublicChannel(query: string): Promise<{
  source: string;
  channel: ChannelData;
  restrictedMetricsExplanation: any;
}> {
  const res = await fetch('/api/youtube/analyze-public', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to analyze public channel');
  }
  return data;
}

export async function requestAiAudit(channel: ChannelData): Promise<AiAuditReport> {
  const res = await fetch('/api/ai/audit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ channel }),
  });
  if (!res.ok) throw new Error('Failed to generate AI Audit');
  return res.json();
}

export async function requestVideoIdeas(channel: ChannelData, topic?: string): Promise<VideoIdea[]> {
  const res = await fetch('/api/ai/video-ideator', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ channel, topic }),
  });
  if (!res.ok) throw new Error('Failed to generate video ideas');
  return res.json();
}

export async function requestSeoOptimization(title: string, targetNiche?: string): Promise<SeoOptimizationResult> {
  const res = await fetch('/api/ai/seo-optimizer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, targetNiche }),
  });
  if (!res.ok) throw new Error('Failed to optimize SEO');
  return res.json();
}

export async function requestChannelComparison(channelA: ChannelData, channelB: ChannelData): Promise<ChannelComparisonResult> {
  const res = await fetch('/api/ai/compare-channels', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ channelA, channelB }),
  });
  if (!res.ok) throw new Error('Failed to compare channels');
  return res.json();
}

export async function requestScriptDoctor(scriptIntro: string, targetAudience?: string): Promise<ScriptDoctorResult> {
  const res = await fetch('/api/ai/script-doctor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scriptIntro, targetAudience }),
  });
  if (!res.ok) throw new Error('Failed to diagnose script');
  return res.json();
}

export async function requestThumbnailStudio(title: string, niche?: string): Promise<ThumbnailStudioResult> {
  const res = await fetch('/api/ai/thumbnail-studio', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, niche }),
  });
  if (!res.ok) throw new Error('Failed to generate thumbnail concepts');
  return res.json();
}

export async function fetchBestTimeToPost(params: {
  channelHandleOrId?: string;
  timezone?: string;
  useConnected?: boolean;
}): Promise<any> {
  const res = await fetch('/api/analytics/best-time', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to analyze best posting time');
  return data;
}

export async function requestKeywordGap(params: {
  videoInput: string;
  existingTags?: string[];
  existingDescription?: string;
  topic?: string;
}): Promise<any> {
  const res = await fetch('/api/ai/keyword-gap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to check keyword gap');
  return data;
}

export async function requestNextVideoPlan(params: {
  channel?: ChannelData;
  niche?: string;
}): Promise<any> {
  const res = await fetch('/api/ai/next-video-plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to generate next video plan');
  return data;
}

