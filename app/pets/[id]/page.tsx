import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PetDetails } from "@/components/pets/pet-details"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ id: string }>
}

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"

async function getPet(id: string) {
  try {
    const response = await fetch(`${backendUrl}/api/pets/${id}`, {
      cache: "no-store",
    })
    if (!response.ok) return null
    const result = await response.json()
    return result.pet || null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const pet = await getPet(id)

  if (!pet) {
    return { title: "Pet Not Found | PawFinder" }
  }

  return {
    title: `Adopt ${pet.name} - ${pet.breed} | PawFinder`,
    description: `Meet ${pet.name}, a lovely ${pet.breed} available for adoption. Give them a loving forever home today!`,
  }
}

export default async function PetDetailsPage({ params }: Props) {
  const { id } = await params
  const pet = await getPet(id)

  if (!pet) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <PetDetails pet={pet} />
      </main>
      <Footer />
    </div>
  )
}
