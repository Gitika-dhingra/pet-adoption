import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { VetDashboard } from "@/components/vets/vet-dashboard"

export const metadata = {
  title: "Vet Dashboard | PawFinder",
  description: "Manage pets and provide veterinary services.",
}

export default function VetPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold md:text-4xl">Vet Dashboard</h1>
            <p className="text-muted-foreground">
              Manage pets and provide veterinary care information
            </p>
          </div>
          <VetDashboard />
        </div>
      </main>
      <Footer />
    </div>
  )
}