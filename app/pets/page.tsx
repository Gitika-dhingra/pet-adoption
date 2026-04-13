import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PetFilters } from "@/components/pets/pet-filters"
import { PetGrid } from "@/components/pets/pet-grid"
import { Suspense } from "react"
import { Spinner } from "@/components/ui/spinner"

export const metadata = {
  title: "Adopt a Pet | PawFinder",
  description: "Browse hundreds of adorable pets looking for their forever homes. Filter by species, age, size, and more.",
}

export default function PetsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold md:text-4xl">Find Your Perfect Pet</h1>
            <p className="text-muted-foreground">
              Browse our available pets and find your new best friend
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            <aside>
              <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-muted" />}>
                <PetFilters />
              </Suspense>
            </aside>
            <Suspense fallback={
              <div className="flex items-center justify-center py-12">
                <Spinner className="h-8 w-8" />
              </div>
            }>
              <PetGrid />
            </Suspense>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
