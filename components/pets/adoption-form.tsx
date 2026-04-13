"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { backendRequest } from "@/lib/backend"
import { Spinner } from "@/components/ui/spinner"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

interface User {
  id: string
  email?: string
}

interface AdoptionFormProps {
  petId: string
  petName: string
  user: User | null
  onSuccess: () => void
}

export function AdoptionForm({ petId, petName, user, onSuccess }: AdoptionFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: user?.email || "",
    phone: "",
    address: "",
    housingType: "house",
    hasYard: false,
    hasOtherPets: false,
    otherPetsDetails: "",
    experience: "",
    whyAdopt: "",
  })

  if (!user) {
    return (
      <div className="py-8 text-center">
        <p className="mb-4 text-muted-foreground">
          Please sign in to submit an adoption application.
        </p>
        <Button asChild>
          <Link href="/auth/login">Sign In</Link>
        </Button>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="py-8 text-center">
        <CheckCircle className="mx-auto mb-4 h-16 w-16 text-accent" />
        <h3 className="mb-2 text-xl font-semibold">Application Submitted!</h3>
        <p className="text-muted-foreground">
          Thank you for applying to adopt {petName}. We will review your application
          and contact you within 2-3 business days.
        </p>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await backendRequest("/api/adoption-applications", {
        method: "POST",
        body: JSON.stringify({
          petId,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          housingType: formData.housingType,
          hasYard: formData.hasYard,
          hasOtherPets: formData.hasOtherPets,
          otherPetsDetails: formData.otherPetsDetails,
          experience: formData.experience,
          whyAdopt: formData.whyAdopt,
        }),
      })

      setIsSuccess(true)
      onSuccess()
    } catch (error) {
      console.error("Error submitting application:", error)
      alert("Failed to submit application. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Housing Type</Label>
          <RadioGroup
            value={formData.housingType}
            onValueChange={(value) => setFormData({ ...formData, housingType: value })}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="house" id="house" />
              <Label htmlFor="house" className="font-normal">House</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="apartment" id="apartment" />
              <Label htmlFor="apartment" className="font-normal">Apartment</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address *</Label>
        <Input
          id="address"
          required
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="hasYard"
            checked={formData.hasYard}
            onCheckedChange={(checked) => setFormData({ ...formData, hasYard: checked as boolean })}
          />
          <Label htmlFor="hasYard" className="font-normal">
            I have a yard or outdoor space
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="hasOtherPets"
            checked={formData.hasOtherPets}
            onCheckedChange={(checked) => setFormData({ ...formData, hasOtherPets: checked as boolean })}
          />
          <Label htmlFor="hasOtherPets" className="font-normal">
            I have other pets at home
          </Label>
        </div>

        {formData.hasOtherPets && (
          <div className="ml-6 space-y-2">
            <Label htmlFor="otherPetsDetails">Please describe your other pets</Label>
            <Input
              id="otherPetsDetails"
              value={formData.otherPetsDetails}
              onChange={(e) => setFormData({ ...formData, otherPetsDetails: e.target.value })}
              placeholder="e.g., 2 cats, 1 dog"
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="experience">Pet Care Experience</Label>
        <Textarea
          id="experience"
          value={formData.experience}
          onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
          placeholder="Tell us about your experience with pets..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="whyAdopt">Why do you want to adopt {petName}? *</Label>
        <Textarea
          id="whyAdopt"
          required
          value={formData.whyAdopt}
          onChange={(e) => setFormData({ ...formData, whyAdopt: e.target.value })}
          placeholder="Tell us why you'd be a great match..."
          rows={4}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Spinner className="mr-2 h-4 w-4" />
            Submitting...
          </>
        ) : (
          "Submit Application"
        )}
      </Button>
    </form>
  )
}
