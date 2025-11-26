import {createClient} from '@sanity/client'

// Server-side client with write permissions for API routes
export const serverClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'meyoc37a',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false, // Must be false for server-side writes
  token: process.env.SANITY_API_TOKEN, // Required for write operations
})

// Helper function to create a waitlist entry
export async function createWaitlistEntry(data: {
  fullName: string
  email: string
}) {
  try {
    const result = await serverClient.create({
      _type: 'waitlist',
      fullName: data.fullName,
      email: data.email,
      status: 'pending',
      signedUpAt: new Date().toISOString(),
    })

    return {success: true, data: result}
  } catch (error) {
    console.error('Error creating waitlist entry:', error)
    return {success: false, error: 'Failed to create waitlist entry'}
  }
}

// Helper function to check if email already exists
export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    const query = `*[_type == "waitlist" && email == $email][0]`
    const result = await serverClient.fetch(query, {email})
    return !!result
  } catch (error) {
    console.error('Error checking email:', error)
    return false
  }
}
