"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star } from "lucide-react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"

export default function HomePage() {
  const { user } = useAuth()

  const popularVenues = [
    {
      id: 1,
      name: "SportZone Arena",
      sports: ["Badminton", "Tennis"],
      price: 500,
      location: "Sector 18, Noida",
      rating: 4.5,
      image: "/modern-sports-arena.png",
    },
    {
      id: 2,
      name: "Green Turf Ground",
      sports: ["Football", "Cricket"],
      price: 800,
      location: "Gurgaon",
      rating: 4.2,
      image: "/green-football-turf.png",
    },
    {
      id: 3,
      name: "Ace Tennis Club",
      sports: ["Tennis", "Squash"],
      price: 600,
      location: "CP, Delhi",
      rating: 4.7,
      image: "/tennis-court-club.png",
    },
  ]

  const popularSports = [
    { name: "Badminton", venues: 45, icon: "🏸" },
    { name: "Football", venues: 32, icon: "⚽" },
    { name: "Tennis", venues: 28, icon: "🎾" },
    { name: "Cricket", venues: 25, icon: "🏏" },
    { name: "Basketball", venues: 18, icon: "🏀" },
    { name: "Table Tennis", venues: 15, icon: "🏓" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 font-display">Book Your Game, Play Your Way</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover and book local sports facilities. Join matches, meet players, and stay active in your community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/venues">
              <Button size="lg" variant="secondary" className="text-green-700">
                <MapPin className="mr-2 h-5 w-5" />
                Find Venues
              </Button>
            </Link>
            {!user && (
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-green-700 bg-transparent"
                >
                  Get Started
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Popular Sports */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 font-display">Popular Sports</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularSports.map((sport) => (
              <Card key={sport.name} className="text-center hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="text-4xl mb-2">{sport.icon}</div>
                  <h3 className="font-semibold mb-1">{sport.name}</h3>
                  <p className="text-sm text-gray-600">{sport.venues} venues</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Venues */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold font-display">Popular Venues</h2>
            <Link href="/venues">
              <Button variant="outline">View All</Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularVenues.map((venue) => (
              <Card key={venue.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative">
                  <img
                    src={venue.image || "/placeholder.svg"}
                    alt={venue.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{venue.name}</h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="text-sm">{venue.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{venue.location}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {venue.sports.map((sport) => (
                      <Badge key={sport} variant="secondary" className="text-xs">
                        {sport}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-lg font-semibold text-green-600">₹{venue.price}/hr</div>
                    <Link href={`/venues/${venue.id}`}>
                      <Button size="sm">Book Now</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 font-display">Ready to Play?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of sports enthusiasts who trust QuickCourt for their game bookings.
          </p>
          {!user ? (
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary" className="text-green-700">
                Sign Up Now
              </Button>
            </Link>
          ) : (
            <Link href="/venues">
              <Button size="lg" variant="secondary" className="text-green-700">
                Book Your Next Game
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}
