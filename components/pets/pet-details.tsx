"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Heart, 
  MapPin, 
  Share2, 
  Check, 
  X, 
  MessageCircle,
  ArrowLeft,
  Calendar,
  Ruler,
  PawPrint
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { backendRequest } from "@/lib/backend"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AdoptionForm } from "./adoption-form"

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
  is_vaccinated?: boolean
  is_neutered?: boolean
  is_housetrained?: boolean
  good_with_kids?: boolean
  good_with_dogs?: boolean
  good_with_cats?: boolean
}

interface User {
  id: string
  email?: string
}

interface PetDetailsProps {
  pet: Pet
}

export function PetDetails({ pet }: PetDetailsProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [showAdoptDialog, setShowAdoptDialog] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await backendRequest("/api/auth/me")
        setUser(data.user)
      } catch {
        setUser(null)
      }
    }

    fetchUser()
  }, [])

  const traits = [
    { label: "Vaccinated", value: pet.is_vaccinated },
    { label: "Neutered/Spayed", value: pet.is_neutered },
    { label: "House Trained", value: pet.is_housetrained },
    { label: "Good with Kids", value: pet.good_with_kids },
    { label: "Good with Dogs", value: pet.good_with_dogs },
    { label: "Good with Cats", value: pet.good_with_cats },
  ]

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `Adopt ${pet.name} on PawFinder`,
        text: `Meet ${pet.name}, a lovely ${pet.breed} looking for a forever home!`,
        url: window.location.href,
      })
    } else {
      await navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <Link 
        href="/pets" 
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to all pets
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image Section */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
            <img
              src={pet.image_url}
              alt={pet.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute right-4 top-4 flex gap-2">
              <Button
                variant="secondary"
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={() => setIsFavorited(!isFavorited)}
              >
                <Heart 
                  className={`h-5 w-5 ${isFavorited ? "fill-destructive text-destructive" : ""}`} 
                />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={handleShare}
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant="default" className="capitalize">
                {pet.species}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {pet.gender}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {pet.size}
              </Badge>
              {pet.status === "available" && (
                <Badge variant="secondary" className="bg-accent/20 text-accent">
                  Available
                </Badge>
              )}
            </div>
            <h1 className="mb-2 text-3xl font-bold md:text-4xl">{pet.name}</h1>
            <p className="text-lg text-muted-foreground">{pet.breed}</p>
          </div>

          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span>{pet.age} {pet.age_unit} old</span>
            </div>
            <div className="flex items-center gap-2">
              <Ruler className="h-5 w-5 text-muted-foreground" />
              <span className="capitalize">{pet.size} size</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <span>{pet.location}</span>
            </div>
          </div>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">About {pet.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed text-muted-foreground">{pet.description}</p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Characteristics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {traits.map((trait) => (
                  <div
                    key={trait.label}
                    className={`flex items-center gap-2 rounded-lg p-2 ${
                      trait.value
                        ? "bg-accent/10 text-accent"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {trait.value ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                    <span className="text-sm">{trait.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Dialog open={showAdoptDialog} onOpenChange={setShowAdoptDialog}>
              <DialogTrigger asChild>
                <Button size="lg" className="flex-1 gap-2">
                  <PawPrint className="h-5 w-5" />
                  Apply to Adopt
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Adopt {pet.name}</DialogTitle>
                  <DialogDescription>
                    Fill out this application to start the adoption process.
                  </DialogDescription>
                </DialogHeader>
                <AdoptionForm 
                  petId={pet.id} 
                  petName={pet.name}
                  user={user}
                  onSuccess={() => setShowAdoptDialog(false)}
                />
              </DialogContent>
            </Dialog>
            <Button size="lg" variant="outline" className="flex-1 gap-2" asChild>
              <Link href="/chat">
                <MessageCircle className="h-5 w-5" />
                Ask AI About {pet.name}
              </Link>
            </Button>
          </div>

          {!user && (
            <p className="text-center text-sm text-muted-foreground">
              <Link href="/auth/login" className="text-primary hover:underline">
                Sign in
              </Link>{" "}
              to save favorites and apply for adoption
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
