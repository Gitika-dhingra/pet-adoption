"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PetForm } from "@/components/admin/pet-form"
import { UserManagement } from "@/components/admin/user-management"
import { Plus, Edit, Trash2, Users, PawPrint, Stethoscope, AlertTriangle, MapPin, Phone, Mail, Clock } from "lucide-react"
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
  const [reports, setReports] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const [selectedVet, setSelectedVet] = useState<Vet | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isVetDialogOpen, setIsVetDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")

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
      loadReports()
      loadUsers()
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

  const loadReports = async () => {
    try {
      const token = getAuthToken()
      const response = await fetch(`${backendUrl}/api/reports/admin/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (response.ok) {
        setReports(data.reports)
      }
    } catch (error) {
      console.error('Error loading reports:', error)
    }
  }

  const loadUsers = async () => {
    try {
      const token = getAuthToken()
      const response = await fetch(`${backendUrl}/api/auth/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (response.ok) {
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Error loading users:', error)
    }
    finally {
      setIsLoading(false)
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
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <PawPrint className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="pets" className="flex items-center gap-2">
            <PawPrint className="h-4 w-4" />
            Pets Management
          </TabsTrigger>
          <TabsTrigger value="vets" className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            Vets Management
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Management
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <h2 className="text-2xl font-semibold">Dashboard Overview</h2>
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <PawPrint className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{pets.length}</p>
                  <p className="text-sm text-muted-foreground">Total Pets</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                  <Stethoscope className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{vets.length}</p>
                  <p className="text-sm text-muted-foreground">Total Vets</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{users.length}</p>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{reports.length}</p>
                  <p className="text-sm text-muted-foreground">Injury Reports</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Reports */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Recent Reports</h3>
            {reports.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  No reports yet
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {reports.slice(0, 5).map((report) => (
                  <Card key={report._id} className="border-border/50">
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex-1">
                        <p className="font-semibold">{report.animalType} - {report.description.substring(0, 50)}...</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {report.location}
                        </div>
                      </div>
                      <Badge className={report.urgency === 'critical' ? 'bg-destructive' : 'bg-yellow-500'}>
                        {report.urgency}
                      </Badge>
                      <Badge variant={report.status === 'pending' ? 'secondary' : 'outline'} className="ml-2">
                        {report.status}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

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

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <h2 className="text-2xl font-semibold">Injury Reports</h2>
          
          {reports.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center text-muted-foreground">
                <AlertTriangle className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No injury reports yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <Card key={report._id} className="border-border/50">
                  <CardContent className="p-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h3 className="font-semibold mb-2">
                          {report.animalType.charAt(0).toUpperCase() + report.animalType.slice(1)}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">{report.description}</p>
                        <div className="flex items-center gap-2 text-sm mb-2">
                          <MapPin className="h-4 w-4" />
                          <span>{report.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4" />
                          <span>{report.reporterPhone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4" />
                          <span>{report.reporterEmail}</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Badge className={report.urgency === 'critical' ? 'bg-destructive' : report.urgency === 'high' ? 'bg-orange-500' : 'bg-yellow-500'}>
                            {report.urgency}
                          </Badge>
                          <Badge variant={report.status === 'resolved' ? 'default' : 'secondary'}>
                            {report.status}
                          </Badge>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Update Status</label>
                          <Select 
                            value={report.status}
                            onValueChange={async (newStatus) => {
                              try {
                                const token = getAuthToken()
                                await fetch(`${backendUrl}/api/reports/${report._id}/status`, {
                                  method: 'PATCH',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                  },
                                  body: JSON.stringify({ status: newStatus })
                                })
                                loadReports()
                              } catch (error) {
                                console.error('Error updating report status:', error)
                              }
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="resolved">Resolved</SelectItem>
                              <SelectItem value="unable-to-help">Unable to Help</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {new Date(report.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}