# Waitlist Feature Setup Guide

This guide will help you integrate the waitlist feature into your Conflict Wire Next.js website.

## Overview

The waitlist feature allows visitors to sign up with their full name and email address. All submissions are stored in Sanity CMS where you can manage them.

## What's Been Created

### 1. Sanity Studio Schema
- ✅ `schemaTypes/waitlist.ts` - Schema for storing waitlist entries
- ✅ Schema includes: full name, email, status (pending/approved/contacted), signup date, and notes

### 2. Library Files
- ✅ `lib/sanity.types.ts` - Updated with Waitlist TypeScript interface
- ✅ `lib/sanity.server.ts` - Server-side client with write permissions

### 3. Example Files (to be copied to your Next.js project)
- 📁 `nextjs-examples/api/waitlist-route.ts` - API endpoint
- 📁 `nextjs-examples/components/WaitlistForm.tsx` - Form component
- 📁 `nextjs-examples/components/WaitlistModal.tsx` - Modal version

## Setup Instructions

### Step 1: Deploy Sanity Schema

First, deploy the updated schema to Sanity:

\`\`\`bash
cd "C:\\Users\\pokame\\Conflict Wire"
npm run deploy
\`\`\`

### Step 2: Get Sanity API Token

1. Go to https://www.sanity.io/manage/personal/tokens
2. Click "Add API Token"
3. Name it something like "Conflict Wire Production"
4. Select **Editor** permissions (required for write access)
5. Copy the token

### Step 3: Copy Files to Next.js Project

Copy the following files from `lib/` to your Next.js project:

\`\`\`bash
# Copy these files to your Next.js project's lib folder:
- lib/sanity.server.ts
- lib/sanity.types.ts (updated)
- lib/sanity.client.ts
- lib/sanity.queries.ts
- lib/sanity.image.ts
\`\`\`

### Step 4: Create API Route

Copy the API route to your Next.js project:

\`\`\`bash
# Copy this file:
nextjs-examples/api/waitlist-route.ts

# To this location in your Next.js project:
app/api/waitlist/route.ts
\`\`\`

### Step 5: Add Components

Copy the components to your Next.js project:

\`\`\`bash
# Copy these files:
nextjs-examples/components/WaitlistForm.tsx
nextjs-examples/components/WaitlistModal.tsx

# To this location in your Next.js project:
app/components/WaitlistForm.tsx
app/components/WaitlistModal.tsx
\`\`\`

### Step 6: Environment Variables

Add the Sanity API token to your Next.js project's \`.env.local\`:

\`\`\`env
NEXT_PUBLIC_SANITY_PROJECT_ID=meyoc37a
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_token_here_from_step_2
\`\`\`

⚠️ **Important**: Never commit the \`.env.local\` file to git!

### Step 7: Install Dependencies

Make sure you have the required dependencies in your Next.js project:

\`\`\`bash
npm install @sanity/client next-sanity
\`\`\`

### Step 8: Integrate into Landing Page

Now you can add the waitlist to your landing page. You have two options:

#### Option A: Modal Version (Recommended)

Replace the existing button in the "Become an exclusive member today" section:

\`\`\`tsx
import {WaitlistModal} from '@/components/WaitlistModal'

// In your landing page component:
<section className="membership-section">
  <h2>Get the inside story on the world's update</h2>
  <WaitlistModal />
</section>
\`\`\`

#### Option B: Inline Form

Use the form directly in your page:

\`\`\`tsx
import {WaitlistForm} from '@/components/WaitlistForm'

// In your landing page component:
<section className="membership-section">
  <h2>Get the inside story on the world's update</h2>
  <p>Become an exclusive member today</p>
  <WaitlistForm className="max-w-md mx-auto" />
</section>
\`\`\`

### Step 9: Customize Styling

The components use Tailwind CSS classes. Adjust the styling to match your website's design:

- Edit the button styles in \`WaitlistModal.tsx\`
- Customize form input styles in \`WaitlistForm.tsx\`
- Update colors, fonts, and spacing as needed

## Managing Waitlist Entries

### View Entries in Sanity Studio

1. Go to your Sanity Studio: https://www.sanity.io/@oqffWMJGe/studio/x2sc5o1ilf92x7h4d73iqxy8
2. You'll see a new "Waitlist" section in the sidebar
3. Click to view all waitlist entries

### Entry Information

Each entry includes:
- **Full Name**: The person's name
- **Email**: Their email address
- **Status**: pending → approved → contacted
- **Signed Up At**: Timestamp of submission
- **Notes**: Internal notes you can add

### Workflow

1. **Pending**: New submissions appear with "pending" status
2. **Approved**: Mark entries you want to contact
3. **Contacted**: Mark as contacted after reaching out

## Testing

### Test the Integration

1. Start your Next.js development server
2. Navigate to your landing page
3. Click the membership button
4. Fill out the form with test data
5. Submit the form
6. Check Sanity Studio to see the entry

### Test Scenarios

- ✅ Submit with valid data
- ✅ Try submitting the same email twice (should show error)
- ✅ Submit with invalid email format (should show error)
- ✅ Submit with missing fields (should show error)

## Deployment

### Environment Variables on Vercel/Netlify

Add these environment variables to your production deployment:

\`\`\`
NEXT_PUBLIC_SANITY_PROJECT_ID=meyoc37a
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_production_token
\`\`\`

### CORS Configuration

If you encounter CORS errors, add your production domain to Sanity's CORS origins:

\`\`\`bash
cd "C:\\Users\\pokame\\Conflict Wire"
npm run cors:add-production
# Or manually add at: https://www.sanity.io/manage
\`\`\`

## Troubleshooting

### "Failed to create waitlist entry"

- Check that \`SANITY_API_TOKEN\` is set correctly
- Verify the token has **Editor** permissions
- Make sure you deployed the schema with \`npm run deploy\`

### "Email already on waitlist"

- This is expected behavior (prevents duplicates)
- The email exists in Sanity

### Form not submitting

- Check browser console for errors
- Verify API route exists at \`/api/waitlist\`
- Check that all files are copied correctly

### TypeScript errors

- Make sure \`@sanity/client\` is installed
- Check that types are exported correctly
- Run \`npm run build\` to verify

## Next Steps

### Email Notifications (Optional)

Consider adding email notifications:
1. Use services like SendGrid, Mailgun, or Resend
2. Send confirmation email to user after signup
3. Notify admin when new signup occurs

### Analytics (Optional)

Track waitlist signups:
1. Add Google Analytics event on successful submission
2. Track conversion rates
3. Monitor which pages drive most signups

## Support

If you need help:
1. Check Sanity Studio for any schema errors
2. Review Next.js console for API errors
3. Verify all environment variables are set
4. Check that files are in correct locations

## Summary

You now have a complete waitlist system that:
- ✅ Collects full name and email
- ✅ Prevents duplicate emails
- ✅ Stores data securely in Sanity
- ✅ Provides admin interface for management
- ✅ Validates input on frontend and backend
- ✅ Shows success/error messages to users
