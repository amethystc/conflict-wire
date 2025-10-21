import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'glossary',
  title: 'Glossary',
  type: 'document',
  fields: [
    defineField({
      name: 'term',
      title: 'Term',
      type: 'string',
      description: 'The technical term or jargon',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'term',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'definition',
      title: 'Definition',
      type: 'text',
      rows: 3,
      description: 'Short, clear definition of the term',
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'detailedExplanation',
      title: 'Detailed Explanation',
      type: 'text',
      rows: 6,
      description: 'Optional longer explanation with context',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Military', value: 'military'},
          {title: 'Political', value: 'political'},
          {title: 'Economic', value: 'economic'},
          {title: 'Legal', value: 'legal'},
          {title: 'Geographic', value: 'geographic'},
          {title: 'Other', value: 'other'},
        ],
      },
    }),
    defineField({
      name: 'relatedTerms',
      title: 'Related Terms',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'glossary'}]}],
      description: 'Link to related glossary terms',
    }),
  ],
  preview: {
    select: {
      title: 'term',
      subtitle: 'definition',
      category: 'category',
    },
    prepare(selection) {
      const {title, subtitle, category} = selection
      return {
        title: title,
        subtitle: `${category ? `[${category}] ` : ''}${subtitle}`,
      }
    },
  },
})
