"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Star, Users } from "lucide-react"
import Link from "next/link"

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

interface VenueCardProps {
  venue: Venue
  viewMode: "grid" | "list"
}

export function VenueCard({ venue, viewMode }: VenueCardProps) {
  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="flex">
          <div className="w-48 h-32 flex-shrink-0">
            <img src={venue.image || "/placeholder.svg"} alt={venue.name} className="w-full h-full object-cover" />
          </div>
          <CardContent className="flex-1 p-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg mb-1">{venue.name}</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{venue.location}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center mb-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="text-sm font-medium">{venue.rating}</span>
                  <span className="text-xs text-gray-500 ml-1">({venue.reviewCount})</span>
                </div>
                <div className="text-lg font-semibold text-green-600">₹{venue.pricePerHour}/hr</div>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-3">{venue.description}</p>

            <div className="flex flex-wrap gap-1 mb-4">
              {venue.sports.map((sport) => (
                <Badge key={sport} variant="secondary" className="text-xs">
                  {sport}
                </Badge>
              ))}
              <Badge variant="outline" className="text-xs">
                {venue.venueType}
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm text-gray-500">
                <Users className="h-4 w-4 mr-1" />
                <span>{venue.amenities.length} amenities</span>
              </div>
              <Link href={`/venues/${venue.id}`}>
                <Button size="sm">View Details</Button>
              </Link>
            </div>
          </CardContent>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video relative">
        <img src={venue.image || "/placeholder.svg"} alt={venue.name} className="w-full h-full object-cover" />
        <Badge className="absolute top-2 right-2" variant="secondary">
          {venue.venueType}
        </Badge>
      </div>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{venue.name}</h3>
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="text-sm font-medium">{venue.rating}</span>
            <span className="text-xs text-gray-500 ml-1">({venue.reviewCount})</span>
          </div>
        </div>

        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{venue.location}</span>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{venue.description}</p>

        <div className="flex flex-wrap gap-1 mb-4">
          {venue.sports.map((sport) => (
            <Badge key={sport} variant="secondary" className="text-xs">
              {sport}
            </Badge>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold text-green-600">₹{venue.pricePerHour}/hr</div>
          <Link href={`/venues/${venue.id}`}>
            <Button size="sm">Book Now</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
