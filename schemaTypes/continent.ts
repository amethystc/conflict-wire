import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'continent',
  title: 'Continent',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Continent name (e.g., Asia, Europe, Africa)',
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
      name: 'countries',
      title: 'Countries',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'country'}]}],
      description: 'Countries in this continent',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      countries: 'countries',
    },
    prepare({title, countries}) {
      const countryCount = countries ? countries.length : 0
      return {
        title,
        subtitle: `${countryCount} ${countryCount === 1 ? 'country' : 'countries'}`,
      }
    },
  },
})
