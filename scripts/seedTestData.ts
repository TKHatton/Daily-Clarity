/**
 * Test Data Seeding Script for Daily Clarity
 *
 * This creates synthetic users with realistic conversation histories
 * to test the personalization engine before beta launch.
 *
 * Usage: node --loader ts-node/esm scripts/seedTestData.ts
 * (or use ts-node if installed)
 */

import { createClient } from '@supabase/supabase-js';

// You'll need admin credentials for this
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''; // NOT anon key!

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

interface TestConversation {
  tool_type: string;
  user_input: string;
  theme: string;
  decision_type?: string;
  tags: string[];
  mood_before: string;
  mood_after?: string;
  helpful_rating: number;
  created_at: string;
}

interface TestUser {
  name: string;
  email: string;
  password: string;
  profile: {
    communication_style: 'concise' | 'warm' | 'detailed' | 'direct';
    stress_triggers: string[];
    preferences: {
      helpful_approaches: string[];
    };
  };
  conversations: TestConversation[];
}

const testUsers: TestUser[] = [
  {
    name: "Anxious Anna",
    email: "anna.test@dailyclarity.app",
    password: "TestPassword123!",
    profile: {
      communication_style: "detailed",
      stress_triggers: ["deadlines", "perfectionism", "letting people down"],
      preferences: {
        helpful_approaches: ["breaking tasks down", "permission to be imperfect"]
      }
    },
    conversations: [
      // Week 1 - Work stress pattern begins
      {
        tool_type: "mind-dump",
        user_input: "I have this presentation on Friday and I keep rewriting the slides and nothing feels good enough and I'm running out of time and my manager is going to think I'm incompetent...",
        theme: "work",
        decision_type: "career",
        tags: ["deadlines", "perfectionism"],
        mood_before: "overwhelmed",
        mood_after: "slightly calmer",
        helpful_rating: 4,
        created_at: "2024-01-08T09:30:00Z"
      },
      {
        tool_type: "decision-helper",
        user_input: "Should I ask for help with this project or just power through? I don't want to look incompetent but I'm drowning...",
        theme: "work",
        decision_type: "career",
        tags: ["asking for help", "perfectionism"],
        mood_before: "anxious",
        mood_after: "clearer",
        helpful_rating: 5,
        created_at: "2024-01-08T14:20:00Z"
      },
      // Week 2 - Pattern continues
      {
        tool_type: "mind-dump",
        user_input: "Another deadline. Another panic. Why do I do this to myself every single time?",
        theme: "work",
        tags: ["deadlines", "self-criticism"],
        mood_before: "overwhelmed",
        helpful_rating: 3,
        created_at: "2024-01-15T08:15:00Z"
      },
      {
        tool_type: "write-hard",
        user_input: "I need to tell my manager I need more time on this report but I already asked for an extension last month...",
        theme: "work",
        tags: ["deadlines", "boundaries"],
        mood_before: "anxious",
        mood_after: "relieved",
        helpful_rating: 5,
        created_at: "2024-01-22T16:45:00Z"
      },
      // Week 3 - Relationship boundary issue
      {
        tool_type: "find-words",
        user_input: "My friend keeps asking me to help with her project but I'm so behind on my own work. I don't know how to say no without hurting her feelings.",
        theme: "relationships",
        tags: ["boundaries", "people pleasing"],
        mood_before: "stuck",
        mood_after: "supported",
        helpful_rating: 4,
        created_at: "2024-01-29T19:00:00Z"
      },
      // Week 4 - Health anxiety surfaces
      {
        tool_type: "mind-dump",
        user_input: "I've been having these headaches and I googled it and now I'm convinced something is seriously wrong even though the doctor said I'm fine...",
        theme: "health",
        tags: ["health anxiety", "catastrophizing"],
        mood_before: "anxious",
        helpful_rating: 4,
        created_at: "2024-02-05T22:30:00Z"
      }
    ]
  },

  {
    name: "Decisive Dan",
    email: "dan.test@dailyclarity.app",
    password: "TestPassword123!",
    profile: {
      communication_style: "concise",
      stress_triggers: ["uncertainty", "too many options", "analysis paralysis"],
      preferences: {
        helpful_approaches: ["pros/cons lists", "clear next steps", "binary choices"]
      }
    },
    conversations: [
      {
        tool_type: "decision-helper",
        user_input: "Job offer. 20% raise. But startup. Risk vs security?",
        theme: "work",
        decision_type: "career",
        tags: ["risk", "money"],
        mood_before: "stuck",
        mood_after: "clear",
        helpful_rating: 5,
        created_at: "2024-01-10T19:00:00Z"
      },
      {
        tool_type: "decision-helper",
        user_input: "Move to Austin or stay in SF? Cheaper vs network?",
        theme: "life",
        decision_type: "personal",
        tags: ["money", "career"],
        mood_before: "stuck",
        helpful_rating: 4,
        created_at: "2024-01-17T12:30:00Z"
      },
      {
        tool_type: "quick-reset",
        user_input: "Been researching cars for weeks. Too many options. Just need to pick one.",
        theme: "life",
        tags: ["analysis paralysis"],
        mood_before: "overwhelmed",
        mood_after: "clear",
        helpful_rating: 5,
        created_at: "2024-01-24T15:00:00Z"
      },
      {
        tool_type: "decision-helper",
        user_input: "Gym membership vs home equipment? Budget $500.",
        theme: "health",
        decision_type: "personal",
        tags: ["money", "commitment"],
        mood_before: "stuck",
        helpful_rating: 4,
        created_at: "2024-01-31T18:00:00Z"
      },
      {
        tool_type: "decision-helper",
        user_input: "Keep freelancing or take full-time role? Freedom vs stability.",
        theme: "work",
        decision_type: "career",
        tags: ["career", "risk"],
        mood_before: "stuck",
        mood_after: "clear",
        helpful_rating: 5,
        created_at: "2024-02-07T10:00:00Z"
      }
    ]
  },

  {
    name: "Relationship Ruby",
    email: "ruby.test@dailyclarity.app",
    password: "TestPassword123!",
    profile: {
      communication_style: "warm",
      stress_triggers: ["conflict", "disappointing others", "saying no"],
      preferences: {
        helpful_approaches: ["reframing", "permission to prioritize self", "scripts for tough conversations"]
      }
    },
    conversations: [
      {
        tool_type: "write-hard",
        user_input: "I need to tell my best friend I can't be her maid of honor because I'm overwhelmed with work and my own stuff but she's going to be so hurt...",
        theme: "relationships",
        tags: ["boundaries", "guilt"],
        mood_before: "anxious",
        mood_after: "supported",
        helpful_rating: 5,
        created_at: "2024-01-05T21:00:00Z"
      },
      {
        tool_type: "find-words",
        user_input: "My partner keeps asking me to move in but I'm not ready and I don't know how to say that without it sounding like I don't love them",
        theme: "relationships",
        decision_type: "personal",
        tags: ["boundaries", "communication"],
        mood_before: "stuck",
        helpful_rating: 4,
        created_at: "2024-01-12T18:30:00Z"
      },
      {
        tool_type: "write-hard",
        user_input: "My mom keeps making comments about my weight and I need to set a boundary but I don't want to hurt her feelings",
        theme: "relationships",
        tags: ["boundaries", "family"],
        mood_before: "anxious",
        mood_after: "empowered",
        helpful_rating: 5,
        created_at: "2024-01-19T20:00:00Z"
      },
      {
        tool_type: "mind-dump",
        user_input: "I feel like I'm always the one reaching out to my friends and planning things and I'm tired but if I stop will anyone even notice?",
        theme: "relationships",
        tags: ["people pleasing", "self-worth"],
        mood_before: "overwhelmed",
        helpful_rating: 4,
        created_at: "2024-01-26T22:00:00Z"
      },
      {
        tool_type: "find-words",
        user_input: "My coworker keeps taking credit for my ideas in meetings and I need to address it without seeming petty",
        theme: "work",
        tags: ["boundaries", "conflict"],
        mood_before: "stuck",
        mood_after: "clear",
        helpful_rating: 5,
        created_at: "2024-02-02T14:00:00Z"
      }
    ]
  }
];

async function seedTestData() {
  console.log('🌱 Starting test data seeding...\n');

  for (const testUser of testUsers) {
    console.log(`Creating user: ${testUser.name} (${testUser.email})`);

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: testUser.email,
      password: testUser.password,
      email_confirm: true,
      user_metadata: {
        full_name: testUser.name
      }
    });

    if (authError) {
      console.error(`  ❌ Failed to create auth user: ${authError.message}`);
      continue;
    }

    const userId = authData.user.id;
    console.log(`  ✓ Created auth user (${userId})`);

    // Create profile (trigger should auto-create, but we'll update with test data)
    const { error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .upsert({
        id: userId,
        name: testUser.name,
        email: testUser.email,
        communication_style: testUser.profile.communication_style,
        stress_triggers: testUser.profile.stress_triggers,
        preferences: testUser.profile.preferences,
        total_sessions: testUser.conversations.length
      });

    if (profileError) {
      console.error(`  ❌ Failed to create profile: ${profileError.message}`);
      continue;
    }
    console.log(`  ✓ Created profile`);

    // Insert conversations
    for (const convo of testUser.conversations) {
      const { error: convoError } = await supabaseAdmin
        .from('conversations')
        .insert({
          user_id: userId,
          ...convo
        });

      if (convoError) {
        console.error(`    ❌ Failed to insert conversation: ${convoError.message}`);
      }
    }
    console.log(`  ✓ Inserted ${testUser.conversations.length} conversations`);
    console.log(`  ✨ ${testUser.name} complete!\n`);
  }

  console.log('🎉 Test data seeding complete!');
  console.log('\n📊 Next steps:');
  console.log('1. Run pattern analysis on these test users');
  console.log('2. Verify insights are accurate and meaningful');
  console.log('3. Check personalized prompts adapt correctly');
  console.log('\nTest user credentials:');
  testUsers.forEach(u => {
    console.log(`  - ${u.email} / ${u.password}`);
  });
}

// Run the seed function
seedTestData().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
