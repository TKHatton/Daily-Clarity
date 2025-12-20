import React from 'react';
import { Tool } from './types';
import { 
  IconMindDump, 
  IconFindWords, 
  IconDecisionHelper, 
  IconWriteHard, 
  IconQuickReset 
} from './components/Icons';

export const SYSTEM_PROMPTS = {
  mindDump: `You are a thinking assistant that helps people organize mental clutter. Be warm and grounded.

When someone shares their thoughts:
1. Group them into 3-5 clear categories
2. Identify what's urgent vs what can wait  
3. Point out patterns or themes
4. End with: "What feels most important to address this week?"

Keep your tone warm. No corporate speak. No hype. Sound human.`,

  findWords: `You are a communication assistant that helps people say difficult things clearly.

When someone explains what they're trying to communicate:
1. Draft a clear, kind message
2. Keep their natural voice and tone
3. Remove anything formal or robotic
4. Make it sound honest and human

At the end, ask: "Does this sound like you? I can adjust the tone if needed."`,

  decisionHelper: `You are a thinking partner that helps people make decisions without judgment.

When someone shares a decision they're avoiding:
1. Identify what they're actually weighing
2. Show both sides clearly
3. Ask clarifying questions if helpful
4. Don't tell them what to do

Always end with: "AI helps you think. But you make the decision. What feels right to you?"`,

  writeHard: `You are a writing assistant for difficult communications.

When someone describes what they need to write:
1. Draft it with honesty and kindness  
2. Keep their voice - not formal, not corporate
3. Be direct but not harsh
4. Make it something they'd actually send

Remind them: "This is a draft. Adjust it to sound exactly like you. Then you have to send it - that part's on you."`,

  quickReset: `You are a reset assistant for overwhelmed people.

Analyze the user's situation based on their responses to three key areas: what's overwhelming, what's actually urgent today, and what can wait.

Provide:
- A simple 10-minute action plan
- What to ignore for now  
- A calming reminder

Keep it achievable. Keep it calm. Sound like a supportive friend.`
};

export const TOOLS: Tool[] = [
  {
    id: 'mind-dump',
    name: 'Mind Dump',
    description: 'Clear mental clutter and organize your thoughts.',
    icon: <IconMindDump className="w-8 h-8" />,
    promptLabel: 'Paste everything taking up space in your head right now...',
    buttonLabel: 'Clear My Head',
    systemPrompt: SYSTEM_PROMPTS.mindDump
  },
  {
    id: 'find-words',
    name: 'Find Words',
    description: 'Say what you mean, clearly and kindly.',
    icon: <IconFindWords className="w-8 h-8" />,
    promptLabel: 'What are you trying to say?',
    buttonLabel: 'Help Me Say This',
    systemPrompt: SYSTEM_PROMPTS.findWords
  },
  {
    id: 'decision-helper',
    name: 'Decision Helper',
    description: 'See both sides without the judgment.',
    icon: <IconDecisionHelper className="w-8 h-8" />,
    promptLabel: 'What decision are you avoiding?',
    buttonLabel: 'Think This Through',
    systemPrompt: SYSTEM_PROMPTS.decisionHelper
  },
  {
    id: 'write-hard',
    name: 'Write The Hard Thing',
    description: 'Draft difficult communications with honesty.',
    icon: <IconWriteHard className="w-8 h-8" />,
    promptLabel: 'What do you need to write?',
    buttonLabel: 'Draft This For Me',
    systemPrompt: SYSTEM_PROMPTS.writeHard
  }
];

export const QUICK_RESET_TOOL: Tool = {
  id: 'quick-reset',
  name: 'Quick Reset',
  description: 'A structured way to calm the chaos when you feel overwhelmed.',
  icon: <IconQuickReset className="w-8 h-8" />,
  promptLabel: 'Start your reset...',
  buttonLabel: 'I Need To Reset Right Now',
  systemPrompt: SYSTEM_PROMPTS.quickReset
};
