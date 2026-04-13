"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, MapPin, ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import useSWR from "swr"
import { createClient } from "@/lib/supabase/client"
import { Spinner } from "@/components/ui/spinner"

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
}

const fetcher = async (): Promise<Pet[]> => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("pets")
    .select("*")
    .eq("status", "available")
    .limit(6)
    .order("created_at", { ascending: false })
  
  if (error) throw error
  return data || []
}

// Fallback pets for demo
const fallbackPets: Pet[] = [
  {
    id: "1",
    name: "Buddy",
    species: "dog",
    breed: "Golden Retriever",
    age: 2,
    age_unit: "years",
    gender: "male",
    size: "large",
    image_url: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop",
    location: "San Francisco, CA",
    status: "available",
  },
  {
    id: "2",
    name: "Luna",
    species: "cat",
    breed: "British Shorthair",
    age: 1,
    age_unit: "years",
    gender: "female",
    size: "medium",
    image_url: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=400&fit=crop",
    location: "Los Angeles, CA",
    status: "available",
  },
  {
    id: "3",
    name: "Max",
    species: "dog",
    breed: "German Shepherd",
    age: 3,
    age_unit: "years",
    gender: "male",
    size: "large",
    image_url: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400&h=400&fit=crop",
    location: "Seattle, WA",
    status: "available",
  },
  {
    id: "4",
    name: "Milo",
    species: "cat",
    breed: "Tabby",
    age: 6,
    age_unit: "months",
    gender: "male",
    size: "small",
    image_url: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=400&h=400&fit=crop",
    location: "Austin, TX",
    status: "available",
  },
  {
    id: "5",
    name: "Bella",
    species: "dog",
    breed: "Labrador Mix",
    age: 4,
    age_unit: "years",
    gender: "female",
    size: "medium",
    image_url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop",
    location: "Denver, CO",
    status: "available",
  },
  {
    id: "6",
    name: "Oliver",
    species: "cat",
    breed: "Maine Coon",
    age: 2,
    age_unit: "years",
    gender: "male",
    size: "large",
    image_url: "https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?w=400&h=400&fit=crop",
    location: "Portland, OR",
    status: "available",
  },
]

export function FeaturedPets() {
  const { data: pets, isLoading } = useSWR("featured-pets", fetcher)
  
  const displayPets = pets && pets.length > 0 ? pets : fallbackPets

  return (
    <section className="bg-secondary/30 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <h2 className="mb-2 text-3xl font-bold md:text-4xl">Meet Our Adorable Pets</h2>
            <p className="text-muted-foreground">These lovely animals are looking for their forever homes</p>
          </div>
          <Button variant="outline" asChild className="gap-2">
            <Link href="/pets">
              View All Pets
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner className="h-8 w-8" />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayPets.map((pet, index) => (
              <motion.div
                key={pet.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/pets/${pet.id}`}>
                  <Card className="group h-full overflow-hidden border-border/50 transition-all hover:border-primary/30 hover:shadow-xl">
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={pet.image_url}
                        alt={pet.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <button 
                        className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-card/80 backdrop-blur transition-colors hover:bg-card"
                        onClick={(e) => e.preventDefault()}
                      >
                        <Heart className="h-5 w-5 text-muted-foreground transition-colors hover:text-destructive" />
                      </button>
                      <Badge 
                        className="absolute left-3 top-3 capitalize"
                        variant={pet.species === "dog" ? "default" : "secondary"}
                      >
                        {pet.species}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="text-xl font-semibold">{pet.name}</h3>
                        <span className="text-sm text-muted-foreground">
                          {pet.age} {pet.age_unit}
                        </span>
                      </div>
                      <p className="mb-3 text-sm text-muted-foreground">{pet.breed}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{pet.location}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
