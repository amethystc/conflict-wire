# Category Schema Deployment Guide

Your Sanity schema has been updated to use **categories** instead of tags. Here's how to deploy and use the new schema.

## What Changed

### Sanity Studio Changes (C:\Users\pokame\Conflict Wire)

1. **✅ Created `schemaTypes/category.ts`**
   - 6 predefined categories: Myanmar, Conflict, Humanitarian, Trade, Geopolitics, Space
   - Display order field for website navigation

2. **✅ Updated `schemaTypes/article.ts`**
   - Changed `tags` (array) to `category` (single reference)
   - Made `region` optional
   - Kept `tags` for additional tagging (optional)
   - Added `exclusive` boolean field
   - Updated preview to show category and badges

3. **✅ Updated `schemaTypes/index.ts`**
   - Added category to schema exports

4. **✅ Created `scripts/create-categories.ts`**
   - Script to create all 6 categories automatically

### Frontend Changes (C:\Users\pokame\Desktop\newsportal)

1. **✅ Updated `src/lib/types.ts`**
   - Added `exclusive` field to Article interface

## Deployment Steps

### Step 1: Install Dependencies (if needed)

```bash
cd "C:\Users\pokame\Conflict Wire"
npm install tsx @sanity/client --save-dev
```

### Step 2: Get Sanity API Token

1. Go to https://sanity.io/manage/personal/project/meyoc37a
2. Click **"API"** in left menu
3. Click **"Tokens"** tab
4. Click **"Add API token"**
5. Name: `Deploy Token`
6. Permissions: **Editor**
7. Copy the token

### Step 3: Set Environment Variable

**Windows PowerShell:**
```powershell
$env:SANITY_API_TOKEN="your_token_here"
```

**Windows CMD:**
```cmd
set SANITY_API_TOKEN=your_token_here
```

**Linux/Mac:**
```bash
export SANITY_API_TOKEN=your_token_here
```

### Step 4: Create Categories

```bash
cd "C:\Users\pokame\Conflict Wire"
npm run create-categories
```

This will create 6 categories in your Sanity project.

### Step 5: Deploy Studio

Deploy your schema changes to the hosted studio:

```bash
npm run deploy
```

This updates https://studio.conflictwire.co.uk with the new schema.

### Step 6: Update Existing Articles

1. Go to https://studio.conflictwire.co.uk
2. Open each existing article
3. Select a **Category** (required)
4. Check **Exclusive** if it's exclusive content
5. Keep or remove **Region** (now optional)
6. Save

**Your 2 existing articles:**
- "Cyber Recruitment: Colombia's Young Soldiers" → Category: **Conflict**
- "Thailand-Cambodia Border Conflict: Newest Updates" → Category: **Conflict** or **Geopolitics**

### Step 7: Restart Frontend

```bash
cd "C:\Users\pokame\Desktop\newsportal"
npm run dev
```

Open http://localhost:3000 to see articles with proper categories!

## Category Structure on Website

Your navigation will show articles by category in this order:

1. **Myanmar** - Myanmar-specific news
2. **Exclusive** - Articles with `exclusive: true` field
3. **Conflict** - Global conflict coverage
4. **Humanitarian** - Humanitarian crises
5. **Trade** - International trade
6. **Geopolitics** - Geopolitical analysis
7. **Space** - Space exploration

## Schema Details

### Category Schema

```typescript
{
  title: 'Myanmar' | 'Conflict' | 'Humanitarian' | 'Trade' | 'Geopolitics' | 'Space',
  slug: { current: string },
  description: string,
  order: number  // Display order on website
}
```

### Updated Article Schema

```typescript
{
  category: reference to Category (required),
  region: reference to Region (optional),
  tags: array of Tag references (optional),
  exclusive: boolean (default: false),
  featured: boolean (default: false),
  // ... other fields
}
```

## Troubleshooting

### "SANITY_API_TOKEN not found"
Set the environment variable as shown in Step 3.

### "Cannot find module 'tsx'"
Run: `npm install tsx @sanity/client --save-dev`

### "Category schema not found in studio"
Run `npm run deploy` to update your hosted studio.

### Articles still showing "GENERAL" on frontend
1. Make sure categories are created (Step 4)
2. Assign categories to articles (Step 6)
3. Restart frontend dev server (Step 7)

## Next Steps

1. **Test the schema** - Create a new article in the studio
2. **Update navigation** - Update your frontend navigation to use these categories
3. **Create category pages** - Add pages like `/category/myanmar`, `/category/conflict`, etc.
4. **Filter exclusive content** - Add logic to show/hide exclusive articles based on user access

## Questions?

Check the files created:
- `C:\Users\pokame\Conflict Wire\schemaTypes\category.ts` - Category schema
- `C:\Users\pokame\Conflict Wire\schemaTypes\article.ts` - Updated article schema
- `C:\Users\pokame\Conflict Wire\scripts\create-categories.ts` - Category creation script
