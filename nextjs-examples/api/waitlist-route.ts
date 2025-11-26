// Copy this to: app/api/waitlist/route.ts
// This is the API route for handling waitlist submissions

import {NextRequest, NextResponse} from 'next/server'
import {createWaitlistEntry, checkEmailExists} from '@/lib/sanity.server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {fullName, email} = body

    // Validate input
    if (!fullName || !email) {
      return NextResponse.json(
        {error: 'Full name and email are required'},
        {status: 400}
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {error: 'Please provide a valid email address'},
        {status: 400}
      )
    }

    // Check if email already exists
    const emailExists = await checkEmailExists(email)
    if (emailExists) {
      return NextResponse.json(
        {error: 'This email is already on the waitlist'},
        {status: 409}
      )
    }

    // Create waitlist entry
    const result = await createWaitlistEntry({fullName, email})

    if (!result.success) {
      return NextResponse.json(
        {error: result.error},
        {status: 500}
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully joined the waitlist!',
        data: result.data,
      },
      {status: 201}
    )
  } catch (error) {
    console.error('Waitlist API error:', error)
    return NextResponse.json(
      {error: 'An unexpected error occurred'},
      {status: 500}
    )
  }
}
