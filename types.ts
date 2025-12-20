import React from 'react';

export type ToolId = 'mind-dump' | 'find-words' | 'decision-helper' | 'write-hard' | 'quick-reset';
export type CommunicationStyle = 'concise' | 'warm' | 'detailed' | 'direct' | 'unspecified';

export interface Tool {
  id: ToolId;
  name: string;
  description: string;
  icon: React.ReactNode;
  promptLabel: string;
  buttonLabel: string;
  systemPrompt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  subscriptionStatus: 'Active' | 'Cancelled' | 'None';
  usageCount: number;
  communicationStyle?: CommunicationStyle;
  commonThemes?: string[];
  stressTriggers?: string[];
}

export interface UserInsight {
  id: string;
  userId: string;
  type: 'recurring_pattern' | 'trigger_pattern' | 'growth_insight';
  title: string;
  description: string;
  suggestion: string;
  evidenceCount: number;
  confidence: number;
  timestamp: number;
}

export interface ToolResult {
  id: string;
  toolId: ToolId;
  input: string;
  output: string;
  timestamp: number;
  theme?: string;
  emotion?: string;
  helpfulRating?: number;
}
