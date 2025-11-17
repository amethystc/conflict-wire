# Conflict Wire Studio

A Sanity CMS content studio for managing Conflict Wire's editorial content, including articles, magazines, authors, and site configuration.

## 📋 Table of Contents

- [Project Description](#project-description)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running Locally](#running-locally)
- [Deployment](#deployment)
- [CORS Configuration](#cors-configuration)
- [API Token Generation](#api-token-generation)
- [Schema Documentation](#schema-documentation)
- [Next.js Integration](#nextjs-integration)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Resources](#resources)

## 🎯 Project Description

Conflict Wire Studio is a headless CMS built on Sanity.io for managing geopolitical news and analysis content. The studio provides a structured content management system for articles, magazine issues, authors, regional categorization, and content tagging.

## ✨ Features

- **Article Management**: Create and manage news articles with rich text editing, images, and metadata
- **Magazine Issues**: Organize content into magazine editions with issue numbers and cover images
- **Author Profiles**: Manage author information, bios, and profile images
- **Regional Coverage**: Categorize content by regions (Myanmar, Asia, Latin America, Europe)
- **Content Tagging**: Tag articles with topics (Conflict, Humanitarian, Trade, Geopolitics, Space)
- **Site Settings**: Centralized configuration for site-wide settings and social media links
- **Media Management**: Enhanced media library with sanity-plugin-media
- **GROQ Query Testing**: Built-in Vision plugin for testing and debugging queries

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher, v20+ recommended)
- **npm** or **yarn** package manager
- A **Sanity.io account** (sign up at https://www.sanity.io)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/amethystc/conflict-wire.git
cd "Conflict Wire"
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- `sanity` - Core Sanity CMS
- `@sanity/vision` - Query testing tool
- `sanity-plugin-media` - Enhanced media library
- `react` & `react-dom` - UI framework
- `typescript` - Type safety

## 🔧 Environment Setup

### 1. Create Environment File

Copy the example environment file:

```bash
cp .env.example .env
```

### 2. Configure Environment Variables

Edit the `.env` file with your Sanity project details:

```env
# Your Sanity project ID (already configured)
SANITY_PROJECT_ID=meyoc37a

# Dataset name
SANITY_DATASET=production

# API Token (generate from Sanity dashboard)
SANITY_API_TOKEN=your_token_here

# Optional: Preview secret for draft mode
SANITY_PREVIEW_SECRET=your_secret_here
```

### 3. Get Your Project Credentials

Your project ID is already configured: `meyoc37a`

To view project details:
```bash
npm run manage
```

## 🏃 Running Locally

Start the development server:

```bash
npm run dev
```

The studio will be available at:
```
http://localhost:3333
```

You can now:
- Create and edit content
- Test GROQ queries with the Vision plugin
- Manage media assets
- Configure site settings

## 🚀 Deployment

### Deploy to Sanity Hosting

Deploy your studio to Sanity's hosted platform:

```bash
npm run deploy
```

This will:
1. Build the production version of your studio
2. Deploy it to Sanity's hosting
3. Provide you with a URL (e.g., `https://conflict-wire.sanity.studio`)

### Deploy to Custom Domain

If you want to deploy to your own domain:

1. Build the studio:
   ```bash
   npm run build
   ```

2. The built files will be in the `dist/` folder

3. Deploy the `dist/` folder to your hosting provider (Vercel, Netlify, etc.)

### GraphQL API Deployment

If you're using the GraphQL API:

```bash
npm run deploy-graphql
```

## 🌐 CORS Configuration

To allow your frontend application to access the Sanity API, you need to configure CORS origins.

### Option 1: Using npm Scripts

For local development:
```bash
npm run cors:add-localhost
```

For production (edit `package.json` first with your domain):
```bash
npm run cors:add-production
```

### Option 2: Using Sanity CLI Directly

```bash
# Add localhost for development
sanity cors add http://localhost:3000 --credentials

# Add your production domain
sanity cors add https://your-production-domain.com --credentials
```

### Option 3: Using Sanity Dashboard

1. Go to https://www.sanity.io/manage/project/meyoc37a/api
2. Scroll to **CORS Origins**
3. Click **Add CORS Origin**
4. Enter your origin URL
5. Check **Allow credentials**
6. Save

### Common Origins to Add

- `http://localhost:3000` - Next.js development
- `http://localhost:3001` - Alternative port
- `https://your-production-domain.com` - Production site
- `https://www.your-production-domain.com` - Production with www

## 🔑 API Token Generation

API tokens are required for write operations and private data access.

### Generate a Token

1. **Via CLI:**
   ```bash
   npm run manage
   ```
   Navigate to **API** → **Tokens** → **Add API Token**

2. **Via Dashboard:**
   Go to https://www.sanity.io/manage/project/meyoc37a/api/tokens

### Token Configuration

When creating a token:

- **Token Name**: Give it a descriptive name (e.g., "Frontend Read Token", "Next.js App")
- **Permissions**:
  - **Viewer**: Read-only access
  - **Editor**: Read and write access
  - **Admin**: Full access including project settings
- **Copy the token immediately** - it won't be shown again!

### Use Token in Next.js

```javascript
// .env.local
NEXT_PUBLIC_SANITY_PROJECT_ID=meyoc37a
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_token_here
```

```javascript
// lib/sanity.client.ts
import {createClient} from '@sanity/client'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: true,
  token: process.env.SANITY_API_TOKEN, // Only for server-side
})
```

## 📚 Schema Documentation

### Content Types

#### Article
Primary content type for news and analysis articles.

**Fields:**
- `title` (string, required) - Article headline
- `slug` (slug, required) - URL-friendly identifier
- `excerpt` (text, required, max 200 chars) - Short summary
- `mainImage` (image) - Featured image with alt text
- `category` (reference) - Links to Category document
- `author` (reference) - Links to Author document
- `body` (array) - Rich text content with embedded images
- `featured` (boolean) - Mark for Editor's Choice section
- `publishedAt` (datetime, required) - Publication date

#### Magazine
Magazine issue management.

**Fields:**
- `title` (string, required) - Issue title
- `slug` (slug, required) - URL-friendly identifier
- `issueNumber` (number, required) - Issue number (e.g., 1, 2, 3)
- `coverImage` (image, required) - Magazine cover
- `description` (text, required, max 300 chars) - Issue description
- `publishedAt` (datetime, required) - Publication date
- `articles` (array of references) - Articles in this issue
- `featured` (boolean) - Highlight this issue

#### Author
Author profile management.

**Fields:**
- `name` (string, required) - Author name
- `slug` (slug, required) - URL-friendly identifier
- `image` (image) - Profile photo
- `bio` (text) - Author biography

#### Region
Geographic categorization for content.

**Suggested Regions:**
- Myanmar
- Asia
- Latin America
- Europe

**Fields:**
- `title` (string, required) - Region name
- `slug` (slug, required) - URL-friendly identifier
- `description` (text) - Region description

#### Tag
Topic-based categorization.

**Suggested Tags:**
- Conflict
- Humanitarian
- Trade
- Geopolitics
- Space

**Fields:**
- `title` (string, required) - Tag name
- `slug` (slug, required) - URL-friendly identifier
- `description` (text) - Tag description

#### Category
General content categorization.

**Fields:**
- `title` (string, required) - Category name
- `slug` (slug, required) - URL-friendly identifier
- `description` (text) - Category description

#### Site Settings
Singleton document for site-wide configuration.

**Fields:**
- `title` (string, required) - Site title
- `description` (text, required, max 200 chars) - Site description
- `logo` (image) - Site logo
- `email` (string, email validation) - Contact email
- `socialLinks` (object) - Social media URLs
  - `twitter` (url)
  - `facebook` (url)
  - `instagram` (url)
  - `linkedin` (url)

## 🔗 Next.js Integration

For complete Next.js 15+ integration instructions, see:
- **[NEXTJS_INTEGRATION.md](./NEXTJS_INTEGRATION.md)** - Complete integration guide

### Quick Start

1. Copy the `lib/` folder to your Next.js project
2. Install dependencies:
   ```bash
   npm install next-sanity @sanity/image-url @portabletext/react
   ```
3. Configure environment variables in `.env.local`
4. Start using the pre-built queries and client

### Example Usage

```tsx
// app/articles/page.tsx
import {client} from '@/lib/sanity.client'
import {allArticlesQuery} from '@/lib/sanity.queries'

export default async function ArticlesPage() {
  const articles = await client.fetch(allArticlesQuery)

  return (
    <div>
      {articles.map((article) => (
        <article key={article._id}>
          <h2>{article.title}</h2>
          <p>{article.excerpt}</p>
        </article>
      ))}
    </div>
  )
}
```

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server (localhost:3333) |
| `npm run build` | Build the studio for production |
| `npm run deploy` | Deploy studio to Sanity hosting |
| `npm run manage` | Open project management dashboard |
| `npm run format` | Format code with Prettier |
| `npm run lint` | Run ESLint |
| `npm run check-schema` | Extract and validate schema |
| `npm run cors:add-localhost` | Add localhost CORS origin |
| `npm run cors:add-production` | Add production CORS origin |
| `npm run deploy-graphql` | Deploy GraphQL API |

## 📁 Project Structure

```
conflict-wire/
├── lib/                      # Next.js integration files
│   ├── sanity.client.ts      # Sanity client configuration
│   ├── sanity.types.ts       # TypeScript type definitions
│   ├── sanity.queries.ts     # Pre-built GROQ queries
│   └── sanity.image.ts       # Image URL builder helper
├── schemaTypes/              # Content schema definitions
│   ├── article.ts            # Article schema
│   ├── author.ts             # Author schema
│   ├── category.ts           # Category schema
│   ├── glossary.ts           # Glossary schema
│   ├── magazine.ts           # Magazine schema
│   ├── region.ts             # Region schema
│   ├── siteSettings.ts       # Site settings schema
│   ├── tag.ts                # Tag schema
│   ├── technicalTerm.ts      # Technical term annotation
│   └── index.ts              # Schema exports
├── static/                   # Static assets
├── dist/                     # Build output (gitignored)
├── node_modules/             # Dependencies (gitignored)
├── .env                      # Environment variables (gitignored)
├── .env.example              # Environment template
├── .gitignore               # Git ignore rules
├── eslint.config.mjs        # ESLint configuration
├── package.json             # Project dependencies and scripts
├── package-lock.json        # Locked dependencies
├── sanity.config.ts         # Main Sanity configuration
├── sanity.cli.ts            # CLI configuration
├── tsconfig.json            # TypeScript configuration
├── README.md                # This file
└── NEXTJS_INTEGRATION.md    # Next.js integration guide
```

## 🛠️ Troubleshooting

### Studio won't start

1. Check Node.js version: `node --version` (should be v18+)
2. Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
3. Clear Sanity cache: `rm -rf .sanity`

### CORS errors in frontend

1. Verify CORS origins are configured
2. Check that credentials are allowed
3. Ensure the origin URL matches exactly (http vs https, trailing slash, etc.)

### Can't deploy studio

1. Ensure you're logged in: `npx sanity login`
2. Check project permissions in Sanity dashboard
3. Verify internet connection

### Build errors

1. Run type checking: `npx tsc --noEmit`
2. Check schema validation: `npm run check-schema`
3. Review error messages for specific issues

## 📖 Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Sanity Community](https://www.sanity.io/community)
- [Vision Plugin Guide](https://www.sanity.io/docs/the-vision-plugin)
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev)

## 📝 License

UNLICENSED - Private project

## 🤝 Contributing

This is a private project. For internal contributions, please follow the established code style and schema conventions.

## 📞 Support

For Sanity-specific support:
- [Sanity Help Center](https://www.sanity.io/help)
- [Sanity Community Slack](https://slack.sanity.io/)

For project-specific questions, contact the development team.

---

**Project ID:** `meyoc37a`
**Dataset:** `production`
**Studio URL:** https://conflict-wire.sanity.studio (after deployment)
