import { User, ToolResult, UserInsight } from '../types';
import { supabase } from '../lib/supabase';

export const dbService = {
  getProfile: async (userId: string): Promise<User | null> => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) return null;
    return {
      ...data,
      communicationStyle: data.communication_style,
      commonThemes: data.common_themes,
      stressTriggers: data.stress_triggers,
      usageCount: data.total_sessions || 0,
      subscriptionStatus: 'Active' // Mapping for UI
    };
  },

  updateProfile: async (userId: string, updates: Partial<User>) => {
    const dbUpdates: any = {};
    if (updates.communicationStyle) dbUpdates.communication_style = updates.communicationStyle;
    if (updates.commonThemes) dbUpdates.common_themes = updates.commonThemes;
    if (updates.stressTriggers) dbUpdates.stress_triggers = updates.stressTriggers;
    if (updates.usageCount !== undefined) dbUpdates.total_sessions = updates.usageCount;
    dbUpdates.last_active = new Date().toISOString();

    await supabase
      .from('user_profiles')
      .update(dbUpdates)
      .eq('id', userId);
  },

  saveResult: async (userId: string, result: Omit<ToolResult, 'id' | 'timestamp'> & { theme?: string; emotion?: string; triggers?: string[] }) => {
    const { error } = await supabase
      .from('conversations')
      .insert({
        user_id: userId,
        tool_type: result.toolId,
        user_input: result.input,
        ai_response: result.output,
        theme: result.theme,
        mood_before: result.emotion,
        tags: result.triggers
      });
    
    if (!error) {
      const profile = await dbService.getProfile(userId);
      if (profile) {
        await dbService.updateProfile(userId, { usageCount: (profile.usageCount || 0) + 1 });
      }
    }
    return !error;
  },

  getResults: async (userId: string): Promise<ToolResult[]> => {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) return [];
    return data.map(item => ({
      id: item.id,
      toolId: item.tool_type,
      input: item.user_input,
      output: item.ai_response,
      timestamp: new Date(item.created_at).getTime(),
      theme: item.theme,
      emotion: item.mood_before,
      helpfulRating: item.helpful_rating
    }));
  },

  saveRating: async (resultId: string, rating: number) => {
    await supabase
      .from('conversations')
      .update({ helpful_rating: rating })
      .eq('id', resultId);
  },

  saveInsight: async (userId: string, insight: Omit<UserInsight, 'id' | 'userId' | 'timestamp'>) => {
    const { data, error } = await supabase
      .from('user_insights')
      .insert({
        user_id: userId,
        insight_type: insight.type,
        insight_data: {
          title: insight.title,
          pattern: insight.description,
          suggestion: insight.suggestion,
          evidence_count: insight.evidenceCount
        },
        confidence_score: insight.confidence
      })
      .select()
      .single();
    
    return error ? null : data;
  },

  getInsights: async (userId: string): Promise<UserInsight[]> => {
    const { data, error } = await supabase
      .from('user_insights')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) return [];
    return data.map(item => ({
      id: item.id,
      userId: item.user_id,
      type: item.insight_type,
      title: item.insight_data?.title || "Discovered Pattern",
      description: item.insight_data?.pattern || "",
      suggestion: item.insight_data?.suggestion || "",
      evidenceCount: item.insight_data?.evidence_count || 0,
      confidence: item.confidence_score,
      timestamp: new Date(item.created_at).getTime()
    }));
  }
};
