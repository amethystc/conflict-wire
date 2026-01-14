// Simple test to verify token permissions
import {createClient} from '@sanity/client'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || 'meyoc37a',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

async function testToken() {
  console.log('🔍 Testing Sanity API token...\n')

  // Log token info (first/last few chars only for security)
  const token = process.env.SANITY_API_TOKEN || ''
  console.log(`Token: ${token.substring(0, 8)}...${token.substring(token.length - 8)}`)
  console.log(`Project ID: ${process.env.SANITY_PROJECT_ID || 'meyoc37a'}`)
  console.log(`Dataset: ${process.env.SANITY_DATASET || 'production'}\n`)

  try {
    // Test 1: Read access
    console.log('📖 Test 1: Testing READ access...')
    const articles = await client.fetch(`*[_type == "article"][0...1]`)
    console.log(`✅ READ works! Found ${articles.length} article(s)\n`)

    // Test 2: Write access - create a test continent
    console.log('✍️  Test 2: Testing WRITE access...')
    const testDoc = await client.create({
      _type: 'continent',
      title: 'TEST_DELETE_ME',
      slug: {
        _type: 'slug',
        current: 'test-delete-me',
      },
    })
    console.log(`✅ WRITE works! Created test document: ${testDoc._id}\n`)

    // Test 3: Delete the test document
    console.log('🗑️  Test 3: Testing DELETE access...')
    await client.delete(testDoc._id)
    console.log(`✅ DELETE works! Cleaned up test document\n`)

    console.log('🎉 SUCCESS! Token has full Editor permissions.\n')
    console.log('The populate-regions script should work. Let\'s try running it...\n')

  } catch (error: any) {
    console.error('❌ ERROR:', error.message)

    if (error.statusCode === 403) {
      console.error('\n⚠️  Permission denied!')
      console.error('Your token does NOT have Editor permissions.')
      console.error('\nPlease check:')
      console.error('1. Go to: https://www.sanity.io/manage/project/meyoc37a/api')
      console.error('2. Check the token permissions')
      console.error('3. Make sure it says "Editor" not "Viewer"')
      console.error('4. Create a new token with Editor permissions if needed')
    } else {
      console.error('\nUnexpected error:', error)
    }
  }
}

testToken()
