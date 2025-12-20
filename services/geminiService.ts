import { GoogleGenAI, Type } from "@google/genai";
import { User, UserInsight } from "../types";

export const generateClarityResponse = async (
  systemInstruction: string, 
  userInput: string,
  userContext?: string
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const fullInstruction = userContext 
    ? `${systemInstruction}\n\nIMPORTANT CONTEXT ABOUT THIS USER:\n${userContext}`
    : systemInstruction;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userInput,
      config: {
        systemInstruction: fullInstruction,
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const extractConversationMetadata = async (userInput: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this thought and return a JSON object with: 
      1. main_theme (e.g. work, family, self, finance)
      2. primary_emotion (e.g. anxious, excited, overwhelmed, stuck)
      3. triggers (array of strings, e.g. ["deadlines", "unclear expectations"])
      
      Input: ${userInput}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            main_theme: { type: Type.STRING },
            primary_emotion: { type: Type.STRING },
            triggers: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["main_theme", "primary_emotion", "triggers"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.warn("Metadata extraction failed", error);
    return null;
  }
};

export const buildUserContext = (user: User, recentInsights: UserInsight[]) => {
  let context = "";
  
  if (user.communicationStyle === 'concise') {
    context += "- This user prefers brief, direct responses. Avoid wordiness.\n";
  } else if (user.communicationStyle === 'detailed') {
    context += "- This user appreciates depth and thorough reasoning.\n";
  } else if (user.communicationStyle === 'warm') {
    context += "- Use a gentle, empathetic, and supportive tone.\n";
  }

  if (user.commonThemes && user.commonThemes.length > 0) {
    context += `- This user frequently deals with ${user.commonThemes.join(', ')}-related stress.\n`;
  }

  if (recentInsights.length > 0) {
    recentInsights.forEach(insight => {
      if (insight.confidence > 0.7) {
        context += `- Observed Pattern: ${insight.description}\n`;
      }
    });
  }

  return context || "- This is a relatively new user, no specific patterns identified yet.";
};
