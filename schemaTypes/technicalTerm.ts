import {defineType} from 'sanity'

export default defineType({
  name: 'technicalTerm',
  type: 'object',
  title: 'Technical Term',
  fields: [
    {
      name: 'glossaryRef',
      type: 'reference',
      title: 'Glossary Term',
      to: [{type: 'glossary'}],
      description: 'Link to the glossary term for definition',
    },
  ],
})
