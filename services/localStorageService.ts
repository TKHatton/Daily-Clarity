/**
 * LocalStorage-based data service for Daily Clarity
 *
 * This is the FREE tier - no Supabase, no accounts, all data stored locally.
 * Same interface as dbService so it's a drop-in replacement.
 *
 * Limitations:
 * - Data is device-locked (no cross-device sync)
 * - Data can be lost if browser storage is cleared
 * - No real user accounts (uses a local pseudo-user)
 */

import { User, ToolResult, UserInsight } from '../types';

const STORAGE_KEYS = {
  USER_PROFILE: 'daily_clarity_profile',
  CONVERSATIONS: 'daily_clarity_conversations',
  INSIGHTS: 'daily_clarity_insights',
} as const;

// Generate a stable local user ID (persists across sessions)
const getLocalUserId = (): string => {
  const key = 'daily_clarity_local_user_id';
  let userId = localStorage.getItem(key);
  if (!userId) {
    userId = 'local_' + crypto.randomUUID();
    localStorage.setItem(key, userId);
  }
  return userId;
};

// Default local user profile
const createDefaultProfile = (): User => ({
  id: getLocalUserId(),
  email: 'local@dailyclarity.app',
  name: 'You',
  subscriptionStatus: 'Active',
  usageCount: 0,
  communicationStyle: 'unspecified',
  commonThemes: [],
  stressTriggers: [],
});

export const localStorageService = {
  getProfile: async (_userId?: string): Promise<User | null> => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (stored) {
        return JSON.parse(stored);
      }
      // Create default profile on first access
      const defaultProfile = createDefaultProfile();
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(defaultProfile));
      return defaultProfile;
    } catch {
      return createDefaultProfile();
    }
  },

  updateProfile: async (_userId: string, updates: Partial<User>): Promise<void> => {
    try {
      const current = await localStorageService.getProfile();
      const updated = { ...current, ...updates, last_active: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  },

  saveResult: async (
    _userId: string,
    result: Omit<ToolResult, 'id' | 'timestamp'> & { theme?: string; emotion?: string; triggers?: string[] }
  ): Promise<boolean> => {
    try {
      const conversations = await localStorageService.getResults(_userId);
      const newResult: ToolResult = {
        id: crypto.randomUUID(),
        toolId: result.toolId,
        input: result.input,
        output: result.output,
        timestamp: Date.now(),
        theme: result.theme,
        emotion: result.emotion,
        helpfulRating: undefined,
      };

      conversations.unshift(newResult); // Add to front (newest first)

      // Keep only last 100 conversations to manage storage
      const trimmed = conversations.slice(0, 100);
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(trimmed));

      // Increment usage count
      const profile = await localStorageService.getProfile();
      if (profile) {
        await localStorageService.updateProfile(_userId, {
          usageCount: (profile.usageCount || 0) + 1
        });
      }

      return true;
    } catch (error) {
      console.error('Failed to save result:', error);
      return false;
    }
  },

  getResults: async (_userId: string): Promise<ToolResult[]> => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      if (stored) {
        return JSON.parse(stored);
      }
      return [];
    } catch {
      return [];
    }
  },

  saveRating: async (resultId: string, rating: number): Promise<void> => {
    try {
      const conversations = await localStorageService.getResults('');
      const updated = conversations.map(conv =>
        conv.id === resultId ? { ...conv, helpfulRating: rating } : conv
      );
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save rating:', error);
    }
  },

  saveInsight: async (
    _userId: string,
    insight: Omit<UserInsight, 'id' | 'userId' | 'timestamp'>
  ): Promise<UserInsight | null> => {
    try {
      const insights = await localStorageService.getInsights(_userId);
      const newInsight: UserInsight = {
        id: crypto.randomUUID(),
        userId: getLocalUserId(),
        type: insight.type,
        title: insight.title,
        description: insight.description,
        suggestion: insight.suggestion,
        evidenceCount: insight.evidenceCount,
        confidence: insight.confidence,
        timestamp: Date.now(),
      };

      insights.unshift(newInsight);

      // Keep only last 50 insights
      const trimmed = insights.slice(0, 50);
      localStorage.setItem(STORAGE_KEYS.INSIGHTS, JSON.stringify(trimmed));

      return newInsight;
    } catch (error) {
      console.error('Failed to save insight:', error);
      return null;
    }
  },

  getInsights: async (_userId: string): Promise<UserInsight[]> => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.INSIGHTS);
      if (stored) {
        return JSON.parse(stored);
      }
      return [];
    } catch {
      return [];
    }
  },

  // Helper to get the local user for auth-free mode
  getLocalUser: (): User => {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (stored) {
      return JSON.parse(stored);
    }
    return createDefaultProfile();
  },

  // Check if any local data exists
  hasLocalData: (): boolean => {
    return !!(
      localStorage.getItem(STORAGE_KEYS.USER_PROFILE) ||
      localStorage.getItem(STORAGE_KEYS.CONVERSATIONS) ||
      localStorage.getItem(STORAGE_KEYS.INSIGHTS)
    );
  },

  // Clear all local data (for "logout" or reset)
  clearAllData: (): void => {
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.CONVERSATIONS);
    localStorage.removeItem(STORAGE_KEYS.INSIGHTS);
    localStorage.removeItem('daily_clarity_local_user_id');
  },
};
