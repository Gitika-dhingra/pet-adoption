"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, MapPin, PawPrint } from "lucide-react"
import Link from "next/link"
import useSWR from "swr"
import { backendUrl } from "@/lib/backend"
import { Spinner } from "@/components/ui/spinner"
import { Empty } from "@/components/ui/empty"

interface Pet {
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
}

// Fallback pets for demo
const fallbackPets: Pet[] = []

export function PetGrid() {
  const searchParams = useSearchParams()
  
  const fetcher = async (): Promise<Pet[]> => {
    const params = new URLSearchParams()
    const species = searchParams.get("species")
    const sizes = searchParams.get("size")?.split(",").filter(Boolean)
    const genders = searchParams.get("gender")?.split(",").filter(Boolean)
    const minAge = searchParams.get("minAge")
    const maxAge = searchParams.get("maxAge")

    if (species) params.set("species", species)
    if (sizes && sizes.length > 0) params.set("size", sizes.join(","))
    if (genders && genders.length > 0) params.set("gender", genders.join(","))
    if (minAge) params.set("minAge", minAge)
    if (maxAge) params.set("maxAge", maxAge)

    const url = `${backendUrl}/api/pets?${params.toString()}`
    const response = await fetch(url)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Unable to load pets")
    }

    return data.pets || []
  }

  const { data: pets, isLoading, error } = useSWR(
    ["pets", searchParams.toString()],
    fetcher
  )

  const displayPets = pets || []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (error) {
    return (
      <Empty
        icon={PawPrint}
        title="Error loading pets"
        description="Something went wrong. Please try again later."
      />
    )
  }

  if (displayPets.length === 0) {
    return (
      <Empty
        icon={PawPrint}
        title="No pets found"
        description="Try adjusting your filters to find more pets."
      />
    )
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {displayPets.length} pets
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {displayPets.map((pet) => (
          <Link key={pet.id} href={`/pets/${pet.id}`}>
            <Card className="group h-full overflow-hidden border-border/50 transition-all hover:border-primary/30 hover:shadow-xl">
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={pet.image_url}
                  alt={pet.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <button
                  className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-card/80 backdrop-blur transition-colors hover:bg-card"
                  onClick={(e) => {
                    e.preventDefault()
                    // Handle favorite
                  }}
                >
                  <Heart className="h-5 w-5 text-muted-foreground transition-colors hover:text-destructive" />
                </button>
                <div className="absolute left-3 top-3 flex gap-2">
                  <Badge variant={pet.species === "dog" ? "default" : "secondary"} className="capitalize">
                    {pet.species}
                  </Badge>
                  <Badge variant="outline" className="bg-card/80 capitalize backdrop-blur">
                    {pet.gender}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{pet.name}</h3>
                  <span className="text-sm text-muted-foreground">
                    {pet.age} {pet.age_unit}
                  </span>
                </div>
                <p className="mb-3 text-sm text-muted-foreground">{pet.breed}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{pet.location}</span>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {pet.size}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
