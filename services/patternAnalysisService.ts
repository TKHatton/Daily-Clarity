/**
 * Pattern Analysis Service
 *
 * Advanced analytics for discovering user patterns across multiple dimensions
 */

import { ToolResult } from '../types';

export interface TimePatterns {
  byHour: Record<number, number>;
  byDayOfWeek: Record<string, number>;
  mostActiveHour: number;
  mostActiveDay: string;
  preferredTimeRange: 'morning' | 'afternoon' | 'evening' | 'night';
}

export interface ThemePatterns {
  themes: Array<{ theme: string; count: number; percentage: number }>;
  topTheme: string;
  diversity: number; // 0-1, how diverse their topics are
}

export interface EmotionalPatterns {
  emotions: Array<{ emotion: string; count: number; percentage: number }>;
  mostCommon: string;
  improvementRate: number; // percentage where mood improved after session
}

export interface ToolUsagePatterns {
  byTool: Record<string, number>;
  favoriteTools: string[];
  leastUsedTools: string[];
  usageBalance: number; // 0-1, how evenly distributed usage is
}

export interface SessionTrends {
  totalSessions: number;
  weeklyAverage: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  streakDays: number;
  lastActive: Date | null;
}

export const patternAnalysisService = {
  /**
   * Analyze time-based patterns
   */
  analyzeTimePatterns: (results: ToolResult[]): TimePatterns => {
    const byHour: Record<number, number> = {};
    const byDayOfWeek: Record<string, number> = {};
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    results.forEach(result => {
      const date = new Date(result.timestamp);
      const hour = date.getHours();
      const day = days[date.getDay()];

      byHour[hour] = (byHour[hour] || 0) + 1;
      byDayOfWeek[day] = (byDayOfWeek[day] || 0) + 1;
    });

    const mostActiveHour = parseInt(
      Object.entries(byHour).sort((a, b) => b[1] - a[1])[0]?.[0] || '12'
    );

    const mostActiveDay = Object.entries(byDayOfWeek).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Monday';

    let preferredTimeRange: 'morning' | 'afternoon' | 'evening' | 'night' = 'afternoon';
    if (mostActiveHour >= 5 && mostActiveHour < 12) preferredTimeRange = 'morning';
    else if (mostActiveHour >= 12 && mostActiveHour < 17) preferredTimeRange = 'afternoon';
    else if (mostActiveHour >= 17 && mostActiveHour < 22) preferredTimeRange = 'evening';
    else preferredTimeRange = 'night';

    return {
      byHour,
      byDayOfWeek,
      mostActiveHour,
      mostActiveDay,
      preferredTimeRange
    };
  },

  /**
   * Analyze theme patterns
   */
  analyzeThemePatterns: (results: ToolResult[]): ThemePatterns => {
    const themeCounts: Record<string, number> = {};
    const total = results.length;

    results.forEach(result => {
      if (result.theme) {
        themeCounts[result.theme] = (themeCounts[result.theme] || 0) + 1;
      }
    });

    const themes = Object.entries(themeCounts)
      .map(([theme, count]) => ({
        theme,
        count,
        percentage: Math.round((count / total) * 100)
      }))
      .sort((a, b) => b.count - a.count);

    const topTheme = themes[0]?.theme || 'general';

    // Calculate diversity (Shannon entropy normalized)
    const diversity = themes.length > 0
      ? themes.reduce((sum, t) => {
          const p = t.count / total;
          return sum - p * Math.log2(p);
        }, 0) / Math.log2(themes.length)
      : 0;

    return {
      themes,
      topTheme,
      diversity: Math.round(diversity * 100) / 100
    };
  },

  /**
   * Analyze emotional patterns
   */
  analyzeEmotionalPatterns: (results: ToolResult[]): EmotionalPatterns => {
    const emotionCounts: Record<string, number> = {};
    const total = results.length;
    let improved = 0;

    results.forEach(result => {
      if (result.emotion) {
        emotionCounts[result.emotion] = (emotionCounts[result.emotion] || 0) + 1;
      }

      // Count improvement (based on helpful rating as proxy)
      if (result.helpfulRating && result.helpfulRating >= 4) {
        improved++;
      }
    });

    const emotions = Object.entries(emotionCounts)
      .map(([emotion, count]) => ({
        emotion,
        count,
        percentage: Math.round((count / total) * 100)
      }))
      .sort((a, b) => b.count - a.count);

    const mostCommon = emotions[0]?.emotion || 'neutral';
    const improvementRate = Math.round((improved / total) * 100);

    return {
      emotions,
      mostCommon,
      improvementRate
    };
  },

  /**
   * Analyze tool usage patterns
   */
  analyzeToolUsagePatterns: (results: ToolResult[]): ToolUsagePatterns => {
    const byTool: Record<string, number> = {};
    const total = results.length;

    results.forEach(result => {
      byTool[result.toolId] = (byTool[result.toolId] || 0) + 1;
    });

    const sorted = Object.entries(byTool).sort((a, b) => b[1] - a[1]);

    const favoriteTools = sorted.slice(0, 2).map(t => t[0]);
    const leastUsedTools = sorted.slice(-2).map(t => t[0]);

    // Calculate balance (how evenly distributed usage is)
    const expected = total / Object.keys(byTool).length;
    const variance = Object.values(byTool).reduce((sum, count) => {
      return sum + Math.pow(count - expected, 2);
    }, 0) / Object.keys(byTool).length;
    const usageBalance = 1 - Math.min(Math.sqrt(variance) / expected, 1);

    return {
      byTool,
      favoriteTools,
      leastUsedTools,
      usageBalance: Math.round(usageBalance * 100) / 100
    };
  },

  /**
   * Analyze session trends over time
   */
  analyzeSessionTrends: (results: ToolResult[]): SessionTrends => {
    if (results.length === 0) {
      return {
        totalSessions: 0,
        weeklyAverage: 0,
        trend: 'stable',
        streakDays: 0,
        lastActive: null
      };
    }

    const sorted = [...results].sort((a, b) => a.timestamp - b.timestamp);
    const firstDate = new Date(sorted[0].timestamp);
    const lastDate = new Date(sorted[sorted.length - 1].timestamp);
    const daysDiff = Math.max(
      Math.ceil((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)),
      1
    );

    const weeklyAverage = Math.round((results.length / daysDiff) * 7);

    // Calculate trend (comparing first half vs second half)
    const midpoint = Math.floor(results.length / 2);
    const firstHalf = sorted.slice(0, midpoint);
    const secondHalf = sorted.slice(midpoint);

    const firstHalfDays = Math.max(
      (new Date(firstHalf[firstHalf.length - 1].timestamp).getTime() -
        new Date(firstHalf[0].timestamp).getTime()) /
        (1000 * 60 * 60 * 24),
      1
    );

    const secondHalfDays = Math.max(
      (new Date(secondHalf[secondHalf.length - 1].timestamp).getTime() -
        new Date(secondHalf[0].timestamp).getTime()) /
        (1000 * 60 * 60 * 24),
      1
    );

    const firstHalfRate = firstHalf.length / firstHalfDays;
    const secondHalfRate = secondHalf.length / secondHalfDays;

    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (secondHalfRate > firstHalfRate * 1.2) trend = 'increasing';
    else if (secondHalfRate < firstHalfRate * 0.8) trend = 'decreasing';

    // Calculate streak (consecutive days with activity)
    const dates = results.map(r => new Date(r.timestamp).toDateString());
    const uniqueDates = [...new Set(dates)].sort();
    let streakDays = 1;
    for (let i = uniqueDates.length - 1; i > 0; i--) {
      const current = new Date(uniqueDates[i]);
      const previous = new Date(uniqueDates[i - 1]);
      const diffDays = Math.round(
        (current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diffDays === 1) {
        streakDays++;
      } else {
        break;
      }
    }

    return {
      totalSessions: results.length,
      weeklyAverage,
      trend,
      streakDays,
      lastActive: lastDate
    };
  },

  /**
   * Generate a comprehensive pattern report
   */
  generateFullReport: (results: ToolResult[]) => {
    return {
      timePatterns: patternAnalysisService.analyzeTimePatterns(results),
      themePatterns: patternAnalysisService.analyzeThemePatterns(results),
      emotionalPatterns: patternAnalysisService.analyzeEmotionalPatterns(results),
      toolUsagePatterns: patternAnalysisService.analyzeToolUsagePatterns(results),
      sessionTrends: patternAnalysisService.analyzeSessionTrends(results)
    };
  }
};
