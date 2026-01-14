# Region System Revision Guide

This document explains the new three-level region hierarchy and how to use it.

## ✅ What Changed

### Old Structure
```
Region (simple reference)
└── title, slug, description
```

### New Structure
```
Region (object)
├── Continent (reference)
│   ├── title, slug
│   └── countries[]
└── Country (reference)
    ├── title, slug
    └── continent (reference)
```

---

## 📋 Schema Changes

### 1. New Schemas Created

**Continent** (`schemaTypes/continent.ts`)
- `title` - Continent name (e.g., "Asia", "Europe")
- `slug` - URL-friendly slug
- `countries[]` - Array of country references

**Country** (`schemaTypes/country.ts`)
- `title` - Country name (e.g., "Myanmar", "Thailand")
- `slug` - URL-friendly slug
- `continent` - Reference to parent continent

### 2. Updated Article Schema

**Before:**
```typescript
region: {
  type: 'reference',
  to: [{type: 'region'}]
}
```

**After:**
```typescript
region: {
  type: 'object',
  fields: [
    {
      name: 'continent',
      type: 'reference',
      to: [{type: 'continent'}]
    },
    {
      name: 'country',
      type: 'reference',
      to: [{type: 'country'}]
    }
  ]
}
```

---

## 🔄 Migration Steps

### Step 1: Deploy Updated Schema

```bash
cd "Conflict Wire"
npm run deploy
```

### Step 2: Create Continents in Sanity Studio

1. Go to https://conflictwire.sanity.studio/
2. Click "Continent" in sidebar
3. Create continents (e.g., Asia, Europe, Africa, Americas, Oceania)

### Step 3: Create Countries

1. Click "Country" in sidebar
2. Create countries and assign to continents
3. Example: Myanmar → Asia, Thailand → Asia

### Step 4: Update Existing Articles

Your old articles with the previous region system will need to be updated:

1. Open each article in Sanity Studio
2. The old "region" field will be empty (since structure changed)
3. Select new continent and country

**Note:** The old `region` schema still exists for backward compatibility. You can delete it later after migration.

---

## 📊 GROQ Query Examples

All queries are available in `lib/sanity.queries.region.ts`

### List All Continents

```typescript
import {client} from '@/lib/sanity.client'
import {allContinentsQuery} from '@/lib/sanity.queries.region'

const continents = await client.fetch(allContinentsQuery)
// Returns: [{_id, title, slug}, ...]
```

### List Continents with Nested Countries

```typescript
import {allContinentsWithCountriesQuery} from '@/lib/sanity.queries.region'

const data = await client.fetch(allContinentsWithCountriesQuery)
// Returns:
// [
//   {
//     _id: "...",
//     title: "Asia",
//     slug: {current: "asia"},
//     countries: [
//       {_id: "...", title: "Myanmar", slug: {current: "myanmar"}},
//       {_id: "...", title: "Thailand", slug: {current: "thailand"}}
//     ]
//   }
// ]
```

### List Countries by Continent

```typescript
import {countriesByContinentQuery} from '@/lib/sanity.queries.region'

const countries = await client.fetch(
  countriesByContinentQuery,
  {continentSlug: 'asia'}
)
```

### List Articles by Continent

```typescript
import {articlesByContinentQuery} from '@/lib/sanity.queries.region'

const articles = await client.fetch(
  articlesByContinentQuery,
  {continentSlug: 'asia'}
)
```

### List Articles by Country

```typescript
import {articlesByCountryQuery} from '@/lib/sanity.queries.region'

const articles = await client.fetch(
  articlesByCountryQuery,
  {countrySlug: 'myanmar'}
)
```

### Get Continent with Statistics

```typescript
import {continentWithCountriesAndStatsQuery} from '@/lib/sanity.queries.region'

const data = await client.fetch(
  continentWithCountriesAndStatsQuery,
  {slug: 'asia'}
)
// Returns:
// {
//   _id: "...",
//   title: "Asia",
//   slug: {current: "asia"},
//   countries: [
//     {
//       _id: "...",
//       title: "Myanmar",
//       slug: {current: "myanmar"},
//       articleCount: 42
//     }
//   ],
//   totalArticles: 156
// }
```

---

## 🎨 Next.js Usage Examples

### Example 1: Continents Page

```tsx
// app/regions/page.tsx
import {client} from '@/lib/sanity.client'
import {allContinentsWithCountriesQuery} from '@/lib/sanity.queries.region'

export default async function RegionsPage() {
  const continents = await client.fetch(allContinentsWithCountriesQuery)

  return (
    <div>
      <h1>Explore by Region</h1>
      {continents.map((continent) => (
        <div key={continent._id}>
          <h2>{continent.title}</h2>
          <ul>
            {continent.countries?.map((country) => (
              <li key={country._id}>
                <a href={`/regions/${continent.slug.current}/${country.slug.current}`}>
                  {country.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
```

### Example 2: Articles by Country Page

```tsx
// app/regions/[continent]/[country]/page.tsx
import {client} from '@/lib/sanity.client'
import {articlesByCountryQuery, countryBySlugQuery} from '@/lib/sanity.queries.region'

interface PageProps {
  params: {
    continent: string
    country: string
  }
}

export default async function CountryArticlesPage({params}: PageProps) {
  const [country, articles] = await Promise.all([
    client.fetch(countryBySlugQuery, {slug: params.country}),
    client.fetch(articlesByCountryQuery, {countrySlug: params.country})
  ])

  return (
    <div>
      <h1>Articles about {country.title}</h1>
      <p>In {country.continent.title}</p>

      <div>
        {articles.map((article) => (
          <article key={article._id}>
            <h2>{article.title}</h2>
            <p>{article.excerpt}</p>
            <a href={`/articles/${article.slug.current}`}>Read more</a>
          </article>
        ))}
      </div>
    </div>
  )
}
```

### Example 3: Display Region in Article

```tsx
// In your article component
{article.region && (
  <div className="article-region">
    {article.region.continent && (
      <span>
        <a href={`/regions/${article.region.continent.slug.current}`}>
          {article.region.continent.title}
        </a>
      </span>
    )}
    {article.region.country && (
      <span>
        {' > '}
        <a href={`/regions/${article.region.continent?.slug.current}/${article.region.country.slug.current}`}>
          {article.region.country.title}
        </a>
      </span>
    )}
  </div>
)}
```

---

## 🎯 TypeScript Types

Updated types in `lib/sanity.types.ts`:

```typescript
export interface Continent {
  _id: string
  _type: 'continent'
  title: string
  slug: {current: string}
  countries?: Country[]
}

export interface Country {
  _id: string
  _type: 'country'
  title: string
  slug: {current: string}
  continent: Continent
}

export interface ArticleRegion {
  continent?: Continent
  country?: Country
}

export interface Article {
  // ... other fields
  region?: ArticleRegion
  // ... other fields
}
```

---

## 🗑️ Removing Old Region Schema (Optional)

After migrating all articles:

1. Remove `region.ts` from `schemaTypes/`
2. Remove `region` import from `schemaTypes/index.ts`
3. Run `npm run deploy`

**Keep it for now** if you need backward compatibility.

---

## ✅ Testing Checklist

- [ ] Deploy schema successfully
- [ ] Create at least 2 continents in Sanity Studio
- [ ] Create at least 3 countries (across different continents)
- [ ] Create a test article with continent and country selected
- [ ] Query articles by continent
- [ ] Query articles by country
- [ ] Verify region displays correctly in your Next.js app

---

## 🔍 Common Issues

### Issue: Countries not showing in Continent preview
**Solution**: The continent preview counts countries that reference it. Make sure countries have the continent field set.

### Issue: Old articles missing region data
**Solution**: The schema structure changed. You need to manually update old articles in Sanity Studio.

### Issue: TypeScript errors in Next.js
**Solution**: Make sure you've copied the updated `sanity.types.ts` to your Next.js project.

---

## 📚 Available Queries Reference

See `lib/sanity.queries.region.ts` for complete list:

**Continent Queries:**
- `allContinentsQuery`
- `allContinentsWithCountriesQuery`
- `continentBySlugQuery`
- `continentsWithStatsQuery`
- `continentWithCountriesAndStatsQuery`

**Country Queries:**
- `allCountriesQuery`
- `countriesByContinentQuery`
- `countryBySlugQuery`
- `countriesWithStatsQuery`

**Article Queries:**
- `articlesByContinentQuery`
- `articlesByCountryQuery`
- `articlesByContinentIdQuery`
- `articlesByCountryIdQuery`
- `articleCountByContinentQuery`
- `articleCountByCountryQuery`
