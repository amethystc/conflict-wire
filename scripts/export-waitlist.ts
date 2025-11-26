// Script to export waitlist to CSV
// Run with: npm run export-waitlist

import {createClient} from '@sanity/client'
import fs from 'fs'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || 'meyoc37a',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

async function exportWaitlist() {
  try {
    console.log('📥 Fetching waitlist entries...')

    const query = `*[_type == "waitlist"] | order(signedUpAt desc) {
      fullName,
      email,
      status,
      signedUpAt,
      notes
    }`

    const entries = await client.fetch(query)

    if (entries.length === 0) {
      console.log('No waitlist entries found.')
      return
    }

    // Create CSV content
    const headers = 'Full Name,Email,Status,Signed Up At,Notes\n'
    const rows = entries
      .map((entry: any) => {
        const signedUpDate = new Date(entry.signedUpAt).toLocaleString()
        const notes = (entry.notes || '').replace(/,/g, ';').replace(/\n/g, ' ')
        return `"${entry.fullName}","${entry.email}","${entry.status}","${signedUpDate}","${notes}"`
      })
      .join('\n')

    const csv = headers + rows

    // Save to file
    const filename = `waitlist-export-${new Date().toISOString().split('T')[0]}.csv`
    fs.writeFileSync(filename, csv)

    console.log(`✅ Exported ${entries.length} entries to ${filename}`)
    console.log('\nSummary:')
    console.log(`- Total entries: ${entries.length}`)
    console.log(`- Pending: ${entries.filter((e: any) => e.status === 'pending').length}`)
    console.log(`- Approved: ${entries.filter((e: any) => e.status === 'approved').length}`)
    console.log(`- Contacted: ${entries.filter((e: any) => e.status === 'contacted').length}`)
  } catch (error) {
    console.error('Error exporting waitlist:', error)
  }
}

exportWaitlist()
