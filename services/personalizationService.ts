import { GoogleGenAI, Type } from "@google/genai";
import { ToolResult, User, UserInsight, CommunicationStyle } from "../types";
import { dbService } from "./dbService";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const personalizationService = {
  /**
   * Analyzes history to determine communication style and recurring themes
   */
  refreshUserProfile: async (userId: string, history: ToolResult[]): Promise<Partial<User> | null> => {
    if (history.length < 2) return null;

    const recentInputs = history.slice(0, 10).map(h => h.input).join("\n---\n");
    
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze these user inputs and determine:
        1. communication_style: Choose one: 'concise', 'warm', 'detailed', or 'direct'.
        2. recurring_themes: Top 3 life themes (e.g., work, relationships, health).
        3. common_triggers: Top 3 stress triggers.

        Inputs:
        ${recentInputs}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              communication_style: { type: Type.STRING },
              recurring_themes: { type: Type.ARRAY, items: { type: Type.STRING } },
              common_triggers: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["communication_style", "recurring_themes", "common_triggers"]
          }
        }
      });

      const data = JSON.parse(response.text || "{}");
      const updates: Partial<User> = {
        communicationStyle: data.communication_style as CommunicationStyle,
        commonThemes: data.recurring_themes,
        stressTriggers: data.common_triggers
      };

      await dbService.updateProfile(userId, updates);
      return updates;
    } catch (e) {
      console.error("Profile refresh failed", e);
      return null;
    }
  },

  /**
   * Generates deep insights by looking at the entire history and persists them
   */
  generateDeepInsights: async (userId: string, history: ToolResult[]): Promise<UserInsight[]> => {
    if (history.length < 3) return [];

    const dataDump = history.slice(0, 15).map(h => ({
      tool: h.toolId,
      input: h.input,
      theme: h.theme,
      emotion: h.emotion
    }));

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Act as a professional pattern analyst. Review these thinking sessions and find 3 profound insights about the user's mental habits.
        
        Data: ${JSON.stringify(dataDump)}
        
        Return a JSON array of objects with:
        title: Short punchy title
        description: What is the pattern?
        suggestion: What can they do?
        type: Choose 'recurring_pattern' or 'trigger_pattern'
        confidence: 0.0 to 1.0`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                suggestion: { type: Type.STRING },
                type: { type: Type.STRING },
                confidence: { type: Type.NUMBER }
              },
              required: ["title", "description", "suggestion", "type", "confidence"]
            }
          }
        }
      });

      const insightsData = JSON.parse(response.text || "[]");
      
      const insights: UserInsight[] = [];
      for (const d of insightsData) {
        const saved = await dbService.saveInsight(userId, {
          title: d.title,
          description: d.description,
          suggestion: d.suggestion,
          type: d.type as any,
          confidence: d.confidence,
          evidenceCount: history.length
        });
        if (saved) {
          insights.push({
            id: saved.id,
            userId: saved.user_id,
            title: saved.insight_data.title,
            description: saved.insight_data.pattern,
            suggestion: saved.insight_data.suggestion,
            type: saved.insight_type,
            confidence: saved.confidence_score,
            evidenceCount: saved.insight_data.evidence_count,
            timestamp: new Date(saved.created_at).getTime()
          });
        }
      }

      return insights;
    } catch (e) {
      console.error("Deep insights generation failed", e);
      return [];
    }
  }
};
