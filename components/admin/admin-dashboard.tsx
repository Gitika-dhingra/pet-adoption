"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PetForm } from "@/components/admin/pet-form"
import { VetForm } from "@/components/admin/vet-form"
import { UserManagement } from "@/components/admin/user-management"
import { Plus, Edit, Trash2, Users, PawPrint, Stethoscope, LayoutDashboard, AlertTriangle, ClipboardList, CheckCircle, XCircle, Clock, MapPin, Phone, Mail, User } from "lucide-react"
import { backendUrl, backendRequest, getAuthToken } from "@/lib/backend"
import { Spinner } from "@/components/ui/spinner"

interface Pet { id: string; name: string; species: string; breed: string; age: number; age_unit: string; gender: string; size: string; image_url: string; location: string; status: string; description: string; is_vaccinated: boolean; is_neutered: boolean; is_housetrained: boolean; good_with_kids: boolean; good_with_dogs: boolean; good_with_cats: boolean }
interface Vet { _id: string; name: string; address: string; phone: string; rating: number; reviewCount: number; distance: string; isOpen: boolean; hours: string; services: string[]; image: string }
interface Application { id: string; petId: string; userId: string; fullName: string; email: string; phone: string; address: string; status: string; createdAt: string }
interface InjuryReport { _id: string; animalType: string; description: string; location: string; urgency: string; status: string; reporterName: string; reporterPhone: string; reporterEmail: string; createdAt: string }

export function AdminDashboard() {
  const [pets, setPets] = useState<Pet[]>([])
  const [vets, setVets] = useState<Vet[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [reports, setReports] = useState<InjuryReport[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const [selectedVet, setSelectedVet] = useState<Vet | null>(null)
  const [petDialogOpen, setPetDialogOpen] = useState(false)
  const [vetDialogOpen, setVetDialogOpen] = useState(false)

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    setLoading(true)
    await Promise.allSettled([fetchPets(), fetchVets(), fetchApplications(), fetchReports(), fetchUsers()])
    setLoading(false)
  }

  async function fetchPets() {
    try {
      const token = getAuthToken()
      const r = await fetch(`${backendUrl}/api/pets/admin/all`, { headers: { Authorization: `Bearer ${token}` } })
      const d = await r.json(); if (r.ok) setPets(d.pets ?? [])
    } catch {}
  }

  async function fetchVets() {
    try {
      const token = getAuthToken()
      const r = await fetch(`${backendUrl}/api/vets`, { headers: { Authorization: `Bearer ${token}` } })
      const d = await r.json(); if (r.ok) setVets(d.vets ?? [])
    } catch {}
  }

  async function fetchApplications() {
    try {
      const d = await backendRequest("/api/adoption-applications/admin/all")
      setApplications(d.applications ?? [])
    } catch {}
  }

  async function fetchReports() {
    try {
      const token = getAuthToken()
      const r = await fetch(`${backendUrl}/api/injury-reports/admin/all`, { headers: { Authorization: `Bearer ${token}` } })
      const d = await r.json(); if (r.ok) setReports(d.reports ?? [])
    } catch {}
  }

  async function fetchUsers() {
    try {
      const d = await backendRequest("/api/auth/users"); setUsers(d.users ?? [])
    } catch {}
  }

  async function updateApplication(id: string, status: string) {
    setUpdatingId(id)
    try {
      const d = await backendRequest(`/api/adoption-applications/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) })
      if (d.application) setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a))
    } catch {}
    setUpdatingId(null)
  }

  async function updateReport(id: string, status: string) {
    setUpdatingId(id)
    try {
      const token = getAuthToken()
      const r = await fetch(`${backendUrl}/api/injury-reports/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      })
      if (r.ok) setReports(prev => prev.map(rp => rp._id === id ? { ...rp, status } : rp))
    } catch {}
    setUpdatingId(null)
  }

  async function deletePet(id: string) {
    if (!confirm("Delete this pet?")) return
    const token = getAuthToken()
    const r = await fetch(`${backendUrl}/api/pets/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } })
    if (r.ok) setPets(prev => prev.filter(p => p.id !== id))
  }

  async function deleteVet(id: string) {
    if (!confirm("Delete this vet?")) return
    const token = getAuthToken()
    const r = await fetch(`${backendUrl}/api/vets/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } })
    if (r.ok) setVets(prev => prev.filter(v => v._id !== id))
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <Spinner className="h-8 w-8" />
      <p className="text-sm text-muted-foreground">Loading admin data...</p>
    </div>
  )

  const pendingApps = applications.filter(a => a.status === "pending")
  const pendingReports = reports.filter(r => r.status === "pending")

  return (
    <div className="space-y-4">
      <Tabs defaultValue="dashboard">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard"><LayoutDashboard className="h-4 w-4 mr-1.5" />Dashboard</TabsTrigger>
          <TabsTrigger value="applications">
            <ClipboardList className="h-4 w-4 mr-1.5" />Applications
            {pendingApps.length > 0 && <Badge variant="destructive" className="ml-1.5 h-5 px-1.5 text-xs">{pendingApps.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="reports">
            <AlertTriangle className="h-4 w-4 mr-1.5" />Reports
            {pendingReports.length > 0 && <Badge variant="destructive" className="ml-1.5 h-5 px-1.5 text-xs">{pendingReports.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="pets"><PawPrint className="h-4 w-4 mr-1.5" />Pets</TabsTrigger>
          <TabsTrigger value="vets"><Stethoscope className="h-4 w-4 mr-1.5" />Vets</TabsTrigger>
          <TabsTrigger value="users"><Users className="h-4 w-4 mr-1.5" />Users</TabsTrigger>
        </TabsList>

        {/* -- DASHBOARD -- */}
        <TabsContent value="dashboard" className="space-y-6 pt-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <PawPrint className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{pets.length}</p>
                  <p className="text-sm text-muted-foreground">Total Pets</p>
                  <p className="text-xs text-muted-foreground">{pets.filter(p => p.status === "available").length} available</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Stethoscope className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{vets.length}</p>
                  <p className="text-sm text-muted-foreground">Total Vets</p>
                  <p className="text-xs text-muted-foreground">{vets.filter(v => v.isOpen).length} open</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{users.length}</p>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-xs text-muted-foreground">{applications.length} applications</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Injury Reports count */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="h-4 w-4" />
                Injury Reports Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {reports.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">No injury reports.</p>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{reports.length}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{pendingReports.length}</p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{reports.filter(r => r.status === "in-progress").length}</p>
                    <p className="text-xs text-muted-foreground">In Progress</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{reports.filter(r => r.status === "resolved").length}</p>
                    <p className="text-xs text-muted-foreground">Resolved</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pending applications preview */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <ClipboardList className="h-4 w-4" />
                Pending Adoption Applications
                {pendingApps.length > 0 && <Badge variant="destructive" className="text-xs">{pendingApps.length}</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {pendingApps.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">No pending applications.</p>
              ) : pendingApps.slice(0, 4).map(a => (
                <div key={a.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">{a.fullName}</p>
                    <p className="text-xs text-muted-foreground">{a.email} - {a.phone}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="default" disabled={updatingId === a.id} onClick={() => updateApplication(a.id, "approved")}>
                      {updatingId === a.id ? <Spinner className="h-3 w-3" /> : <CheckCircle className="h-3.5 w-3.5" />}Accept
                    </Button>
                    <Button size="sm" variant="outline" disabled={updatingId === a.id} onClick={() => updateApplication(a.id, "rejected")}>
                      {updatingId === a.id ? <Spinner className="h-3 w-3" /> : <XCircle className="h-3.5 w-3.5" />}Reject
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* -- ADOPTION APPLICATIONS -- */}
        <TabsContent value="applications" className="space-y-4 pt-4">
          <h2 className="text-xl font-semibold">Adoption Applications</h2>
          {applications.length === 0 ? (
            <Card><CardContent className="py-12 text-center text-sm text-muted-foreground">No adoption applications yet.</CardContent></Card>
          ) : (
            <div className="space-y-3">
              {applications.map(a => (
                <Card key={a.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold">{a.fullName}</p>
                          <Badge variant="outline">{a.status}</Badge>
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{a.email}</span>
                          <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{a.phone}</span>
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{a.address}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(a.createdAt).toLocaleDateString("en-IN")}</span>
                        </div>
                      </div>
                      {a.status === "pending" && (
                        <div className="flex shrink-0 gap-2">
                          <Button size="sm" disabled={updatingId === a.id} onClick={() => updateApplication(a.id, "approved")}>
                            {updatingId === a.id ? <Spinner className="h-3 w-3" /> : <CheckCircle className="h-3.5 w-3.5" />}Accept
                          </Button>
                          <Button size="sm" variant="outline" disabled={updatingId === a.id} onClick={() => updateApplication(a.id, "rejected")}>
                            {updatingId === a.id ? <Spinner className="h-3 w-3" /> : <XCircle className="h-3.5 w-3.5" />}Reject
                          </Button>
                        </div>
                      )}
                      {a.status !== "pending" && (
                        <span className="text-xs text-muted-foreground italic shrink-0">
                          {a.status === "approved" ? "Accepted" : "Rejected"}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* -- INJURY REPORTS -- */}
        <TabsContent value="reports" className="space-y-4 pt-4">
          <h2 className="text-xl font-semibold">Injury Reports</h2>
          {reports.length === 0 ? (
            <Card><CardContent className="py-12 text-center text-sm text-muted-foreground">No injury reports yet.</CardContent></Card>
          ) : (
            <div className="space-y-3">
              {reports.map(r => (
                <Card key={r._id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold capitalize">{r.animalType}</p>
                          <Badge variant="outline">{r.urgency}</Badge>
                          <Badge variant={r.status === "pending" ? "secondary" : "outline"}>{r.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{r.description}</p>
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{r.location}</span>
                          <span className="flex items-center gap-1"><User className="h-3 w-3" />{r.reporterName}</span>
                          <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{r.reporterPhone}</span>
                          <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{r.reporterEmail}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(r.createdAt).toLocaleDateString("en-IN")}</span>
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-wrap gap-2 sm:flex-col sm:items-end">
                        {r.status === "pending" && (
                          <>
                            <Button size="sm" disabled={updatingId === r._id} onClick={() => updateReport(r._id, "in-progress")}>
                              {updatingId === r._id ? <Spinner className="h-3 w-3" /> : <CheckCircle className="h-3.5 w-3.5" />}Accept
                            </Button>
                            <Button size="sm" variant="outline" disabled={updatingId === r._id} onClick={() => updateReport(r._id, "unable-to-help")}>
                              {updatingId === r._id ? <Spinner className="h-3 w-3" /> : <XCircle className="h-3.5 w-3.5" />}Reject
                            </Button>
                          </>
                        )}
                        {r.status === "in-progress" && (
                          <Button size="sm" disabled={updatingId === r._id} onClick={() => updateReport(r._id, "resolved")}>
                            {updatingId === r._id ? <Spinner className="h-3 w-3" /> : <CheckCircle className="h-3.5 w-3.5" />}Mark Resolved
                          </Button>
                        )}
                        {(r.status === "resolved" || r.status === "unable-to-help") && (
                          <span className="text-xs text-muted-foreground italic">
                            {r.status === "resolved" ? "Resolved" : "Unable to help"}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* -- PETS -- */}
        <TabsContent value="pets" className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Pet Management</h2>
            <Dialog open={petDialogOpen} onOpenChange={setPetDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" onClick={() => setSelectedPet(null)}><Plus className="h-4 w-4 mr-1.5" />Add Pet</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader><DialogTitle>{selectedPet ? "Edit Pet" : "Add New Pet"}</DialogTitle></DialogHeader>
                <PetForm pet={selectedPet} onSaved={() => { setPetDialogOpen(false); setSelectedPet(null); fetchPets() }} />
              </DialogContent>
            </Dialog>
          </div>
          {pets.length === 0 ? (
            <Card><CardContent className="py-12 text-center text-sm text-muted-foreground">No pets yet.</CardContent></Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pets.map(pet => (
                <Card key={pet.id} className="overflow-hidden">
                  {pet.image_url && <img src={pet.image_url} alt={pet.name} className="h-36 w-full object-cover" onError={e => (e.target as HTMLImageElement).style.display = "none"} />}
                  <CardHeader className="pb-2 pt-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-base">{pet.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">{pet.breed} - {pet.species}</p>
                      </div>
                      <Badge variant={pet.status === "available" ? "default" : "secondary"} className="capitalize shrink-0">{pet.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3 text-xs text-muted-foreground space-y-0.5">
                    <p><strong>Age:</strong> {pet.age} {pet.age_unit} - <strong>Gender:</strong> {pet.gender}</p>
                    <p><strong>Location:</strong> {pet.location}</p>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="outline" className="h-7 flex-1 text-xs gap-1" onClick={() => { setSelectedPet(pet); setPetDialogOpen(true) }}><Edit className="h-3.5 w-3.5" />Edit</Button>
                      <Button size="sm" variant="destructive" className="h-7 flex-1 text-xs gap-1" onClick={() => deletePet(pet.id)}><Trash2 className="h-3.5 w-3.5" />Delete</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* -- VETS -- */}
        <TabsContent value="vets" className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Vet Management</h2>
            <Dialog open={vetDialogOpen} onOpenChange={setVetDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" onClick={() => setSelectedVet(null)}><Plus className="h-4 w-4 mr-1.5" />Add Vet</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader><DialogTitle>{selectedVet ? "Edit Vet" : "Add New Vet"}</DialogTitle></DialogHeader>
                <VetForm vet={selectedVet} onSaved={() => { setVetDialogOpen(false); setSelectedVet(null); fetchVets() }} />
              </DialogContent>
            </Dialog>
          </div>
          {vets.length === 0 ? (
            <Card><CardContent className="py-12 text-center text-sm text-muted-foreground">No vets yet.</CardContent></Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {vets.map(vet => (
                <Card key={vet._id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-base">{vet.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">{vet.phone}</p>
                      </div>
                      <Badge variant={vet.isOpen ? "default" : "secondary"} className="shrink-0">{vet.isOpen ? "Open" : "Closed"}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3 text-xs text-muted-foreground space-y-0.5">
                    <p><strong>Address:</strong> {vet.address}</p>
                    <p><strong>Rating:</strong> {vet.rating} ({vet.reviewCount} reviews)</p>
                    <p><strong>Hours:</strong> {vet.hours}</p>
                    {vet.services?.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {vet.services.slice(0, 3).map(s => <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>)}
                        {vet.services.length > 3 && <Badge variant="outline" className="text-[10px]">+{vet.services.length - 3}</Badge>}
                      </div>
                    )}
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="outline" className="h-7 flex-1 text-xs gap-1" onClick={() => { setSelectedVet(vet); setVetDialogOpen(true) }}><Edit className="h-3.5 w-3.5" />Edit</Button>
                      <Button size="sm" variant="destructive" className="h-7 flex-1 text-xs gap-1" onClick={() => deleteVet(vet._id)}><Trash2 className="h-3.5 w-3.5" />Delete</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* -- USERS -- */}
        <TabsContent value="users" className="pt-4">
          <UserManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}

