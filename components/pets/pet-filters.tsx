"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { RotateCcw } from "lucide-react"
import { useState, useCallback, useTransition } from "react"

const species = [
  { value: "all", label: "All Pets" },
  { value: "dog", label: "Dogs" },
  { value: "cat", label: "Cats" },
  { value: "bird", label: "Birds" },
  { value: "rabbit", label: "Rabbits" },
  { value: "other", label: "Other" },
]

const sizes = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
]

const genders = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
]

export function PetFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [selectedSpecies, setSelectedSpecies] = useState(searchParams.get("species") || "all")
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    searchParams.get("size")?.split(",").filter(Boolean) || []
  )
  const [selectedGenders, setSelectedGenders] = useState<string[]>(
    searchParams.get("gender")?.split(",").filter(Boolean) || []
  )
  const [ageRange, setAgeRange] = useState([
    Number(searchParams.get("minAge")) || 0,
    Number(searchParams.get("maxAge")) || 15,
  ])

  const updateFilters = useCallback(() => {
    const params = new URLSearchParams()
    
    if (selectedSpecies !== "all") params.set("species", selectedSpecies)
    if (selectedSizes.length > 0) params.set("size", selectedSizes.join(","))
    if (selectedGenders.length > 0) params.set("gender", selectedGenders.join(","))
    if (ageRange[0] > 0) params.set("minAge", ageRange[0].toString())
    if (ageRange[1] < 15) params.set("maxAge", ageRange[1].toString())

    startTransition(() => {
      router.push(`/pets?${params.toString()}`)
    })
  }, [selectedSpecies, selectedSizes, selectedGenders, ageRange, router])

  const resetFilters = () => {
    setSelectedSpecies("all")
    setSelectedSizes([])
    setSelectedGenders([])
    setAgeRange([0, 15])
    startTransition(() => {
      router.push("/pets")
    })
  }

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    )
  }

  const toggleGender = (gender: string) => {
    setSelectedGenders((prev) =>
      prev.includes(gender) ? prev.filter((g) => g !== gender) : [...prev, gender]
    )
  }

  return (
    <Card className="sticky top-20 border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg">Filters</CardTitle>
        <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 gap-1 px-2 text-muted-foreground">
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Species */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Species</Label>
          <RadioGroup value={selectedSpecies} onValueChange={setSelectedSpecies}>
            {species.map((item) => (
              <div key={item.value} className="flex items-center space-x-2">
                <RadioGroupItem value={item.value} id={`species-${item.value}`} />
                <Label htmlFor={`species-${item.value}`} className="cursor-pointer font-normal">
                  {item.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Size */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Size</Label>
          <div className="space-y-2">
            {sizes.map((size) => (
              <div key={size.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`size-${size.value}`}
                  checked={selectedSizes.includes(size.value)}
                  onCheckedChange={() => toggleSize(size.value)}
                />
                <Label htmlFor={`size-${size.value}`} className="cursor-pointer font-normal">
                  {size.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Gender */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Gender</Label>
          <div className="space-y-2">
            {genders.map((gender) => (
              <div key={gender.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`gender-${gender.value}`}
                  checked={selectedGenders.includes(gender.value)}
                  onCheckedChange={() => toggleGender(gender.value)}
                />
                <Label htmlFor={`gender-${gender.value}`} className="cursor-pointer font-normal">
                  {gender.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Age Range */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Age (years)</Label>
            <span className="text-sm text-muted-foreground">
              {ageRange[0]} - {ageRange[1]}+
            </span>
          </div>
          <Slider
            value={ageRange}
            onValueChange={setAgeRange}
            min={0}
            max={15}
            step={1}
            className="py-2"
          />
        </div>

        <Button onClick={updateFilters} className="w-full" disabled={isPending}>
          {isPending ? "Applying..." : "Apply Filters"}
        </Button>
      </CardContent>
    </Card>
  )
}
