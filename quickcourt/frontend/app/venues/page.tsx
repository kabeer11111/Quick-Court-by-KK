"use client"

import { useState, useMemo } from "react"
import { Navigation } from "@/components/navigation"
import { VenueCard } from "@/components/venue-card"
import { VenueFilters } from "@/components/venue-filters"
import { SearchBar } from "@/components/search-bar"
import { Pagination } from "@/components/pagination"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Filter, Grid, List } from "lucide-react"

interface Venue {
  id: number
  name: string
  sports: string[]
  pricePerHour: number
  location: string
  rating: number
  reviewCount: number
  image: string
  amenities: string[]
  description: string
  venueType: string
}

const mockVenues: Venue[] = [
  {
    id: 1,
    name: "SportZone Arena",
    sports: ["Badminton", "Tennis"],
    pricePerHour: 500,
    location: "Sector 18, Noida",
    rating: 4.5,
    reviewCount: 128,
    image: "/modern-sports-arena.png",
    amenities: ["Parking", "Changing Room", "Water", "Equipment"],
    description: "Premium indoor sports facility with air conditioning",
    venueType: "Indoor",
  },
  {
    id: 2,
    name: "Green Turf Ground",
    sports: ["Football", "Cricket"],
    pricePerHour: 800,
    location: "Gurgaon",
    rating: 4.2,
    reviewCount: 95,
    image: "/green-football-turf.png",
    amenities: ["Parking", "Floodlights", "Changing Room"],
    description: "Well-maintained outdoor turf with professional lighting",
    venueType: "Outdoor",
  },
  {
    id: 3,
    name: "Ace Tennis Club",
    sports: ["Tennis", "Squash"],
    pricePerHour: 600,
    location: "CP, Delhi",
    rating: 4.7,
    reviewCount: 203,
    image: "/tennis-court-club.png",
    amenities: ["Parking", "Pro Shop", "Coaching", "Equipment"],
    description: "Professional tennis club with certified courts",
    venueType: "Indoor",
  },
  {
    id: 4,
    name: "City Basketball Court",
    sports: ["Basketball"],
    pricePerHour: 400,
    location: "Dwarka, Delhi",
    rating: 4.1,
    reviewCount: 67,
    image: "/outdoor-basketball-court.png",
    amenities: ["Parking", "Scoreboard", "Seating"],
    description: "Standard basketball court with wooden flooring",
    venueType: "Indoor",
  },
  {
    id: 5,
    name: "Aqua Swimming Pool",
    sports: ["Swimming"],
    pricePerHour: 300,
    location: "Vasant Kunj, Delhi",
    rating: 4.3,
    reviewCount: 89,
    image: "/outdoor-swimming-pool.png",
    amenities: ["Changing Room", "Lockers", "Towels", "Lifeguard"],
    description: "Olympic size swimming pool with trained lifeguards",
    venueType: "Indoor",
  },
  {
    id: 6,
    name: "Power Gym & Fitness",
    sports: ["Gym", "Fitness"],
    pricePerHour: 200,
    location: "Lajpat Nagar, Delhi",
    rating: 4.0,
    reviewCount: 156,
    image: "/modern-gym.png",
    amenities: ["Equipment", "Trainer", "Locker", "Water"],
    description: "Fully equipped gym with modern fitness equipment",
    venueType: "Indoor",
  },
  {
    id: 7,
    name: "Royal Cricket Ground",
    sports: ["Cricket"],
    pricePerHour: 1000,
    location: "Faridabad",
    rating: 4.6,
    reviewCount: 78,
    image: "/cricket-ground.png",
    amenities: ["Pavilion", "Scoreboard", "Equipment", "Parking"],
    description: "Professional cricket ground with grass pitch",
    venueType: "Outdoor",
  },
  {
    id: 8,
    name: "Shuttle Badminton Center",
    sports: ["Badminton"],
    pricePerHour: 350,
    location: "Janakpuri, Delhi",
    rating: 4.4,
    reviewCount: 112,
    image: "/badminton-court.png",
    amenities: ["AC", "Equipment", "Parking", "Coaching"],
    description: "Air-conditioned badminton courts with wooden flooring",
    venueType: "Indoor",
  },
]

export default function VenuesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSports, setSelectedSports] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000])
  const [selectedVenueTypes, setSelectedVenueTypes] = useState<string[]>([])
  const [minRating, setMinRating] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)

  const itemsPerPage = 6

  // Get unique values for filters
  const allSports = Array.from(new Set(mockVenues.flatMap((venue) => venue.sports)))
  const allVenueTypes = Array.from(new Set(mockVenues.map((venue) => venue.venueType)))

  // Filter venues based on search and filters
  const filteredVenues = useMemo(() => {
    return mockVenues.filter((venue) => {
      const matchesSearch =
        venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.sports.some((sport) => sport.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesSports = selectedSports.length === 0 || selectedSports.some((sport) => venue.sports.includes(sport))

      const matchesPrice = venue.pricePerHour >= priceRange[0] && venue.pricePerHour <= priceRange[1]

      const matchesVenueType = selectedVenueTypes.length === 0 || selectedVenueTypes.includes(venue.venueType)

      const matchesRating = venue.rating >= minRating

      return matchesSearch && matchesSports && matchesPrice && matchesVenueType && matchesRating
    })
  }, [searchQuery, selectedSports, priceRange, selectedVenueTypes, minRating])

  // Paginate results
  const totalPages = Math.ceil(filteredVenues.length / itemsPerPage)
  const paginatedVenues = filteredVenues.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Reset page when filters change
  const handleFiltersChange = () => {
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-display">Sports Venues</h1>
          <p className="text-gray-600">Discover and book the best sports facilities in your area</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80">
            <div className="lg:hidden mb-4">
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="w-full justify-center">
                <Filter className="mr-2 h-4 w-4" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>

            <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
              <VenueFilters
                allSports={allSports}
                allVenueTypes={allVenueTypes}
                selectedSports={selectedSports}
                setSelectedSports={setSelectedSports}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                selectedVenueTypes={selectedVenueTypes}
                setSelectedVenueTypes={setSelectedVenueTypes}
                minRating={minRating}
                setMinRating={setMinRating}
                onFiltersChange={handleFiltersChange}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm text-gray-600">
                Showing {paginatedVenues.length} of {filteredVenues.length} venues
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Venues Grid/List */}
            {paginatedVenues.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-500 text-lg">No venues found matching your criteria</p>
                  <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search terms</p>
                </CardContent>
              </Card>
            ) : (
              <div className={viewMode === "grid" ? "grid md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                {paginatedVenues.map((venue) => (
                  <VenueCard key={venue.id} venue={venue} viewMode={viewMode} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
