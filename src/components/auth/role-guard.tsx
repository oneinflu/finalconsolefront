"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles?: string[]
  restrictedRoles?: string[]
}

export default function RoleGuard({ children, allowedRoles, restrictedRoles }: RoleGuardProps) {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if we are in the browser
    if (typeof window === "undefined") return

    const userStr = localStorage.getItem("user")
    if (!userStr) {
      router.push("/login")
      return
    }

    const user = JSON.parse(userStr)
    const userRole = user?.role

    let isAuthorized = false

    // Strategy 1: Explicitly Allowed Roles (if provided)
    if (allowedRoles && allowedRoles.length > 0) {
      if (allowedRoles.includes(userRole)) {
        isAuthorized = true
      }
    } 
    // Strategy 2: Explicitly Restricted Roles (if provided)
    else if (restrictedRoles && restrictedRoles.length > 0) {
      if (!restrictedRoles.includes(userRole)) {
        isAuthorized = true
      }
    }
    // Default: Allow if no restrictions specified
    else {
      isAuthorized = true
    }

    setAuthorized(isAuthorized)
    setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowedRoles, restrictedRoles])

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Checking permissions...</p>
      </div>
    )
  }

  if (!authorized) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-muted/20 p-4 text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-lg text-muted-foreground mb-8">
          You do not have permission to view this page.
        </p>
        <button 
          onClick={() => router.push("/dashboard/blogs")}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Go to My Blogs
        </button>
      </div>
    )
  }

  return <>{children}</>
}