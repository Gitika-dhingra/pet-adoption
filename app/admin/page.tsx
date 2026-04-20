import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export const metadata = {
  title: "Admin Dashboard | PawFinder",
  description: "Manage pets and users in the PawFinder system.",
}

export default function AdminPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold md:text-4xl">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage pets, users, and system settings
            </p>
          </div>
          <AdminDashboard />
        </div>
      </main>
      <Footer />
    </div>
  )
}