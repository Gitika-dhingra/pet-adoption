import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import DashboardClient from "@/components/dashboard/dashboard-client"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard | PawFinder",
  description: "Manage your adoption applications, favorites, and injury reports.",
}

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <DashboardClient />
      </main>
      <Footer />
    </div>
  )
}
