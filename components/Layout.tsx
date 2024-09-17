'use client'

import React, { ReactNode } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

interface LayoutProps {
  children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { data: session } = useSession()

  return (
    <div>
      <nav>
        <Link href="/">Home</Link>
        {session ? (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <button onClick={() => signOut()}>Sign out</button>
          </>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </nav>
      <main>{children}</main>
    </div>
  )
}

export default Layout
