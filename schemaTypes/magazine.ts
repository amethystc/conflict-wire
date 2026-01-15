import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'magazine',
  title: 'Magazine',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'magazinePdf',
      title: 'FULL MAGAZINE PDF UPLOAD',
      type: 'file',
      options: {
        accept: '.pdf',
      },
      description: 'Upload the full magazine PDF here.',
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
      name: 'issueNumber',
      title: 'Issue Number',
      type: 'number',
      validation: (Rule) => Rule.required().integer().positive(),
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      description: 'Price of the magazine issue (e.g. 5.99)',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'checkoutUrl',
      title: 'Checkout URL',
      type: 'url',
      description: 'Link to the payment/checkout page for this issue',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured Magazine',
      type: 'boolean',
      description: 'Mark as featured to highlight this issue',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      issueNumber: 'issueNumber',
      media: 'coverImage',
    },
    prepare(selection) {
      const { title, issueNumber } = selection
      return {
        ...selection,
        subtitle: `Issue #${issueNumber}`,
      }
    },
  },
})
