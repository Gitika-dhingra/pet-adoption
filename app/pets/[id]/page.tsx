import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PetDetails } from "@/components/pets/pet-details"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ id: string }>
}

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"

// Demo pet data
const demoPets: Record<string, {
  id: string
  name: string
  species: string
  breed: string
  age: number
  age_unit: string
  gender: string
  size: string
  image_url: string
  location: string
  status: string
  description: string
  is_vaccinated: boolean
  is_neutered: boolean
  is_housetrained: boolean
  good_with_kids: boolean
  good_with_dogs: boolean
  good_with_cats: boolean
}> = {
  "1": {
    id: "1",
    name: "Buddy",
    species: "dog",
    breed: "Golden Retriever",
    age: 2,
    age_unit: "years",
    gender: "male",
    size: "large",
    image_url: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=800&fit=crop",
    location: "San Francisco, CA",
    status: "available",
    description: "Meet Buddy, a friendly and playful Golden Retriever who loves everyone he meets! Buddy enjoys long walks in the park, playing fetch, and cuddling on the couch. He is great with kids and other dogs, making him the perfect family companion. Buddy is fully trained, knows basic commands, and is always eager to please. He would thrive in an active household that can give him plenty of exercise and love.",
    is_vaccinated: true,
    is_neutered: true,
    is_housetrained: true,
    good_with_kids: true,
    good_with_dogs: true,
    good_with_cats: false,
  },
  "2": {
    id: "2",
    name: "Luna",
    species: "cat",
    breed: "British Shorthair",
    age: 1,
    age_unit: "years",
    gender: "female",
    size: "medium",
    image_url: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800&h=800&fit=crop",
    location: "Los Angeles, CA",
    status: "available",
    description: "Luna is a beautiful British Shorthair with the most mesmerizing eyes. She is calm, affectionate, and loves to be pampered. Luna enjoys lounging in sunny spots and will purr contentedly when you pet her. She is independent enough to entertain herself but also loves quality time with her humans. Luna would do well in a quiet home where she can be the queen of the castle.",
    is_vaccinated: true,
    is_neutered: true,
    is_housetrained: true,
    good_with_kids: true,
    good_with_dogs: false,
    good_with_cats: true,
  },
  "3": {
    id: "3",
    name: "Max",
    species: "dog",
    breed: "German Shepherd",
    age: 3,
    age_unit: "years",
    gender: "male",
    size: "large",
    image_url: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=800&h=800&fit=crop",
    location: "Seattle, WA",
    status: "available",
    description: "Max is a loyal and intelligent German Shepherd looking for his forever home. He is highly trainable and loves to learn new tricks. Max is protective of his family while being gentle and affectionate with those he trusts. He needs an experienced owner who can provide consistent training and plenty of mental stimulation. Max would excel in activities like agility or obedience training.",
    is_vaccinated: true,
    is_neutered: true,
    is_housetrained: true,
    good_with_kids: true,
    good_with_dogs: true,
    good_with_cats: false,
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const demoPet = demoPets[id]
  let displayPet = demoPet

  try {
    const response = await fetch(`${backendUrl}/api/pets/${id}`)
    if (response.ok) {
      const result = await response.json()
      displayPet = result.pet || demoPet
    }
  } catch {
    displayPet = demoPet
  }

  if (!displayPet) {
    return { title: "Pet Not Found | PawFinder" }
  }

  return {
    title: `Adopt ${displayPet.name} - ${displayPet.breed} | PawFinder`,
    description: `Meet ${displayPet.name}, a lovely ${displayPet.breed} available for adoption. Give them a loving forever home today!`,
  }
}

export default async function PetDetailsPage({ params }: Props) {
  const { id } = await params
  let displayPet = demoPets[id]

  try {
    const response = await fetch(`${backendUrl}/api/pets/${id}`)
    if (response.ok) {
      const result = await response.json()
      displayPet = result.pet || demoPets[id]
    }
  } catch {
    displayPet = demoPets[id]
  }

  if (!displayPet) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <PetDetails pet={displayPet} />
      </main>
      <Footer />
    </div>
  )
}
