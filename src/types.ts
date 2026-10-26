export interface UserProfile {
  id: string;
  name: string;
  email: string;
  picture: string;
  channelId?: string;
  channelTitle?: string;
  channelCustomUrl?: string;
  channelThumbnail?: string;
  subscriberCount?: number;
  videoCount?: number;
  viewCount?: number;
  isSimulation?: boolean;
  connectedAt?: string;
}

export interface ChannelStatistics {
  viewCount: string;
  subscriberCount: string;
  hiddenSubscriberCount: boolean;
  videoCount: string;
  commentCount?: string;
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnails: {
    default?: { url: string };
    medium?: { url: string };
    high?: { url: string };
  };
  statistics?: {
    viewCount?: string;
    likeCount?: string;
    commentCount?: string;
  };
  duration?: string;
  tags?: string[];
}

export interface ChannelData {
  id: string;
  title: string;
  description: string;
  customUrl?: string;
  publishedAt: string;
  thumbnails: {
    default?: { url: string };
    medium?: { url: string };
    high?: { url: string };
  };
  bannerImageUrl?: string;
  country?: string;
  statistics: ChannelStatistics;
  recentVideos?: VideoItem[];
  isAuthorizedUserChannel?: boolean;
  isSimulation?: boolean;
  keywords?: string[];
}

export interface ConfigStatus {
  hasGoogleClientId: boolean;
  hasGoogleClientSecret: boolean;
  hasYoutubeApiKey: boolean;
  hasGeminiKey: boolean;
  redirectUriDev: string;
  redirectUriShared: string;
  activeRedirectUri: string;
  environment: 'development' | 'production';
}

export interface AuthStatusResponse {
  authenticated: boolean;
  user: UserProfile | null;
  config: ConfigStatus;
}

export interface AiAuditReport {
  overallScore: number;
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D';
  summary: string;
  keyStrengths: string[];
  growthBottlenecks: string[];
  uploadCadenceAnalysis: string;
  titleAndThumbnailReview: string;
  seoRecommendations: string[];
  strategicNextSteps: string[];
}

export interface VideoIdea {
  title: string;
  hook: string;
  thumbnailConcept: string;
  targetKeywords: string[];
  viralPotential: 'Extreme' | 'High' | 'Medium';
  format: 'Short' | 'Standard (8-15 min)' | 'Deep Dive (20+ min)';
}

export interface SeoOptimizationResult {
  titleVariations: {
    curiosity: string;
    highStakes: string;
    searchOptimized: string;
  };
  description: string;
  tags: string[];
  thirtySecondHook: string;
  estimatedClickThroughRateBoost: string;
}

export interface ChannelComparisonResult {
  winner: string;
  verdictSummary: string;
  contentStrategyContrast: string;
  channelAAdvantages: string[];
  channelBAdvantages: string[];
  growthOpportunitiesForA: string[];
  benchmarkScore: {
    channelA: number;
    channelB: number;
  };
}

export interface ScriptDoctorResult {
  retentionScore: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
  estimatedFirstMinuteRetention: string;
  weakPhrasesDetected: string[];
  strengths: string[];
  pacingFeedback: string;
  punchyRewrite: string;
  curiosityRating: string;
}

export interface ThumbnailConcept {
  badgeText: string;
  focalSubject: string;
  backgroundDescription: string;
  colorPalette: {
    primary: string;
    accent: string;
    background: string;
  };
  aiImagePrompt: string;
  ctrExpectedImpact: string;
}

export interface ThumbnailStudioResult {
  concepts: ThumbnailConcept[];
  psychologicalTriggers: string[];
  thumbnailRules: string[];
}

export interface BestTimeSlotRecommendation {
  day: string;
  hour: number;
  timeFormatted: string;
  score: number;
  why: string;
  engagementLift: string;
}

export interface HeatmapHourSlot {
  hour: number;
  score: number;
  viewsAvg: number;
  engagementScore: number;
  videoCount: number;
  label: string;
}

export interface HeatmapDayRow {
  dayIndex: number;
  dayName: string;
  shortName: string;
  hours: HeatmapHourSlot[];
}

export interface BestTimeAnalysisResponse {
  channelTitle: string;
  timezone: string;
  topRecommendations: BestTimeSlotRecommendation[];
  heatmap: HeatmapDayRow[];
  audiencePeakSummary: string;
  analyzedVideoCount: number;
  dataSource: 'youtube_analytics_api' | 'public_upload_velocity' | 'verified_simulation';
  guideTip: string;
}

export interface KeywordGapResponse {
  analyzedTitle: string;
  seoScore: number;
  scoreGrade: 'A+' | 'A' | 'B' | 'C' | 'D';
  scoreExplanation: string;
  rankingDiagnosis: string;
  missingKeywords: string[];
  weakKeywords: string[];
  irrelevantTags: string[];
  topCompetitorKeywords: string[];
  suggestedTitle: string;
  suggestedDescriptionOpening: string;
  suggestedTags: string[];
  guideTip: string;
}

export interface NextVideoPlanIdea {
  id: string;
  title: string;
  tags: string[];
  shortDescription: string;
  hook15s: string;
  thumbnailIdea: string;
  bestPublishTime: string;
  targetAngle: string;
}

export interface NextVideoPlanResponse {
  channelTitle: string;
  patternsDetected: {
    topTopics: string[];
    optimalLength: string;
    titleStylePattern: string;
    thumbnailStylePattern: string;
  };
  ideas: NextVideoPlanIdea[];
  guideTip: string;
}
