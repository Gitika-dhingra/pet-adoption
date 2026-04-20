"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { backendUrl } from "@/lib/backend"

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
}

interface PetFormProps {
  pet?: Pet | null
  onSaved: () => void
}

export function PetForm({ pet, onSaved }: PetFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    age_unit: 'years',
    gender: '',
    size: '',
    image_url: '',
    location: '',
    status: 'available',
    description: '',
    is_vaccinated: false,
    is_neutered: false,
    is_housetrained: false,
    good_with_kids: false,
    good_with_dogs: false,
    good_with_cats: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (pet) {
      setFormData({
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        age: pet.age.toString(),
        age_unit: pet.age_unit,
        gender: pet.gender,
        size: pet.size,
        image_url: pet.image_url,
        location: pet.location,
        status: pet.status,
        description: pet.description,
        is_vaccinated: pet.is_vaccinated,
        is_neutered: pet.is_neutered,
        is_housetrained: pet.is_housetrained,
        good_with_kids: pet.good_with_kids,
        good_with_dogs: pet.good_with_dogs,
        good_with_cats: pet.good_with_cats,
      })
    }
  }, [pet])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const token = localStorage.getItem('token')
      const url = pet
        ? `${backendUrl}/api/pets/${pet.id}`
        : `${backendUrl}/api/pets`

      const response = await fetch(url, {
        method: pet ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age),
        })
      })

      if (response.ok) {
        onSaved()
      }
    } catch (error) {
      console.error('Error saving pet:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="species">Species *</Label>
          <Select value={formData.species} onValueChange={(value) => handleChange('species', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select species" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dog">Dog</SelectItem>
              <SelectItem value="cat">Cat</SelectItem>
              <SelectItem value="bird">Bird</SelectItem>
              <SelectItem value="rabbit">Rabbit</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="breed">Breed *</Label>
          <Input
            id="breed"
            value={formData.breed}
            onChange={(e) => handleChange('breed', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="gender">Gender *</Label>
          <Select value={formData.gender} onValueChange={(value) => handleChange('gender', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="age">Age *</Label>
          <Input
            id="age"
            type="number"
            value={formData.age}
            onChange={(e) => handleChange('age', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="age_unit">Age Unit *</Label>
          <Select value={formData.age_unit} onValueChange={(value) => handleChange('age_unit', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="months">Months</SelectItem>
              <SelectItem value="years">Years</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="size">Size *</Label>
          <Select value={formData.size} onValueChange={(value) => handleChange('size', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="image_url">Image URL *</Label>
        <Input
          id="image_url"
          value={formData.image_url}
          onChange={(e) => handleChange('image_url', e.target.value)}
          placeholder="https://example.com/image.jpg"
          required
        />
      </div>

      <div>
        <Label htmlFor="location">Location *</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder="City, State"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={3}
          required
        />
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="adopted">Adopted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>Characteristics</Label>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_vaccinated"
              checked={formData.is_vaccinated}
              onCheckedChange={(checked) => handleChange('is_vaccinated', checked)}
            />
            <Label htmlFor="is_vaccinated">Vaccinated</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_neutered"
              checked={formData.is_neutered}
              onCheckedChange={(checked) => handleChange('is_neutered', checked)}
            />
            <Label htmlFor="is_neutered">Neutered/Spayed</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_housetrained"
              checked={formData.is_housetrained}
              onCheckedChange={(checked) => handleChange('is_housetrained', checked)}
            />
            <Label htmlFor="is_housetrained">House Trained</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="good_with_kids"
              checked={formData.good_with_kids}
              onCheckedChange={(checked) => handleChange('good_with_kids', checked)}
            />
            <Label htmlFor="good_with_kids">Good with Kids</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="good_with_dogs"
              checked={formData.good_with_dogs}
              onCheckedChange={(checked) => handleChange('good_with_dogs', checked)}
            />
            <Label htmlFor="good_with_dogs">Good with Dogs</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="good_with_cats"
              checked={formData.good_with_cats}
              onCheckedChange={(checked) => handleChange('good_with_cats', checked)}
            />
            <Label htmlFor="good_with_cats">Good with Cats</Label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : (pet ? 'Update Pet' : 'Add Pet')}
        </Button>
      </div>
    </form>
  )
}