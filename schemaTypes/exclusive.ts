import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'exclusive',
    title: 'Exclusive Content',
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
            name: 'contentType',
            title: 'Content Type',
            type: 'string',
            options: {
                list: [
                    { title: 'Article', value: 'article' },
                    { title: 'Investigation', value: 'investigation' },
                    { title: 'Special Report', value: 'report' },
                    { title: 'Video/Media', value: 'video' },
                ],
            },
            initialValue: 'article',
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
                },
            ],
        }),
        defineField({
            name: 'excerpt',
            title: 'Public Excerpt',
            type: 'text',
            rows: 3,
            description: 'Shown to non-members or in previews',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'content',
            title: 'Protected Content',
            type: 'array',
            description: 'This content will be locked behind membership',
            of: [
                { type: 'block' },
                {
                    type: 'image',
                    options: { hotspot: true },
                    fields: [{ name: 'alt', type: 'string' }],
                },
                {
                    name: 'attachment',
                    title: 'Downloadable File',
                    type: 'file',
                    options: { accept: '.pdf,.doc,.docx' },
                }
            ],
        }),
        defineField({
            name: 'author',
            title: 'Author',
            type: 'reference',
            to: [{ type: 'author' }],
        }),
        defineField({
            name: 'publishedAt',
            title: 'Published at',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
        }),
    ],
    preview: {
        select: {
            title: 'title',
            author: 'author.name',
            media: 'mainImage',
            type: 'contentType',
        },
        prepare({ title, author, media, type }) {
            return {
                title: `[EXCLUSIVE] ${title}`,
                subtitle: `${author || 'No Author'} • ${type.toUpperCase()}`,
                media,
            }
        },
    },
})
