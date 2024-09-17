/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect, useRouter } from 'next/navigation'
import Link from 'next/link'
import { SignInFormWrapper } from '@/app/login/SignInFormWrapper'

export default function SignInPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    } else {
      setIsLoading(false)
    }
  }, [status, router])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md px-8 py-10 bg-gray-50 rounded-lg shadow-sm">
        <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">Sign In</h1>
        <SignInFormWrapper />
        <p className="mt-6 text-center text-gray-600">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}
