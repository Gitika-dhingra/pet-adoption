"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { backendRequest } from "@/lib/backend"
import { Spinner } from "@/components/ui/spinner"
import { CheckCircle, Phone, Mail } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

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
  const { toast } = useToast()
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

  useEffect(() => {
    if (isSuccess) {
      // Auto-close dialog after 3 seconds
      const timer = setTimeout(() => {
        onSuccess()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isSuccess, onSuccess])

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
      <div className="py-12 text-center">
        <div className="mb-6 flex justify-center">
          <CheckCircle className="h-20 w-20 text-green-500 animate-bounce" />
        </div>
        <h3 className="mb-2 text-2xl font-bold">Application Submitted Successfully! 🎉</h3>
        <div className="mb-6 space-y-3 text-muted-foreground">
          <p>Thank you for applying to adopt <span className="font-semibold text-foreground">{petName}</span>!</p>
          <p>We will review your application and contact you within <span className="font-semibold">2-3 business days</span>.</p>
        </div>
        <div className="space-y-2 rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
            For urgent inquiries, feel free to reach out:
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-center gap-2 text-sm text-blue-800 dark:text-blue-200">
              <Phone className="h-4 w-4" />
              <span>+91-XXXX-XXXX-XX</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-blue-800 dark:text-blue-200">
              <Mail className="h-4 w-4" />
              <span>support@pawfinder.com</span>
            </div>
          </div>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Dialog will close automatically in a few seconds...
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

      // Show success toast
      toast({
        title: "✅ Application Submitted!",
        description: `Your application for ${petName} has been submitted successfully. We'll contact you within 2-3 business days.`,
        duration: 5000,
      })

      setIsSuccess(true)
    } catch (error) {
      console.error("Error submitting application:", error)
      toast({
        title: "❌ Submission Failed",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
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
