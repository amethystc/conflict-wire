import {createClient} from '@sanity/client'

const client = createClient({
  projectId: 'meyoc37a',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

const categories = [
  {
    _type: 'category',
    _id: 'category-myanmar',
    title: 'Myanmar',
    slug: {_type: 'slug', current: 'myanmar'},
    description: 'News and analysis about Myanmar',
    order: 1,
  },
  {
    _type: 'category',
    _id: 'category-conflict',
    title: 'Conflict',
    slug: {_type: 'slug', current: 'conflict'},
    description: 'Global conflict coverage and analysis',
    order: 3,
  },
  {
    _type: 'category',
    _id: 'category-humanitarian',
    title: 'Humanitarian',
    slug: {_type: 'slug', current: 'humanitarian'},
    description: 'Humanitarian crises and aid efforts',
    order: 4,
  },
  {
    _type: 'category',
    _id: 'category-trade',
    title: 'Trade',
    slug: {_type: 'slug', current: 'trade'},
    description: 'International trade and economic relations',
    order: 5,
  },
  {
    _type: 'category',
    _id: 'category-geopolitics',
    title: 'Geopolitics',
    slug: {_type: 'slug', current: 'geopolitics'},
    description: 'Geopolitical analysis and developments',
    order: 6,
  },
  {
    _type: 'category',
    _id: 'category-space',
    title: 'Space',
    slug: {_type: 'slug', current: 'space'},
    description: 'Space exploration and technology',
    order: 7,
  },
]

async function createCategories() {
  console.log('🚀 Creating categories in Sanity...\n')

  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ Error: SANITY_API_TOKEN not found!')
    console.log('\nTo fix this:')
    console.log('1. Go to https://sanity.io/manage/personal/project/meyoc37a')
    console.log('2. Click "API" → "Tokens" → "Add API token"')
    console.log('3. Name: "Deploy Token", Permissions: "Editor"')
    console.log('4. Set environment variable: SANITY_API_TOKEN=your_token')
    console.log('\nThen run: npm run create-categories\n')
    process.exit(1)
  }

  try {
    console.log(`Creating ${categories.length} categories...\n`)

    for (const category of categories) {
      try {
        await client.createOrReplace(category)
        console.log(`✅ Created category: ${category.title} (order: ${category.order})`)
      } catch (error: any) {
        console.error(`❌ Error creating ${category.title}:`, error.message)
      }
    }

    console.log('\n✅ All categories created!')
    console.log('\nCategory order on website:')
    console.log('1. Myanmar')
    console.log('2. Exclusive (based on article.exclusive field)')
    console.log('3. Conflict')
    console.log('4. Humanitarian')
    console.log('5. Trade')
    console.log('6. Geopolitics')
    console.log('7. Space')
    console.log('\nNext steps:')
    console.log('1. Deploy your studio changes')
    console.log('2. Update your existing articles with categories')
    console.log('3. Check your frontend at http://localhost:3000\n')
  } catch (error: any) {
    console.error('\n❌ Failed to create categories:', error.message)
  }
}

createCategories()
