"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PetForm } from "@/components/admin/pet-form"
import { Plus, Edit, Stethoscope, Heart } from "lucide-react"
import { backendUrl } from "@/lib/backend"
import { Spinner } from "@/components/ui/spinner"
import { backendRequest } from "@/lib/backend"

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
  is_vaccinated: boolean
  is_neutered: boolean
  is_housetrained: boolean
  good_with_kids: boolean
  good_with_dogs: boolean
  good_with_cats: boolean
  createdAt: string
}

export function VetDashboard() {
  const router = useRouter()
  const [pets, setPets] = useState<Pet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await backendRequest("/api/auth/me")
        if (user.role !== 'vet' && user.role !== 'admin') {
          router.push("/auth/vet-login")
          return
        }
      } catch (error) {
        router.push("/auth/vet-login")
        return
      }
      loadPets()
    }

    checkAuth()
  }, [router])

  const loadPets = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${backendUrl}/api/pets/admin/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (response.ok) {
        setPets(data.pets)
      }
    } catch (error) {
      console.error('Error loading pets:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePetSaved = () => {
    setIsDialogOpen(false)
    setSelectedPet(null)
    loadPets()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pets</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pets.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Pets</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pets.filter(pet => pet.status === 'available').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Adopted Pets</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pets.filter(pet => pet.status === 'adopted').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Pet Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedPet(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Pet
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedPet ? 'Edit Pet' : 'Add New Pet'}
              </DialogTitle>
            </DialogHeader>
            <PetForm
              pet={selectedPet}
              onSaved={handlePetSaved}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pets.map((pet) => (
          <Card key={pet.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{pet.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {pet.breed} • {pet.species}
                  </p>
                </div>
                <Badge variant={pet.status === 'available' ? 'default' : 'secondary'}>
                  {pet.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Age:</strong> {pet.age} {pet.age_unit}
                </p>
                <p className="text-sm">
                  <strong>Gender:</strong> {pet.gender}
                </p>
                <p className="text-sm">
                  <strong>Location:</strong> {pet.location}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {pet.is_vaccinated && <Badge variant="outline" className="text-xs">Vaccinated</Badge>}
                  {pet.is_neutered && <Badge variant="outline" className="text-xs">Spayed/Neutered</Badge>}
                  {pet.is_housetrained && <Badge variant="outline" className="text-xs">House Trained</Badge>}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedPet(pet)
                      setIsDialogOpen(true)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}