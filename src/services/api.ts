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
  BestTimeAnalysisResponse,
  KeywordGapResponse,
  NextVideoPlanResponse,
} from '../types.ts';

/**
 * Safe JSON parsing fetch helper for Cloudflare Worker & API routes.
 * Ensures all /api/... calls receive valid JSON with clear, friendly error messages on syntax failures.
 */
export async function safeFetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const defaultHeaders: Record<string, string> = {
    'Accept': 'application/json',
  };

  if (options?.body && typeof options.body === 'string') {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const mergedHeaders = {
    ...defaultHeaders,
    ...((options?.headers as Record<string, string>) || {}),
  };

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      credentials: options?.credentials || 'include',
      headers: mergedHeaders,
    });
  } catch (netErr: any) {
    throw new Error(`Network connection error calling ${url}: ${netErr.message || 'Please check your internet connection.'}`);
  }

  const rawText = await response.text();

  let parsed: any;
  try {
    parsed = JSON.parse(rawText);
  } catch (parseErr: any) {
    const preview = rawText.slice(0, 140).replace(/\s+/g, ' ');
    throw new Error(
      `Invalid JSON response from server at ${url} (HTTP ${response.status} ${response.statusText}). Server responded: "${preview}${rawText.length > 140 ? '...' : ''}". Expected Content-Type: application/json.`
    );
  }

  if (!response.ok) {
    const errorMsg =
      parsed?.error ||
      parsed?.message ||
      `API request to ${url} failed with status ${response.status} (${response.statusText})`;
    throw new Error(errorMsg);
  }

  return parsed as T;
}

// -------------------------------------------------------------
// 1. Auth Status & Edge Session Check
// -------------------------------------------------------------
export async function fetchAuthStatus(): Promise<AuthStatusResponse> {
  try {
    return await safeFetchJson<AuthStatusResponse>('/api/auth/status');
  } catch (err: any) {
    console.warn('Could not fetch session from /api/auth/status, checking local state:', err);
    return {
      authenticated: false,
      user: null,
      config: {
        hasGoogleClientId: false,
        hasGoogleClientSecret: false,
        hasYoutubeApiKey: false,
        hasGeminiKey: false,
        redirectUriDev: typeof window !== 'undefined' ? `${window.location.origin}/api/auth/callback` : '/api/auth/callback',
        redirectUriShared: typeof window !== 'undefined' ? `${window.location.origin}/api/auth/callback` : '/api/auth/callback',
        activeRedirectUri: typeof window !== 'undefined' ? `${window.location.origin}/api/auth/callback` : '/api/auth/callback',
        environment: 'production',
      },
    };
  }
}

// -------------------------------------------------------------
// 2. Google OAuth URL / Authorization
// -------------------------------------------------------------
export async function getGoogleAuthUrl(): Promise<{
  url: string;
  redirectUri: string;
  scopes: string[];
  configured?: boolean;
}> {
  return await safeFetchJson<{
    url: string;
    redirectUri: string;
    scopes: string[];
    configured?: boolean;
  }>('/api/auth/login');
}

// -------------------------------------------------------------
// 3. Simulated Connection (Instant Verification)
// -------------------------------------------------------------
export async function simulateConnect(persona = 'tech'): Promise<{ success: boolean; user: UserProfile; channel?: ChannelData }> {
  return await safeFetchJson<{ success: boolean; user: UserProfile; channel?: ChannelData }>(
    '/api/auth/simulate-connect',
    {
      method: 'POST',
      body: JSON.stringify({ persona }),
    }
  );
}

// -------------------------------------------------------------
// 4. Logout / Disconnect Channel
// -------------------------------------------------------------
export async function logoutUser(): Promise<{ success: boolean; message?: string }> {
  return await safeFetchJson<{ success: boolean; message?: string }>('/api/auth/logout', {
    method: 'POST',
  });
}

// -------------------------------------------------------------
// 5. Save Credentials (Worker & Local State)
// -------------------------------------------------------------
export async function saveCredentials(creds: {
  clientId?: string;
  clientSecret?: string;
  youtubeApiKey?: string;
  geminiApiKey?: string;
}): Promise<any> {
  return await safeFetchJson('/api/config/save-credentials', {
    method: 'POST',
    body: JSON.stringify(creds),
  });
}

// -------------------------------------------------------------
// 6. Authorized Channel Dashboard
// -------------------------------------------------------------
export async function fetchMyDashboard(): Promise<{ channel: ChannelData; privateAnalytics: any }> {
  return await safeFetchJson<{ channel: ChannelData; privateAnalytics: any }>('/api/channel/my-dashboard');
}

// -------------------------------------------------------------
// 7. Analyze Public Channel
// -------------------------------------------------------------
export async function analyzePublicChannel(query: string): Promise<{
  source: string;
  channel: ChannelData;
  restrictedMetricsExplanation: any;
}> {
  const encoded = encodeURIComponent(query.trim());
  return await safeFetchJson<{
    source: string;
    channel: ChannelData;
    restrictedMetricsExplanation: any;
  }>(`/api/youtube/analyze-public?query=${encoded}`);
}

// -------------------------------------------------------------
// 8. AI Channel Audit
// -------------------------------------------------------------
export async function requestAiAudit(channel: ChannelData): Promise<AiAuditReport> {
  return await safeFetchJson<AiAuditReport>('/api/ai/audit', {
    method: 'POST',
    body: JSON.stringify({ channel }),
  });
}

// -------------------------------------------------------------
// 9. Viral Video Ideas Generator
// -------------------------------------------------------------
export async function requestVideoIdeas(channel: ChannelData, topic?: string): Promise<VideoIdea[]> {
  return await safeFetchJson<VideoIdea[]>('/api/ai/video-ideator', {
    method: 'POST',
    body: JSON.stringify({ channel, topic }),
  });
}

// -------------------------------------------------------------
// 10. AI SEO Optimizer
// -------------------------------------------------------------
export async function requestSeoOptimization(title: string, targetNiche?: string): Promise<SeoOptimizationResult> {
  return await safeFetchJson<SeoOptimizationResult>('/api/ai/seo-optimizer', {
    method: 'POST',
    body: JSON.stringify({ title, targetNiche }),
  });
}

// -------------------------------------------------------------
// 11. Channel Comparison / Benchmark
// -------------------------------------------------------------
export async function requestChannelComparison(channelA: ChannelData, channelB: ChannelData): Promise<ChannelComparisonResult> {
  return await safeFetchJson<ChannelComparisonResult>('/api/ai/compare-channels', {
    method: 'POST',
    body: JSON.stringify({ channelA, channelB }),
  });
}

// -------------------------------------------------------------
// 12. Script Doctor
// -------------------------------------------------------------
export async function requestScriptDoctor(scriptIntro: string, targetAudience?: string): Promise<ScriptDoctorResult> {
  return await safeFetchJson<ScriptDoctorResult>('/api/ai/script-doctor', {
    method: 'POST',
    body: JSON.stringify({ scriptIntro, targetAudience }),
  });
}

// -------------------------------------------------------------
// 13. Thumbnail Studio
// -------------------------------------------------------------
export async function requestThumbnailStudio(title: string, niche?: string): Promise<ThumbnailStudioResult> {
  return await safeFetchJson<ThumbnailStudioResult>('/api/ai/thumbnail-studio', {
    method: 'POST',
    body: JSON.stringify({ title, niche }),
  });
}

// -------------------------------------------------------------
// 14. FEATURE 1: Best Time to Post
// -------------------------------------------------------------
export async function fetchBestTimeToPost(params: {
  channelHandleOrId?: string;
  timezone?: string;
  useConnected?: boolean;
}): Promise<BestTimeAnalysisResponse> {
  const query = new URLSearchParams({
    channelHandleOrId: params.channelHandleOrId || '',
    timezone: params.timezone || 'America/New_York',
    useConnected: String(!!params.useConnected),
  });

  return await safeFetchJson<BestTimeAnalysisResponse>(`/api/analytics/best-time?${query.toString()}`);
}

// -------------------------------------------------------------
// 15. FEATURE 2: Keyword Gap Checker
// -------------------------------------------------------------
export async function requestKeywordGap(params: {
  videoInput: string;
  existingTags?: string[];
  existingDescription?: string;
  topic?: string;
}): Promise<KeywordGapResponse> {
  return await safeFetchJson<KeywordGapResponse>('/api/ai/keyword-gap', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// -------------------------------------------------------------
// 16. FEATURE 3: Next Video Plan
// -------------------------------------------------------------
export async function requestNextVideoPlan(params: {
  channel?: ChannelData;
  niche?: string;
}): Promise<NextVideoPlanResponse> {
  return await safeFetchJson<NextVideoPlanResponse>('/api/ai/next-video-plan', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
