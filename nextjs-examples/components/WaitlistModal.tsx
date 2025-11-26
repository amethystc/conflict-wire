'use client'

// Optional: Modal version of the waitlist form
// Copy this to: app/components/WaitlistModal.tsx

import {useState} from 'react'
import {WaitlistForm} from './WaitlistForm'

export function WaitlistModal() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Button to open modal - customize this to match your design */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors"
      >
        Become an exclusive member today
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Modal content */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Join Conflict Wire</h2>
              <p className="text-gray-600">
                Get the inside story on the world's updates. Become an exclusive member today.
              </p>
            </div>

            <WaitlistForm
              onSuccess={() => {
                // Optional: Close modal after successful submission
                setTimeout(() => setIsOpen(false), 3000)
              }}
            />
          </div>
        </div>
      )}
    </>
  )
}
