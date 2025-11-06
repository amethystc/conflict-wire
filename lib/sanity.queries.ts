// GROQ queries for Next.js integration

export const ARTICLE_FIELDS = `
  _id,
  _type,
  title,
  slug,
  excerpt,
  mainImage {
    asset->,
    alt
  },
  category->{
    _id,
    title,
    slug
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

export const MAGAZINE_FIELDS = `
  _id,
  _type,
  title,
  slug,
  issueNumber,
  coverImage {
    asset->,
    alt
  },
  description,
  publishedAt,
  featured
`

// Get all published articles
export const allArticlesQuery = `
  *[_type == "article" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
    ${ARTICLE_FIELDS}
  }
`

// Get featured articles
export const featuredArticlesQuery = `
  *[_type == "article" && featured == true && !(_id in path("drafts.**"))] | order(publishedAt desc) [0...6] {
    ${ARTICLE_FIELDS}
  }
`

// Get article by slug
export const articleBySlugQuery = `
  *[_type == "article" && slug.current == $slug][0] {
    ${ARTICLE_FIELDS}
  }
`

// Get all magazines
export const allMagazinesQuery = `
  *[_type == "magazine" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
    ${MAGAZINE_FIELDS},
    "articles": articles[]->{
      ${ARTICLE_FIELDS}
    }
  }
`

// Get magazine by slug
export const magazineBySlugQuery = `
  *[_type == "magazine" && slug.current == $slug][0] {
    ${MAGAZINE_FIELDS},
    "articles": articles[]->{
      ${ARTICLE_FIELDS}
    }
  }
`

// Get all categories with article count
export const allCategoriesQuery = `
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description,
    "articleCount": count(*[_type == "article" && references(^._id) && !(_id in path("drafts.**"))])
  }
`

// Get articles by category
export const articlesByCategoryQuery = `
  *[_type == "article" && category._ref == $categoryId && !(_id in path("drafts.**"))] | order(publishedAt desc) {
    ${ARTICLE_FIELDS}
  }
`

// Get all regions with article count
export const allRegionsQuery = `
  *[_type == "region"] | order(title asc) {
    _id,
    title,
    slug,
    description,
    "articleCount": count(*[_type == "article" && references(^._id) && !(_id in path("drafts.**"))])
  }
`

// Get all tags with article count
export const allTagsQuery = `
  *[_type == "tag"] | order(title asc) {
    _id,
    title,
    slug,
    description,
    "articleCount": count(*[_type == "article" && references(^._id) && !(_id in path("drafts.**"))])
  }
`

// Get all authors
export const allAuthorsQuery = `
  *[_type == "author"] | order(name asc) {
    _id,
    name,
    slug,
    image {
      asset->
    },
    bio,
    "articleCount": count(*[_type == "article" && author._ref == ^._id && !(_id in path("drafts.**"))])
  }
`

// Get author by slug with their articles
export const authorBySlugQuery = `
  *[_type == "author" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    image {
      asset->
    },
    bio,
    "articles": *[_type == "article" && author._ref == ^._id && !(_id in path("drafts.**"))] | order(publishedAt desc) {
      ${ARTICLE_FIELDS}
    }
  }
`

// Get site settings
export const siteSettingsQuery = `
  *[_type == "siteSettings"][0] {
    _id,
    title,
    description,
    logo {
      asset->
    },
    email,
    socialLinks
  }
`

// Search articles
export const searchArticlesQuery = `
  *[_type == "article" && (
    title match $searchTerm + "*" ||
    excerpt match $searchTerm + "*"
  ) && !(_id in path("drafts.**"))] | order(publishedAt desc) {
    ${ARTICLE_FIELDS}
  }
`
