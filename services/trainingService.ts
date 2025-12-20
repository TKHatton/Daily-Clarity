/**
 * Training Service - For pre-launch testing and validation
 *
 * This service helps you collect detailed feedback during the training phase
 * to validate that personalization is working correctly before beta launch.
 */

import { supabase } from '../lib/supabase';

export interface TrainingAnnotation {
  conversationId: string;
  whatINeeded: string;
  whatWasHelpful: string;
  whatWasMissing: string;
  emotionalAccuracy: number; // 1-5 scale
  wouldUseAgain: boolean;
  additionalNotes?: string;
}

export const trainingService = {
  /**
   * Check if training mode is enabled
   */
  isTrainingMode: (): boolean => {
    return process.env.TRAINING_MODE === 'true';
  },

  /**
   * Save detailed training annotation for a conversation
   */
  saveAnnotation: async (annotation: TrainingAnnotation): Promise<boolean> => {
    if (!trainingService.isTrainingMode()) {
      console.warn('Training mode is not enabled');
      return false;
    }

    const { error } = await supabase
      .from('training_annotations')
      .insert({
        conversation_id: annotation.conversationId,
        what_i_needed: annotation.whatINeeded,
        what_was_helpful: annotation.whatWasHelpful,
        what_was_missing: annotation.whatWasMissing,
        emotional_accuracy: annotation.emotionalAccuracy,
        would_use_again: annotation.wouldUseAgain,
        additional_notes: annotation.additionalNotes
      });

    if (error) {
      console.error('Failed to save training annotation:', error);
      return false;
    }

    return true;
  },

  /**
   * Get all training annotations for analysis
   */
  getAnnotations: async (userId: string): Promise<any[]> => {
    const { data, error } = await supabase
      .from('training_annotations')
      .select(`
        *,
        conversations!inner(
          user_id,
          tool_type,
          user_input,
          ai_response,
          theme,
          created_at
        )
      `)
      .eq('conversations.user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch annotations:', error);
      return [];
    }

    return data || [];
  },

  /**
   * Analyze annotation quality across all training sessions
   */
  analyzeTrainingQuality: async (userId: string) => {
    const annotations = await trainingService.getAnnotations(userId);

    if (annotations.length === 0) {
      return null;
    }

    const avgEmotionalAccuracy = annotations.reduce((sum, a) => sum + a.emotional_accuracy, 0) / annotations.length;
    const wouldUseAgainRate = annotations.filter(a => a.would_use_again).length / annotations.length;

    const commonMissing = annotations
      .map(a => a.what_was_missing)
      .filter(Boolean)
      .reduce((acc, item) => {
        acc[item] = (acc[item] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const commonHelpful = annotations
      .map(a => a.what_was_helpful)
      .filter(Boolean)
      .reduce((acc, item) => {
        acc[item] = (acc[item] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    return {
      totalAnnotations: annotations.length,
      avgEmotionalAccuracy: Math.round(avgEmotionalAccuracy * 10) / 10,
      wouldUseAgainRate: Math.round(wouldUseAgainRate * 100),
      mostCommonMissing: Object.entries(commonMissing).sort((a, b) => b[1] - a[1])[0]?.[0],
      mostCommonHelpful: Object.entries(commonHelpful).sort((a, b) => b[1] - a[1])[0]?.[0],
      annotations
    };
  },

  /**
   * Export training data for analysis
   */
  exportTrainingData: async (userId: string): Promise<string> => {
    const quality = await trainingService.analyzeTrainingQuality(userId);

    if (!quality) {
      return 'No training data available';
    }

    const report = `
TRAINING DATA ANALYSIS REPORT
Generated: ${new Date().toISOString()}
User ID: ${userId}

=== OVERVIEW ===
Total Training Sessions: ${quality.totalAnnotations}
Average Emotional Accuracy: ${quality.avgEmotionalAccuracy}/5
Would Use Again Rate: ${quality.wouldUseAgainRate}%
Most Common Missing Element: ${quality.mostCommonMissing || 'N/A'}
Most Common Helpful Element: ${quality.mostCommonHelpful || 'N/A'}

=== DETAILED ANNOTATIONS ===
${quality.annotations.map((a: any, idx: number) => `
Session ${idx + 1}:
Tool: ${a.conversations.tool_type}
Date: ${new Date(a.created_at).toLocaleDateString()}
What I Needed: ${a.what_i_needed}
What Was Helpful: ${a.what_was_helpful}
What Was Missing: ${a.what_was_missing}
Emotional Accuracy: ${a.emotional_accuracy}/5
Would Use Again: ${a.would_use_again ? 'Yes' : 'No'}
${a.additional_notes ? `Notes: ${a.additional_notes}` : ''}
---
`).join('\n')}

=== RECOMMENDATIONS ===
${quality.avgEmotionalAccuracy < 3.5 ? '⚠️ Low emotional accuracy - review AI prompts for empathy' : '✅ Good emotional accuracy'}
${quality.wouldUseAgainRate < 70 ? '⚠️ Low "would use again" rate - investigate user satisfaction' : '✅ High "would use again" rate'}
${quality.mostCommonMissing ? `⚠️ Commonly missing: "${quality.mostCommonMissing}" - consider adding this` : '✅ No consistent gaps identified'}
    `.trim();

    return report;
  }
};
