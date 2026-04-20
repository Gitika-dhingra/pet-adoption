"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PetForm } from "@/components/admin/pet-form"
import { UserManagement } from "@/components/admin/user-management"
import { Plus, Edit, Trash2, Users, PawPrint } from "lucide-react"
import { backendUrl } from "@/lib/backend"
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
  description: string
  is_vaccinated: boolean
  is_neutered: boolean
  is_housetrained: boolean
  good_with_kids: boolean
  good_with_dogs: boolean
  good_with_cats: boolean
  createdAt: string
}

export function AdminDashboard() {
  const [pets, setPets] = useState<Pet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("pets")

  useEffect(() => {
    loadPets()
  }, [])

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

  const handleDeletePet = async (petId: string) => {
    if (!confirm('Are you sure you want to delete this pet?')) return

    try {
      const token = localStorage.getItem('token')
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
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pets" className="flex items-center gap-2">
            <PawPrint className="h-4 w-4" />
            Pets Management
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

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}