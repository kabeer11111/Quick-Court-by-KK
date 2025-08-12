"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

interface VenueFiltersProps {
  allSports: string[]
  allVenueTypes: string[]
  selectedSports: string[]
  setSelectedSports: (sports: string[]) => void
  priceRange: [number, number]
  setPriceRange: (range: [number, number]) => void
  selectedVenueTypes: string[]
  setSelectedVenueTypes: (types: string[]) => void
  minRating: number
  setMinRating: (rating: number) => void
  onFiltersChange: () => void
}

export function VenueFilters({
  allSports,
  allVenueTypes,
  selectedSports,
  setSelectedSports,
  priceRange,
  setPriceRange,
  selectedVenueTypes,
  setSelectedVenueTypes,
  minRating,
  setMinRating,
  onFiltersChange,
}: VenueFiltersProps) {
  const handleSportChange = (sport: string, checked: boolean) => {
    const newSports = checked ? [...selectedSports, sport] : selectedSports.filter((s) => s !== sport)
    setSelectedSports(newSports)
    onFiltersChange()
  }

  const handleVenueTypeChange = (type: string, checked: boolean) => {
    const newTypes = checked ? [...selectedVenueTypes, type] : selectedVenueTypes.filter((t) => t !== type)
    setSelectedVenueTypes(newTypes)
    onFiltersChange()
  }

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]])
    onFiltersChange()
  }

  const handleRatingChange = (rating: number) => {
    setMinRating(rating)
    onFiltersChange()
  }

  const clearAllFilters = () => {
    setSelectedSports([])
    setSelectedVenueTypes([])
    setPriceRange([0, 2000])
    setMinRating(0)
    onFiltersChange()
  }

  return (
    <div className="space-y-6">
      {/* Clear Filters */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" onClick={clearAllFilters}>
          Clear All
        </Button>
      </div>

      {/* Sports Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Sports</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {allSports.map((sport) => (
            <div key={sport} className="flex items-center space-x-2">
              <Checkbox
                id={`sport-${sport}`}
                checked={selectedSports.includes(sport)}
                onCheckedChange={(checked) => handleSportChange(sport, checked as boolean)}
              />
              <Label htmlFor={`sport-${sport}`} className="text-sm cursor-pointer">
                {sport}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Price Range Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Price Range (per hour)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Slider
              value={priceRange}
              onValueChange={handlePriceChange}
              max={2000}
              min={0}
              step={50}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>₹{priceRange[0]}</span>
              <span>₹{priceRange[1]}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Venue Type Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Venue Type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {allVenueTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`type-${type}`}
                checked={selectedVenueTypes.includes(type)}
                onCheckedChange={(checked) => handleVenueTypeChange(type, checked as boolean)}
              />
              <Label htmlFor={`type-${type}`} className="text-sm cursor-pointer">
                {type}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Rating Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Minimum Rating</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[4, 3, 2, 1, 0].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${rating}`}
                checked={minRating === rating}
                onCheckedChange={() => handleRatingChange(rating)}
              />
              <Label htmlFor={`rating-${rating}`} className="text-sm cursor-pointer flex items-center">
                {rating > 0 ? (
                  <>
                    {rating}
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 ml-1" />& above
                  </>
                ) : (
                  "Any rating"
                )}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
