"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { 
  MapPin, 
  Search, 
  Star, 
  Clock, 
  Phone, 
  ExternalLink,
  Navigation,
  Stethoscope
} from "lucide-react"

interface Vet {
  id: string
  name: string
  address: string
  phone: string
  rating: number
  reviewCount: number
  distance: string
  isOpen: boolean
  hours: string
  services: string[]
  image: string
}

// Demo vet data
const demoVets: Vet[] = [
  {
    id: "1",
    name: "Happy Paws Veterinary Clinic",
    address: "123 Main Street, San Francisco, CA 94102",
    phone: "(415) 555-0123",
    rating: 4.8,
    reviewCount: 245,
    distance: "0.5 mi",
    isOpen: true,
    hours: "Open until 8:00 PM",
    services: ["Emergency Care", "Surgery", "Dental", "Vaccinations"],
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400&h=300&fit=crop",
  },
  {
    id: "2",
    name: "City Pet Hospital",
    address: "456 Oak Avenue, San Francisco, CA 94103",
    phone: "(415) 555-0456",
    rating: 4.6,
    reviewCount: 189,
    distance: "1.2 mi",
    isOpen: true,
    hours: "Open until 6:00 PM",
    services: ["General Care", "X-Ray", "Lab Tests", "Grooming"],
    image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&h=300&fit=crop",
  },
  {
    id: "3",
    name: "24/7 Emergency Animal Hospital",
    address: "789 Market Street, San Francisco, CA 94104",
    phone: "(415) 555-0789",
    rating: 4.9,
    reviewCount: 312,
    distance: "1.8 mi",
    isOpen: true,
    hours: "Open 24 hours",
    services: ["24/7 Emergency", "ICU", "Surgery", "Specialists"],
    image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400&h=300&fit=crop",
  },
  {
    id: "4",
    name: "Furry Friends Vet Care",
    address: "321 Valencia Street, San Francisco, CA 94110",
    phone: "(415) 555-0321",
    rating: 4.5,
    reviewCount: 156,
    distance: "2.3 mi",
    isOpen: false,
    hours: "Opens at 9:00 AM",
    services: ["Wellness Exams", "Vaccinations", "Microchipping", "Nutrition"],
    image: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=400&h=300&fit=crop",
  },
  {
    id: "5",
    name: "Bay Area Animal Clinic",
    address: "555 Mission Street, San Francisco, CA 94105",
    phone: "(415) 555-0555",
    rating: 4.7,
    reviewCount: 201,
    distance: "2.8 mi",
    isOpen: true,
    hours: "Open until 7:00 PM",
    services: ["Surgery", "Dentistry", "Dermatology", "Cardiology"],
    image: "https://images.unsplash.com/photo-1612531386530-97286d97c2d2?w=400&h=300&fit=crop",
  },
]

export function VetFinder() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [vets, setVets] = useState<Vet[]>(demoVets)
  const [isLoading, setIsLoading] = useState(false)

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser")
      return
    }

    setIsGettingLocation(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setIsGettingLocation(false)
        // In production, you'd fetch real vets based on location
      },
      () => {
        alert("Unable to retrieve your location")
        setIsGettingLocation(false)
      }
    )
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate search
    setTimeout(() => {
      const filtered = demoVets.filter(
        (vet) =>
          vet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vet.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vet.services.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      setVets(filtered.length > 0 ? filtered : demoVets)
      setIsLoading(false)
    }, 500)
  }

  const openInMaps = (address: string) => {
    const encoded = encodeURIComponent(address)
    window.open(`https://www.google.com/maps/search/?api=1&query=${encoded}`, "_blank")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold md:text-4xl">Find Nearby Veterinarians</h1>
        <p className="text-muted-foreground">
          Locate trusted vets in your area for regular checkups or emergencies
        </p>
      </div>

      {/* Search Section */}
      <Card className="mx-auto mb-8 max-w-2xl border-border/50">
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, location, or service..."
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleGetLocation}
                disabled={isGettingLocation}
                className="gap-2"
              >
                {isGettingLocation ? (
                  <Spinner className="h-4 w-4" />
                ) : (
                  <Navigation className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">Near Me</span>
              </Button>
              <Button type="submit" className="gap-2">
                <Search className="h-4 w-4" />
                Search
              </Button>
            </div>
          </form>
          {location && (
            <p className="mt-3 text-sm text-muted-foreground">
              <MapPin className="mr-1 inline h-4 w-4" />
              Showing results near your location
            </p>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner className="h-8 w-8" />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {vets.map((vet) => (
            <Card key={vet.id} className="overflow-hidden border-border/50 transition-all hover:shadow-lg">
              <div className="flex flex-col sm:flex-row">
                <div className="aspect-video w-full sm:aspect-square sm:w-48">
                  <img
                    src={vet.image}
                    alt={vet.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardContent className="flex flex-1 flex-col p-4">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">{vet.name}</h3>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span className="font-medium">{vet.rating}</span>
                        <span className="text-muted-foreground">({vet.reviewCount} reviews)</span>
                      </div>
                    </div>
                    <Badge variant={vet.isOpen ? "default" : "secondary"} className="shrink-0">
                      {vet.isOpen ? "Open" : "Closed"}
                    </Badge>
                  </div>

                  <div className="mb-3 space-y-1 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span>{vet.address}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="h-4 w-4 shrink-0" />
                      <span>{vet.hours}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Navigation className="h-4 w-4 shrink-0" />
                      <span>{vet.distance} away</span>
                    </p>
                  </div>

                  <div className="mb-4 flex flex-wrap gap-1">
                    {vet.services.slice(0, 3).map((service) => (
                      <Badge key={service} variant="outline" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                    {vet.services.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{vet.services.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <div className="mt-auto flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 gap-1" asChild>
                      <a href={`tel:${vet.phone.replace(/[^0-9]/g, "")}`}>
                        <Phone className="h-4 w-4" />
                        Call
                      </a>
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 gap-1"
                      onClick={() => openInMaps(vet.address)}
                    >
                      <ExternalLink className="h-4 w-4" />
                      Directions
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Emergency CTA */}
      <Card className="mx-auto mt-8 max-w-2xl border-destructive/30 bg-destructive/5">
        <CardContent className="flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:text-left">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-destructive/10">
            <Stethoscope className="h-6 w-6 text-destructive" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Pet Emergency?</h3>
            <p className="text-sm text-muted-foreground">
              If your pet needs immediate medical attention, contact a 24/7 emergency vet right away.
            </p>
          </div>
          <Button variant="destructive" className="shrink-0" asChild>
            <a href="tel:911">Call Emergency</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
