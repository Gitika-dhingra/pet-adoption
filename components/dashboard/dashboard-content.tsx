"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Empty } from "@/components/ui/empty"
import { 
  FileText, 
  Heart, 
  AlertTriangle, 
  MapPin, 
  Clock,
  PawPrint,
} from "lucide-react"
import Link from "next/link"

interface User {
  id: string
  email: string
  fullName?: string
  role?: string
}

interface DashboardContentProps {
  user: User
  applications: Array<{
    id: string
    status: string
    created_at: string
    pets: {
      id: string
      name: string
      species: string
      breed: string
      image_url: string
    } | null
  }>
  favorites: Array<{
    id: string
    created_at: string
    pets: {
      id: string
      name: string
      species: string
      breed: string
      image_url: string
      location: string
    } | null
  }>
  reports: Array<{
    id: string
    animal_type: string
    description: string
    location: string
    urgency: string
    status: string
    created_at: string
  }>
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-600",
  approved: "bg-accent/10 text-accent",
  rejected: "bg-destructive/10 text-destructive",
  reviewing: "bg-blue-500/10 text-blue-600",
  resolved: "bg-accent/10 text-accent",
}

export function DashboardContent({ user, applications, favorites, reports }: DashboardContentProps) {
  const [activeTab, setActiveTab] = useState("applications")

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary text-2xl text-primary-foreground">
              {user.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">Welcome back!</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <Button asChild>
          <Link href="/pets">
            <PawPrint className="mr-2 h-4 w-4" />
            Find a Pet
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card className="border-border/50">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{applications.length}</p>
              <p className="text-sm text-muted-foreground">Applications</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
              <Heart className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{favorites.length}</p>
              <p className="text-sm text-muted-foreground">Favorites</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
              <AlertTriangle className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{reports.length}</p>
              <p className="text-sm text-muted-foreground">Reports</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="applications" className="gap-2">
            <FileText className="h-4 w-4" />
            Applications
          </TabsTrigger>
          <TabsTrigger value="favorites" className="gap-2">
            <Heart className="h-4 w-4" />
            Favorites
          </TabsTrigger>
          <TabsTrigger value="reports" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            Reports
          </TabsTrigger>
        </TabsList>

        {/* Applications Tab */}
        <TabsContent value="applications">
          {applications.length === 0 ? (
            <Empty
              icon={FileText}
              title="No applications yet"
              description="Start your adoption journey by browsing available pets."
            >
              <Button asChild className="mt-4">
                <Link href="/pets">Browse Pets</Link>
              </Button>
            </Empty>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {applications.map((app) => (
                <Card key={app.id} className="border-border/50">
                  <CardContent className="flex gap-4 p-4">
                    {app.pets && (
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                        <img
                          src={app.pets.image_url}
                          alt={app.pets.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col">
                      <div className="mb-1 flex items-center justify-between">
                        <h3 className="font-semibold">{app.pets?.name || "Unknown Pet"}</h3>
                        <Badge className={statusColors[app.status] || ""} variant="outline">
                          {app.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {app.pets?.breed} • {app.pets?.species}
                      </p>
                      <div className="mt-auto flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        Applied {formatDate(app.created_at)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Favorites Tab */}
        <TabsContent value="favorites">
          {favorites.length === 0 ? (
            <Empty
              icon={Heart}
              title="No favorites yet"
              description="Save pets you love to easily find them later."
            >
              <Button asChild className="mt-4">
                <Link href="/pets">Browse Pets</Link>
              </Button>
            </Empty>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {favorites.map((fav) => (
                <Link key={fav.id} href={`/pets/${fav.pets?.id}`}>
                  <Card className="group border-border/50 transition-all hover:shadow-lg">
                    {fav.pets && (
                      <>
                        <div className="aspect-square overflow-hidden">
                          <img
                            src={fav.pets.image_url}
                            alt={fav.pets.name}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold">{fav.pets.name}</h3>
                          <p className="text-sm text-muted-foreground">{fav.pets.breed}</p>
                          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {fav.pets.location}
                          </div>
                        </CardContent>
                      </>
                    )}
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports">
          {reports.length === 0 ? (
            <Empty
              icon={AlertTriangle}
              title="No reports yet"
              description="Thank you for caring about animals. Report any injured animals you encounter."
            >
              <Button asChild className="mt-4">
                <Link href="/report">Report an Animal</Link>
              </Button>
            </Empty>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <Card key={report.id} className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <Badge variant="outline" className="capitalize">
                            {report.animal_type}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={statusColors[report.status] || ""}
                          >
                            {report.status}
                          </Badge>
                          <Badge 
                            variant="outline"
                            className={
                              report.urgency === "critical" 
                                ? "bg-destructive/10 text-destructive"
                                : report.urgency === "high"
                                ? "bg-orange-500/10 text-orange-500"
                                : "bg-muted"
                            }
                          >
                            {report.urgency}
                          </Badge>
                        </div>
                        <p className="mb-2 text-sm">{report.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {report.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(report.created_at)}
                          </span>
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
