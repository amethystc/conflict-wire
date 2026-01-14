import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'country',
  title: 'Country',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Country name (e.g., Myanmar, Thailand, United States)',
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
      name: 'continent',
      title: 'Continent',
      type: 'reference',
      to: [{type: 'continent'}],
      validation: (Rule) => Rule.required(),
      description: 'The continent this country belongs to',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      continent: 'continent.title',
    },
    prepare({title, continent}) {
      return {
        title,
        subtitle: continent || 'No continent assigned',
      }
    },
  },
})
