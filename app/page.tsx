'use client'
import React from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

const HomePage: React.FC = () => {
  const { data: session, status } = useSession()

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">Welcome to the Blood Testing Portal</h1>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <p>Efficient and secure management of blood test results.</p>
                {status === 'loading' ? (
                  <p>Loading...</p>
                ) : session ? (
                  <div>
                    <p>Welcome, {session.user?.name}!</p>
                    <Link href="/dashboard" className="text-cyan-600 hover:text-cyan-700">
                      Go to Dashboard
                    </Link>
                  </div>
                ) : (
                  <div>
                    <p>Please log in to access the dashboard.</p>
                    <Link href="/login" className="text-cyan-600 hover:text-cyan-700">
                      Log In
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
