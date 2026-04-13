import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { VetFinder } from "@/components/vets/vet-finder"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Find Nearby Veterinarians | PawFinder",
  description: "Locate trusted veterinarians in your area. View ratings, hours, services, and get directions with one click.",
}

export default function VetsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <VetFinder />
      </main>
      <Footer />
    </div>
  )
}
