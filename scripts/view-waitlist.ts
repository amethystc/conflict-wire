// Script to view waitlist entries in terminal
// Run with: tsx scripts/view-waitlist.ts

import {createClient} from '@sanity/client'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || 'meyoc37a',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

async function viewWaitlist() {
  try {
    console.log('📋 Fetching waitlist entries...\n')

    const query = `*[_type == "waitlist"] | order(signedUpAt desc) {
      fullName,
      email,
      status,
      signedUpAt
    }`

    const entries = await client.fetch(query)

    if (entries.length === 0) {
      console.log('No waitlist entries yet.')
      return
    }

    console.log(`📊 Total Entries: ${entries.length}\n`)
    console.log('─'.repeat(80))

    entries.forEach((entry: any, index: number) => {
      const date = new Date(entry.signedUpAt).toLocaleString()
      const statusEmoji =
        entry.status === 'contacted' ? '✅' :
        entry.status === 'approved' ? '👍' : '⏳'

      console.log(`\n${index + 1}. ${entry.fullName}`)
      console.log(`   📧 ${entry.email}`)
      console.log(`   ${statusEmoji} ${entry.status.toUpperCase()}`)
      console.log(`   📅 ${date}`)
    })

    console.log('\n' + '─'.repeat(80))

    const pending = entries.filter((e: any) => e.status === 'pending').length
    const approved = entries.filter((e: any) => e.status === 'approved').length
    const contacted = entries.filter((e: any) => e.status === 'contacted').length

    console.log(`\n📈 Summary:`)
    console.log(`   ⏳ Pending: ${pending}`)
    console.log(`   👍 Approved: ${approved}`)
    console.log(`   ✅ Contacted: ${contacted}`)
    console.log('')

  } catch (error) {
    console.error('Error fetching waitlist:', error)
  }
}

viewWaitlist()
