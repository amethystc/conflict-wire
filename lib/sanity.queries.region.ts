// GROQ queries for the new Region system (Continent → Country)

// Field fragments
export const CONTINENT_FIELDS = `
  _id,
  _type,
  title,
  slug
`

export const COUNTRY_FIELDS = `
  _id,
  _type,
  title,
  slug,
  continent->{
    ${CONTINENT_FIELDS}
  }
`

export const ARTICLE_REGION_FIELDS = `
  region {
    continent->{
      ${CONTINENT_FIELDS}
    },
    country->{
      ${COUNTRY_FIELDS}
    }
  }
`

// ============================================
// CONTINENT QUERIES
// ============================================

// List all continents
export const allContinentsQuery = `
  *[_type == "continent"] | order(title asc) {
    ${CONTINENT_FIELDS}
  }
`

// List continents with nested countries
export const allContinentsWithCountriesQuery = `
  *[_type == "continent"] | order(title asc) {
    ${CONTINENT_FIELDS},
    "countries": *[_type == "country" && references(^._id)] | order(title asc) {
      _id,
      _type,
      title,
      slug
    }
  }
`

// Get continent by slug
export const continentBySlugQuery = `
  *[_type == "continent" && slug.current == $slug][0] {
    ${CONTINENT_FIELDS},
    "countries": *[_type == "country" && references(^._id)] | order(title asc) {
      _id,
      _type,
      title,
      slug
    }
  }
`

// ============================================
// COUNTRY QUERIES
// ============================================

// List all countries
export const allCountriesQuery = `
  *[_type == "country"] | order(title asc) {
    ${COUNTRY_FIELDS}
  }
`

// List countries by continent slug
export const countriesByContinentQuery = `
  *[_type == "country" && continent->slug.current == $continentSlug] | order(title asc) {
    ${COUNTRY_FIELDS}
  }
`

// Get country by slug
export const countryBySlugQuery = `
  *[_type == "country" && slug.current == $slug][0] {
    ${COUNTRY_FIELDS}
  }
`

// ============================================
// ARTICLE QUERIES BY REGION
// ============================================

// For use in article queries - include this in ARTICLE_FIELDS
export const ARTICLE_WITH_REGION = `
  _id,
  _type,
  title,
  slug,
  excerpt,
  mainImage {
    asset->,
    alt
  },
  region {
    continent->{
      _id,
      title,
      slug
    },
    country->{
      _id,
      title,
      slug,
      continent->{
        _id,
        title,
        slug
      }
    }
  },
  tags[]->{
    _id,
    title,
    slug,
    description
  },
  author->{
    _id,
    name,
    slug,
    image {
      asset->
    }
  },
  body,
  featured,
  publishedAt
`

// List articles by continent slug
export const articlesByContinentQuery = `
  *[_type == "article" && region.continent->slug.current == $continentSlug && !(_id in path("drafts.**"))]
  | order(publishedAt desc) {
    ${ARTICLE_WITH_REGION}
  }
`

// List articles by country slug
export const articlesByCountryQuery = `
  *[_type == "article" && region.country->slug.current == $countrySlug && !(_id in path("drafts.**"))]
  | order(publishedAt desc) {
    ${ARTICLE_WITH_REGION}
  }
`

// List articles by continent ID
export const articlesByContinentIdQuery = `
  *[_type == "article" && region.continent._ref == $continentId && !(_id in path("drafts.**"))]
  | order(publishedAt desc) {
    ${ARTICLE_WITH_REGION}
  }
`

// List articles by country ID
export const articlesByCountryIdQuery = `
  *[_type == "article" && region.country._ref == $countryId && !(_id in path("drafts.**"))]
  | order(publishedAt desc) {
    ${ARTICLE_WITH_REGION}
  }
`

// Count articles by continent
export const articleCountByContinentQuery = `
  count(*[_type == "article" && region.continent->slug.current == $continentSlug && !(_id in path("drafts.**"))])
`

// Count articles by country
export const articleCountByCountryQuery = `
  count(*[_type == "article" && region.country->slug.current == $countrySlug && !(_id in path("drafts.**"))])
`

// ============================================
// COMBINED QUERIES
// ============================================

// List all continents with country count and article count
export const continentsWithStatsQuery = `
  *[_type == "continent"] | order(title asc) {
    ${CONTINENT_FIELDS},
    "countryCount": count(*[_type == "country" && references(^._id)]),
    "articleCount": count(*[_type == "article" && region.continent._ref == ^._id && !(_id in path("drafts.**"))])
  }
`

// List all countries with article count
export const countriesWithStatsQuery = `
  *[_type == "country"] | order(title asc) {
    ${COUNTRY_FIELDS},
    "articleCount": count(*[_type == "article" && region.country._ref == ^._id && !(_id in path("drafts.**"))])
  }
`

// Get continent with countries and their article counts
export const continentWithCountriesAndStatsQuery = `
  *[_type == "continent" && slug.current == $slug][0] {
    ${CONTINENT_FIELDS},
    "countries": *[_type == "country" && references(^._id)] | order(title asc) {
      _id,
      _type,
      title,
      slug,
      "articleCount": count(*[_type == "article" && region.country._ref == ^._id && !(_id in path("drafts.**"))])
    },
    "totalArticles": count(*[_type == "article" && region.continent._ref == ^._id && !(_id in path("drafts.**"))])
  }
`
