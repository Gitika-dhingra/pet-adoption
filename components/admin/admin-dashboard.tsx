"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PetForm } from "@/components/admin/pet-form"
import { UserManagement } from "@/components/admin/user-management"
import { Plus, Edit, Trash2, Users, PawPrint, Stethoscope } from "lucide-react"
import { backendUrl, backendRequest, getAuthToken } from "@/lib/backend"
import { Spinner } from "@/components/ui/spinner"

interface Vet {
  _id: string
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

export function AdminDashboard() {
  const router = useRouter()
  const [pets, setPets] = useState<Pet[]>([])
  const [vets, setVets] = useState<Vet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const [selectedVet, setSelectedVet] = useState<Vet | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isVetDialogOpen, setIsVetDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("pets")

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await backendRequest("/api/auth/me")
        if (user.role !== 'admin') {
          router.push("/auth/admin-login")
          return
        }
      } catch (error) {
        router.push("/auth/admin-login")
        return
      }
      loadPets()
      loadVets()
    }

    checkAuth()
  }, [router])

  const loadPets = async () => {
    try {
      const token = getAuthToken()
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

  const loadVets = async () => {
    try {
      const token = getAuthToken()
      const response = await fetch(`${backendUrl}/api/vets`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (response.ok) {
        setVets(data.vets)
      }
    } catch (error) {
      console.error('Error loading vets:', error)
    }
  }

  const handleDeletePet = async (petId: string) => {
    if (!confirm('Are you sure you want to delete this pet?')) return

    try {
      const token = getAuthToken()
      const response = await fetch(`${backendUrl}/api/pets/${petId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setPets(pets.filter(pet => pet.id !== petId))
      }
    } catch (error) {
      console.error('Error deleting pet:', error)
    }
  }

  const handleDeleteVet = async (vetId: string) => {
    if (!confirm('Are you sure you want to delete this vet?')) return

    try {
      const token = getAuthToken()
      const response = await fetch(`${backendUrl}/api/vets/${vetId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setVets(vets.filter(vet => vet._id !== vetId))
      }
    } catch (error) {
      console.error('Error deleting vet:', error)
    }
  }

  const handlePetSaved = () => {
    setIsDialogOpen(false)
    setSelectedPet(null)
    loadPets()
  }

  const handleVetSaved = () => {
    setIsVetDialogOpen(false)
    setSelectedVet(null)
    loadVets()
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
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pets" className="flex items-center gap-2">
            <PawPrint className="h-4 w-4" />
            Pets Management
          </TabsTrigger>
          <TabsTrigger value="vets" className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            Vets Management
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pets" className="space-y-6">
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
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeletePet(pet.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="vets" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Vet Management</h2>
            <Dialog open={isVetDialogOpen} onOpenChange={setIsVetDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setSelectedVet(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Vet
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {selectedVet ? 'Edit Vet' : 'Add New Vet'}
                  </DialogTitle>
                </DialogHeader>
                {/* VetForm component would go here - for now, just placeholder */}
                <div className="p-4 text-center text-muted-foreground">
                  Vet form coming soon...
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {vets.map((vet) => (
              <Card key={vet._id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{vet.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {vet.phone}
                      </p>
                    </div>
                    <Badge variant={vet.isOpen ? 'default' : 'secondary'}>
                      {vet.isOpen ? 'Open' : 'Closed'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <strong>Address:</strong> {vet.address}
                    </p>
                    <p className="text-sm">
                      <strong>Rating:</strong> {vet.rating} ({vet.reviewCount} reviews)
                    </p>
                    <p className="text-sm">
                      <strong>Hours:</strong> {vet.hours}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {vet.services.slice(0, 2).map((service) => (
                        <Badge key={service} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                      {vet.services.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{vet.services.length - 2} more
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedVet(vet)
                          setIsVetDialogOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteVet(vet._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}