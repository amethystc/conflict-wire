# Next.js 15+ Integration Guide

This guide shows how to integrate Conflict Wire Studio with Next.js 15+ using the App Router.

## Installation in Next.js Project

```bash
npm install next-sanity @sanity/image-url @portabletext/react
```

## Environment Variables

Create a `.env.local` file in your Next.js project:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=tj8cgapn
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_token_here
```

## File Structure

Copy these files from `lib/` to your Next.js project:
- `lib/sanity.client.ts` - Sanity client configuration
- `lib/sanity.queries.ts` - GROQ queries
- `lib/sanity.types.ts` - TypeScript types
- `lib/sanity.image.ts` - Image URL builder

## Usage Examples

### Server Component (Recommended for Next.js 15)

```tsx
// app/articles/page.tsx
import {client} from '@/lib/sanity.client'
import {allArticlesQuery} from '@/lib/sanity.queries'
import type {Article} from '@/lib/sanity.types'

export default async function ArticlesPage() {
  // Fetch data in Server Component
  const articles = await client.fetch<Article[]>(allArticlesQuery, {}, {
    next: {
      revalidate: 60, // Revalidate every 60 seconds
    },
  })

  return (
    <div>
      <h1>Articles</h1>
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

### Dynamic Route with Server Component

```tsx
// app/articles/[slug]/page.tsx
import {client} from '@/lib/sanity.client'
import {articleBySlugQuery, allArticlesQuery} from '@/lib/sanity.queries'
import {urlForImage} from '@/lib/sanity.image'
import {PortableText} from '@portabletext/react'
import type {Article} from '@/lib/sanity.types'
import Image from 'next/image'

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const articles = await client.fetch<Article[]>(allArticlesQuery)

  return articles.map((article) => ({
    slug: article.slug.current,
  }))
}

export default async function ArticlePage({params}: PageProps) {
  const article = await client.fetch<Article>(
    articleBySlugQuery,
    {slug: params.slug},
    {
      next: {
        revalidate: 60,
      },
    }
  )

  if (!article) {
    return <div>Article not found</div>
  }

  return (
    <article>
      <h1>{article.title}</h1>

      {article.mainImage && (
        <Image
          src={urlForImage(article.mainImage).width(1200).height(630).url()}
          alt={article.mainImage.alt || article.title}
          width={1200}
          height={630}
        />
      )}

      <div>
        <p>By {article.author.name}</p>
        <p>Category: {article.category.title}</p>
        <time>{new Date(article.publishedAt).toLocaleDateString()}</time>
      </div>

      <div>
        <PortableText value={article.body} />
      </div>
    </article>
  )
}
```

### Metadata Generation (SEO)

```tsx
// app/articles/[slug]/page.tsx
import type {Metadata} from 'next'

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const article = await client.fetch<Article>(articleBySlugQuery, {
    slug: params.slug,
  })

  if (!article) {
    return {
      title: 'Article Not Found',
    }
  }

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.mainImage
        ? [urlForImage(article.mainImage).width(1200).height(630).url()]
        : [],
    },
  }
}
```

### Client Component Example (when needed)

```tsx
'use client'

import {useState, useEffect} from 'react'
import {client} from '@/lib/sanity.client'
import {searchArticlesQuery} from '@/lib/sanity.queries'
import type {Article} from '@/lib/sanity.types'

export function SearchArticles() {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<Article[]>([])

  useEffect(() => {
    if (searchTerm) {
      client
        .fetch<Article[]>(searchArticlesQuery, {searchTerm})
        .then(setResults)
    } else {
      setResults([])
    }
  }, [searchTerm])

  return (
    <div>
      <input
        type="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search articles..."
      />

      {results.map((article) => (
        <div key={article._id}>
          <h3>{article.title}</h3>
          <p>{article.excerpt}</p>
        </div>
      ))}
    </div>
  )
}
```

### Fetching Site Settings

```tsx
// app/layout.tsx
import {client} from '@/lib/sanity.client'
import {siteSettingsQuery} from '@/lib/sanity.queries'
import type {SiteSettings} from '@/lib/sanity.types'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await client.fetch<SiteSettings>(siteSettingsQuery)

  return (
    <html lang="en">
      <body>
        <header>
          <h1>{settings.title}</h1>
          <p>{settings.description}</p>
        </header>
        <main>{children}</main>
        <footer>
          {settings.socialLinks && (
            <div>
              {settings.socialLinks.twitter && (
                <a href={settings.socialLinks.twitter}>Twitter</a>
              )}
              {settings.socialLinks.facebook && (
                <a href={settings.socialLinks.facebook}>Facebook</a>
              )}
            </div>
          )}
        </footer>
      </body>
    </html>
  )
}
```

## React 19 Compatibility

This setup is fully compatible with React 19 (used in Next.js 15+):
- Server Components work seamlessly
- Async Server Components supported
- Sanity v4 is React 19 compatible

## Caching Strategy

Next.js 15 recommendations:
```tsx
// Revalidate every hour
{next: {revalidate: 3600}}

// Revalidate on-demand only
{next: {revalidate: false}}

// No caching (always fresh)
{cache: 'no-store'}
```

## Preview Mode / Draft Content

For preview/draft mode in Next.js 15:

```tsx
// app/api/draft/route.ts
import {draftMode} from 'next/headers'
import {redirect} from 'next/navigation'

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')

  if (secret !== process.env.SANITY_PREVIEW_SECRET) {
    return new Response('Invalid token', {status: 401})
  }

  draftMode().enable()
  redirect(slug || '/')
}
```

Then in your page:
```tsx
import {draftMode} from 'next/headers'
import {client, previewClient} from '@/lib/sanity.client'

export default async function Page() {
  const isDraft = draftMode().isEnabled
  const sanityClient = isDraft ? previewClient : client

  const data = await sanityClient.fetch(query)

  return <div>{/* ... */}</div>
}
```

## TypeScript Support

All types are fully typed for TypeScript autocompletion in Next.js 15+.

## Performance Tips

1. Use Server Components by default (no 'use client')
2. Implement proper caching with `revalidate`
3. Use `generateStaticParams` for static generation
4. Optimize images with Next.js Image component
5. Use the CDN (`useCdn: true`) in production
