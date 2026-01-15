import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'member',
    title: 'Member',
    type: 'document',
    fields: [
        defineField({
            name: 'fullName',
            title: 'Full Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'email',
            title: 'Email',
            type: 'string',
            validation: (Rule) => Rule.required().email(),
        }),
        defineField({
            name: 'status',
            title: 'Member Status',
            type: 'string',
            options: {
                list: [
                    { title: 'Active', value: 'active' },
                    { title: 'Suspended', value: 'suspended' },
                    { title: 'Expired', value: 'expired' },
                ],
            },
            initialValue: 'active',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'membershipType',
            title: 'Membership Type',
            type: 'string',
            options: {
                list: [
                    { title: 'Early Access', value: 'early_access' },
                    { title: 'Premium', value: 'premium' },
                    { title: 'Founder', value: 'founder' },
                ],
            },
            initialValue: 'early_access',
        }),
        defineField({
            name: 'joinedAt',
            title: 'Joined At',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
        }),
        defineField({
            name: 'waitlistRef',
            title: 'Waitlist Reference',
            type: 'reference',
            to: [{ type: 'waitlist' }],
            description: 'Link to the original waitlist entry if applicable',
        }),
        defineField({
            name: 'notes',
            title: 'Internal Notes',
            type: 'text',
            rows: 3,
        }),
    ],
    preview: {
        select: {
            title: 'fullName',
            subtitle: 'email',
            status: 'status',
        },
        prepare({ title, subtitle, status }) {
            return {
                title,
                subtitle: `${subtitle} • ${status.toUpperCase()}`,
            }
        },
    },
})
