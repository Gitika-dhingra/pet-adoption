"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { backendRequest } from "@/lib/backend"
import { Spinner } from "@/components/ui/spinner"
import { 
  CheckCircle, 
  MapPin, 
  Upload, 
  AlertTriangle,
  Camera,
  Phone
} from "lucide-react"
import Link from "next/link"

const animalTypes = [
  { value: "dog", label: "Dog" },
  { value: "cat", label: "Cat" },
  { value: "bird", label: "Bird" },
  { value: "wildlife", label: "Wildlife" },
  { value: "other", label: "Other" },
]

const urgencyLevels = [
  { value: "critical", label: "Critical - Life threatening", color: "text-destructive" },
  { value: "high", label: "High - Serious injury", color: "text-orange-500" },
  { value: "medium", label: "Medium - Needs attention", color: "text-yellow-500" },
  { value: "low", label: "Low - Minor injury", color: "text-accent" },
]

interface User {
  id: string
  email?: string
}

export function ReportForm() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    animalType: "dog",
    description: "",
    location: "",
    latitude: null as number | null,
    longitude: null as number | null,
    urgency: "medium",
    reporterName: "",
    reporterPhone: "",
    reporterEmail: "",
    imageUrl: "",
  })

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await backendRequest("/api/auth/me")
        setUser(data.user)
        if (data.user?.email) {
          setFormData((prev) => ({ ...prev, reporterEmail: data.user.email }))
        }
      } catch {
        setUser(null)
      }
    }

    fetchUser()
  }, [])

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser")
      return
    }

    setIsGettingLocation(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setFormData((prev) => ({
          ...prev,
          latitude,
          longitude,
        }))

        // Try to get address from coordinates using reverse geocoding
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          )
          const data = await response.json()
          if (data.display_name) {
            setFormData((prev) => ({ ...prev, location: data.display_name }))
          }
        } catch {
          setFormData((prev) => ({
            ...prev,
            location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          }))
        }
        setIsGettingLocation(false)
      },
      () => {
        alert("Unable to retrieve your location")
        setIsGettingLocation(false)
      }
    )
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
        // In production, you'd upload to storage and set the URL
        setFormData((prev) => ({ ...prev, imageUrl: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await backendRequest("/api/injury-reports", {
        method: "POST",
        body: JSON.stringify({
          animalType: formData.animalType,
          description: formData.description,
          location: formData.location,
          latitude: formData.latitude,
          longitude: formData.longitude,
          urgency: formData.urgency,
          reporterName: formData.reporterName,
          reporterPhone: formData.reporterPhone,
          reporterEmail: formData.reporterEmail,
          imageUrl: formData.imageUrl,
        }),
      })

      setIsSuccess(true)
    } catch (error) {
      console.error("Error submitting report:", error)
      alert("Failed to submit report. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <Card className="border-accent/50">
        <CardContent className="py-12 text-center">
          <CheckCircle className="mx-auto mb-4 h-16 w-16 text-accent" />
          <h2 className="mb-2 text-2xl font-semibold">Report Submitted</h2>
          <p className="mb-6 text-muted-foreground">
            Thank you for reporting this injured animal. Our rescue team has been notified
            and will respond as soon as possible.
          </p>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              If this is an emergency, please also contact local animal control:
            </p>
            <Button variant="outline" className="gap-2" asChild>
              <a href="tel:911">
                <Phone className="h-4 w-4" />
                Call Emergency Services
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Report Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Animal Type */}
          <div className="space-y-3">
            <Label>Type of Animal *</Label>
            <RadioGroup
              value={formData.animalType}
              onValueChange={(value) => setFormData({ ...formData, animalType: value })}
              className="flex flex-wrap gap-4"
            >
              {animalTypes.map((type) => (
                <div key={type.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={type.value} id={`animal-${type.value}`} />
                  <Label htmlFor={`animal-${type.value}`} className="cursor-pointer font-normal">
                    {type.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Urgency */}
          <div className="space-y-3">
            <Label>Urgency Level *</Label>
            <RadioGroup
              value={formData.urgency}
              onValueChange={(value) => setFormData({ ...formData, urgency: value })}
              className="space-y-2"
            >
              {urgencyLevels.map((level) => (
                <div key={level.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={level.value} id={`urgency-${level.value}`} />
                  <Label 
                    htmlFor={`urgency-${level.value}`} 
                    className={`cursor-pointer font-normal ${level.color}`}
                  >
                    {level.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description of Injury/Situation *</Label>
            <Textarea
              id="description"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the animal's condition, visible injuries, behavior..."
              rows={4}
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <div className="flex gap-2">
              <Input
                id="location"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Address or location description"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
                className="shrink-0 gap-2"
              >
                {isGettingLocation ? (
                  <Spinner className="h-4 w-4" />
                ) : (
                  <MapPin className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">Use My Location</span>
              </Button>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Photo (Optional but helpful)</Label>
            <div className="flex items-center gap-4">
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border bg-secondary/50 px-4 py-3 transition-colors hover:border-primary/50 hover:bg-secondary">
                <Camera className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {imagePreview ? "Change photo" : "Add a photo"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {imagePreview && (
                <div className="relative h-16 w-16 overflow-hidden rounded-lg">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 rounded-lg bg-secondary/30 p-4">
            <h3 className="font-medium">Your Contact Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="reporterName">Your Name *</Label>
                <Input
                  id="reporterName"
                  required
                  value={formData.reporterName}
                  onChange={(e) => setFormData({ ...formData, reporterName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reporterPhone">Phone Number *</Label>
                <Input
                  id="reporterPhone"
                  type="tel"
                  required
                  value={formData.reporterPhone}
                  onChange={(e) => setFormData({ ...formData, reporterPhone: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reporterEmail">Email</Label>
              <Input
                id="reporterEmail"
                type="email"
                value={formData.reporterEmail}
                onChange={(e) => setFormData({ ...formData, reporterEmail: e.target.value })}
              />
            </div>
          </div>

          <Button type="submit" className="w-full gap-2" size="lg" disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner className="h-4 w-4" />
                Submitting Report...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5" />
                Submit Report
              </>
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            For immediate emergencies, please call{" "}
            <a href="tel:911" className="font-medium text-primary hover:underline">
              911
            </a>{" "}
            or your local animal control.
          </p>
        </CardContent>
      </Card>
    </form>
  )
}
