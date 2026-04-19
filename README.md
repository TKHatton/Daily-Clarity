# Daily Clarity

An AI-powered thinking assistant that helps you organize mental clutter, communicate difficult messages, and make decisions with calm confidence.

## What This Is

Daily Clarity is a personal clarity tool with 5 AI-powered features designed for moments when you're stuck, overwhelmed, or struggling to find the right words. It learns from your patterns over time to provide increasingly personalized support.

**Target users:** Professionals, caregivers, anyone who needs help processing thoughts and communicating clearly under pressure.

## The 5 Tools

### 1. Mind Dump
**For when your brain is full and you can't think straight.**

Dump everything on your mind - unfiltered, messy, stream of consciousness. The AI helps you organize the chaos into clear categories and actionable next steps.

*Use when:* You're overwhelmed, can't sleep because your mind is racing, or need to clear mental space before focusing.

### 2. Find Words
**For when you know what you feel but can't articulate it.**

Describe the situation and what you're trying to say. The AI helps you find clear, kind language that communicates your truth without unnecessary harm.

*Use when:* You need to have a difficult conversation, set a boundary, or express something you've been avoiding.

### 3. Decision Helper
**For when you're stuck between options and can't move forward.**

Talk through your decision without judgment. The AI helps you see angles you might be missing, identify what's really holding you back, and clarify what matters most.

*Use when:* You're paralyzed by a choice, second-guessing yourself, or need a thinking partner who won't push their own agenda.

### 4. Write The Hard Thing
**For when you need to write something difficult - an email, a message, a letter.**

Explain the situation and what you need to communicate. The AI helps you draft it with honesty and care, then refine until it feels right.

*Use when:* Resignation letters, tough feedback, apologies, boundary-setting emails, or any written communication you've been avoiding.

### 5. Quick Reset
**For when you're spiraling and need to come back to center.**

A structured 2-minute reset process. Answer a few questions, get grounded, identify one next step. No deep processing - just enough to function.

*Use when:* You're in crisis mode, having a bad day, or need to reset before a meeting/call.

## Key Features

- **Personalization Engine:** Learns your communication style, recurring themes, and stress triggers over time
- **Pattern Recognition:** Identifies when similar situations arise and offers relevant insights
- **No Judgment:** AI is trained to be supportive without being preachy or prescriptive
- **Privacy First:** Your data stays yours (with proper RLS when Supabase is connected)

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS + Framer Motion animations
- **AI:** Google Gemini API
- **Database/Auth:** Supabase (PostgreSQL + Auth)
- **Deployment:** Netlify

## Project Structure

```
├── components/          # React components (Layout, Card, Button, etc.)
├── contexts/            # React context (AuthContext)
├── lib/                 # Supabase client setup
├── pages/               # Route pages (Home, Dashboard, Tools, etc.)
├── services/            # Business logic
│   ├── geminiService.ts      # AI response generation
│   ├── dbService.ts          # Database operations
│   ├── personalizationService.ts  # User profile analysis
│   └── patternAnalysisService.ts  # Conversation pattern detection
├── types.ts             # TypeScript types
└── supabase-schema.sql  # Database schema
```

## Setup

### Prerequisites
- Node.js 18+
- Supabase account (free tier works)
- Google AI API key (Gemini)

### 1. Install dependencies
```bash
npm install
```

### 2. Set up Supabase
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the contents of `supabase-schema.sql`
3. Go to Settings > API and copy your Project URL and anon key

### 3. Configure environment variables

Create `.env.local`:
```
GEMINI_API_KEY=your_gemini_api_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

### 4. Run locally
```bash
npm run dev
```

App runs at http://localhost:3000

## Database Schema

Four tables with Row Level Security (users can only access their own data):

- **user_profiles** - Extended user data, communication style, themes, triggers
- **conversations** - All tool interactions with metadata (mood, theme, rating)
- **user_insights** - AI-generated patterns and suggestions
- **training_annotations** - Optional quality evaluation for beta testing

## Deployment

Currently configured for Netlify:

1. Connect repo to Netlify
2. Set environment variables in Netlify dashboard:
   - `GEMINI_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
3. Deploy

**Note:** The Gemini API key is currently exposed client-side. For production, move AI calls to Netlify Functions.

## Roadmap

- [x] Core app built and functional
- [x] All 5 tools implemented
- [x] Supabase auth and database integration
- [x] Personalization engine
- [x] Netlify deployment configured
- [ ] Landing page with value proposition
- [ ] Stripe integration for payments
- [ ] Move Gemini API to serverless functions (security)
- [ ] Production Supabase project

## License

Proprietary - not open source.
