"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"
import { DashboardContent } from "@/components/dashboard/dashboard-content"
import { backendRequest } from "@/lib/backend"

export default function DashboardClient() {
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await backendRequest("/api/dashboard")
        setDashboardData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load dashboard")
        router.push("/auth/login")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboard()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (!dashboardData || error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8 text-center">
        <div>
          <p className="mb-4 text-lg font-semibold">Unable to load dashboard.</p>
          <p className="text-muted-foreground">Please sign in again or try refreshing the page.</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardContent
      user={dashboardData.user}
      applications={dashboardData.applications}
      favorites={dashboardData.favorites}
      reports={dashboardData.reports}
    />
  )
}
