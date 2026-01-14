import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility.',
        },
      ],
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'category'}],
      validation: (Rule) => Rule.required(),
      description: 'Main topic category (Myanmar, Conflict, Humanitarian, Trade, Geopolitics, Space)',
    }),
    defineField({
      name: 'region',
      title: 'Region',
      type: 'object',
      fields: [
        {
          name: 'continent',
          title: 'Continent',
          type: 'reference',
          to: [{type: 'continent'}],
          description: 'Select continent',
        },
        {
          name: 'country',
          title: 'Country',
          type: 'reference',
          to: [{type: 'country'}],
          description: 'Select country (should belong to the selected continent)',
        },
      ],
      description: 'Geographic region for this article (optional)',
    }),
    defineField({
      name: 'tags',
      title: 'Additional Tags',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'tag'}]}],
      description: 'Additional tags for this article (optional)',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{type: 'author'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        {
          type: 'block',
          marks: {
            annotations: [
              {
                name: 'technicalTerm',
                type: 'object',
                title: 'Technical Term',
                icon: () => '📖',
                fields: [
                  {
                    name: 'glossaryRef',
                    type: 'reference',
                    title: 'Glossary Term',
                    to: [{type: 'glossary'}],
                    description: 'Link to the glossary term for definition',
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'featured',
      title: 'Featured Article',
      type: 'boolean',
      description: "Mark as featured to show in Editor's Choice section",
      initialValue: false,
    }),
    defineField({
      name: 'exclusive',
      title: 'Exclusive Article',
      type: 'boolean',
      description: 'Mark as exclusive content',
      initialValue: false,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
      category: 'category.title',
      exclusive: 'exclusive',
      featured: 'featured',
    },
    prepare(selection) {
      const {author, category, exclusive, featured} = selection
      const badges = []
      if (exclusive) badges.push('🔒 Exclusive')
      if (featured) badges.push('⭐ Featured')
      const badgeText = badges.length > 0 ? ` • ${badges.join(' • ')}` : ''
      return {
        ...selection,
        subtitle: `${author} • ${category || 'No category'}${badgeText}`,
      }
    },
  },
})
