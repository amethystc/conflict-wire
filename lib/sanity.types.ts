// TypeScript types for Sanity schemas - compatible with Next.js 15+

export interface Author {
  _id: string
  _type: 'author'
  name: string
  slug: {
    current: string
  }
  image?: {
    asset: {
      _ref: string
      _type: 'reference'
    }
    alt?: string
  }
  bio?: string
}

export interface Region {
  _id: string
  _type: 'region'
  title: string
  slug: {
    current: string
  }
  description?: string
}

export interface Tag {
  _id: string
  _type: 'tag'
  title: string
  slug: {
    current: string
  }
  description?: string
}

export interface Article {
  _id: string
  _type: 'article'
  title: string
  slug: {
    current: string
  }
  excerpt: string
  mainImage?: {
    asset: {
      _ref: string
      _type: 'reference'
    }
    alt?: string
  }
  region: Region
  tags: Tag[]
  author: Author
  body: any[] // Portable Text
  featured: boolean
  publishedAt: string
}

export interface Magazine {
  _id: string
  _type: 'magazine'
  title: string
  slug: {
    current: string
  }
  issueNumber: number
  coverImage: {
    asset: {
      _ref: string
      _type: 'reference'
    }
    alt?: string
  }
  description: string
  publishedAt: string
  articles?: Article[]
  featured: boolean
}

export interface SiteSettings {
  _id: string
  _type: 'siteSettings'
  title: string
  description: string
  logo?: {
    asset: {
      _ref: string
      _type: 'reference'
    }
    alt?: string
  }
  email?: string
  socialLinks?: {
    twitter?: string
    facebook?: string
    instagram?: string
    linkedin?: string
  }
}
