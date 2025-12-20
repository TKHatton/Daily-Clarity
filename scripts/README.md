# Test Data Scripts

This directory contains scripts for testing and validating the Daily Clarity personalization engine.

## Prerequisites

1. **Get your Supabase Service Role Key:**
   - Go to your Supabase project dashboard
   - Navigate to: Settings > API
   - Copy the `service_role` key (NOT the anon key!)
   - ⚠️ **Keep this secret!** Never commit it to version control

2. **Install ts-node (if not already installed):**
   ```bash
   npm install -D ts-node
   ```

## Scripts

### `seedTestData.ts` - Create Test Users

Creates synthetic test users with realistic conversation histories to test personalization before beta launch.

**What it creates:**
- 3 test user accounts with different personas:
  - **Anxious Anna** - Detailed communicator with work stress patterns
  - **Decisive Dan** - Concise communicator focused on decisions
  - **Relationship Ruby** - Warm communicator with boundary issues
- 4-6 conversations per user spanning multiple weeks
- Realistic themes, moods, and patterns

**How to run:**

```bash
# Set environment variables
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"

# Run the script
npx ts-node scripts/seedTestData.ts
```

**On Windows (PowerShell):**
```powershell
$env:SUPABASE_URL="https://your-project.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"
npx ts-node scripts/seedTestData.ts
```

**Expected output:**
```
🌱 Starting test data seeding...

Creating user: Anxious Anna (anna.test@dailyclarity.app)
  ✓ Created auth user (uuid-here)
  ✓ Created profile
  ✓ Inserted 6 conversations
  ✨ Anxious Anna complete!

...

🎉 Test data seeding complete!

📊 Next steps:
1. Run pattern analysis on these test users
2. Verify insights are accurate and meaningful
3. Check personalized prompts adapt correctly

Test user credentials:
  - anna.test@dailyclarity.app / TestPassword123!
  - dan.test@dailyclarity.app / TestPassword123!
  - ruby.test@dailyclarity.app / TestPassword123!
```

### After Seeding - What to Test

1. **Log in as each test user:**
   ```
   Email: anna.test@dailyclarity.app
   Password: TestPassword123!
   ```

2. **Go to the Insights page and click "Generate My Insights"**
   - Should generate 2-3 patterns per user
   - Verify patterns match the conversation themes

3. **Try a new conversation:**
   - Does the AI response adapt to communication style?
   - For Anna: Should be detailed and reassuring
   - For Dan: Should be brief and actionable
   - For Ruby: Should be warm and empathetic

4. **Check the History page:**
   - Should show all seeded conversations
   - Themes should be extracted correctly

### Validation Checklist

- [ ] All 3 test users created successfully
- [ ] Can log in as each user
- [ ] Conversations appear in History page
- [ ] Pattern analysis generates insights
- [ ] Insights are relevant to conversation themes
- [ ] New AI responses adapt to communication style
- [ ] No errors in browser console
- [ ] No errors in Supabase logs

### Troubleshooting

**Error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"**
- Make sure you've set the environment variables
- Check for typos in variable names
- On Windows, use `$env:` prefix in PowerShell

**Error: "Failed to create auth user: User already exists"**
- Test users already exist
- Either delete them manually in Supabase Auth or use different emails

**Error: "Failed to create profile"**
- Check that `user_profiles` table exists
- Run `supabase-schema.sql` if you haven't yet
- Verify RLS policies allow inserts

**Error: "permission denied for table conversations"**
- RLS policies might be too restrictive
- Check policies in Supabase dashboard
- Verify service role key has admin privileges

### Cleaning Up Test Data

To remove test users after testing:

1. Go to Supabase Dashboard > Authentication > Users
2. Find and delete test users:
   - anna.test@dailyclarity.app
   - dan.test@dailyclarity.app
   - ruby.test@dailyclarity.app

3. Their conversations and insights will be automatically deleted due to foreign key constraints

### Creating Your Own Test Data

You can edit `seedTestData.ts` to add more personas or conversations. Each test user should have:

- **Distinct communication style** (concise, warm, detailed, direct)
- **Clear stress triggers** (deadlines, conflict, uncertainty, etc.)
- **Recurring themes** (work, relationships, health, etc.)
- **At least 4-6 conversations** for meaningful pattern detection
- **Realistic timestamps** spanning 2-4 weeks

Example structure:
```typescript
{
  name: "Your Persona Name",
  email: "persona@test.com",
  password: "TestPassword123!",
  profile: {
    communication_style: "concise",
    stress_triggers: ["your", "triggers"],
    preferences: {
      helpful_approaches: ["what", "works"]
    }
  },
  conversations: [
    {
      tool_type: "mind-dump",
      user_input: "Your test input...",
      theme: "work",
      tags: ["relevant", "tags"],
      mood_before: "overwhelmed",
      helpful_rating: 4,
      created_at: "2024-01-15T10:00:00Z"
    }
    // ... more conversations
  ]
}
```

---

## Security Notes

⚠️ **Never commit your service role key to git!**

The service role key has admin access to your entire database. Keep it secret!

- ✅ Set as environment variable
- ✅ Store in password manager
- ✅ Add to `.gitignore` if in config file
- ❌ Never commit to repository
- ❌ Never share publicly
- ❌ Never use in client-side code

---

## Next Scripts to Add

Consider adding these scripts as your app grows:

- **`validatePatterns.ts`** - Manually review detected patterns
- **`exportUserData.ts`** - Export user data for analysis
- **`analyzePromptQuality.ts`** - A/B test different prompts
- **`generateReport.ts`** - Create usage statistics report
