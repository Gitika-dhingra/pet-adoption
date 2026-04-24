"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { backendUrl, getAuthToken } from "@/lib/backend"

interface Vet {
  _id?: string
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
  latitude?: number
  longitude?: number
}

interface VetFormProps {
  vet?: Vet | null
  onSaved: () => void
}

export function VetForm({ vet, onSaved }: VetFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Vet>({
    name: "",
    address: "",
    phone: "",
    rating: 0,
    reviewCount: 0,
    distance: "",
    isOpen: true,
    hours: "",
    services: [],
    image: "",
    latitude: undefined,
    longitude: undefined,
  })

  useEffect(() => {
    if (vet) {
      setFormData({ ...vet })
    }
  }, [vet])

  const handleChange = (field: keyof Vet, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleServicesChange = (value: string) => {
    const services = value.split(",").map((s) => s.trim()).filter(Boolean)
    setFormData((prev) => ({ ...prev, services }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const token = getAuthToken()
      const url = vet?._id
        ? `${backendUrl}/api/vets/${vet._id}`
        : `${backendUrl}/api/vets`

      const response = await fetch(url, {
        method: vet?._id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to save vet")
      }

      onSaved()
    } catch (error) {
      console.error("Error saving vet:", error)
      alert("Failed to save vet. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          required
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address *</Label>
        <Input
          id="address"
          required
          value={formData.address}
          onChange={(e) => handleChange("address", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            required
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hours">Hours</Label>
          <Input
            id="hours"
            placeholder="Mon-Fri 9AM-6PM"
            value={formData.hours}
            onChange={(e) => handleChange("hours", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="rating">Rating (0-5)</Label>
          <Input
            id="rating"
            type="number"
            min={0}
            max={5}
            step={0.1}
            value={formData.rating}
            onChange={(e) => handleChange("rating", parseFloat(e.target.value) || 0)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="reviewCount">Review Count</Label>
          <Input
            id="reviewCount"
            type="number"
            min={0}
            value={formData.reviewCount}
            onChange={(e) => handleChange("reviewCount", parseInt(e.target.value) || 0)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="services">Services (comma separated)</Label>
        <Input
          id="services"
          placeholder="Surgery, Vaccination, Dental Care"
          value={formData.services.join(", ")}
          onChange={(e) => handleServicesChange(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Image URL</Label>
        <Input
          id="image"
          placeholder="https://example.com/vet-image.jpg"
          value={formData.image}
          onChange={(e) => handleChange("image", e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isOpen"
          checked={formData.isOpen}
          onChange={(e) => handleChange("isOpen", e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />
        <Label htmlFor="isOpen">Currently Open</Label>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Spinner className="mr-2 h-4 w-4" />
            Saving...
          </>
        ) : (
          vet?._id ? "Update Vet" : "Add Vet"
        )}
      </Button>
    </form>
  )
}

