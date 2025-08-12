"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Calendar, Clock, MapPin, TrendingUp, Activity, Star } from "lucide-react"
import { format, isAfter, isBefore } from "date-fns"
import Link from "next/link"

interface Booking {
  id: number
  venueId: number
  venueName: string
  courtId: number
  courtName: string
  sport: string
  date: string
  timeSlots: string[]
  totalAmount: number
  status: "confirmed" | "cancelled" | "completed"
  userId: string
}

export default function UserDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    if (user.role !== "user") {
      // Redirect to appropriate dashboard based on role
      if (user.role === "owner") {
        router.push("/owner/dashboard")
      } else if (user.role === "admin") {
        router.push("/admin/dashboard")
      }
      return
    }

    // Load bookings from localStorage
    const savedBookings = JSON.parse(localStorage.getItem("quickcourt_bookings") || "[]")
    const userBookings = savedBookings.filter((booking: Booking) => booking.userId === user.id)
    setBookings(userBookings)
  }, [user, router])

  if (!user || user.role !== "user") {
    return null
  }

  const today = new Date()
  const upcomingBookings = bookings.filter(
    (booking) => booking.status === "confirmed" && isAfter(new Date(booking.date), today),
  )
  const recentBookings = bookings
    .filter((booking) => isBefore(new Date(booking.date), today))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)

  const totalBookings = bookings.length
  const totalSpent = bookings
    .filter((booking) => booking.status !== "cancelled")
    .reduce((sum, booking) => sum + booking.totalAmount, 0)
  const favoriteVenues = bookings.reduce(
    (acc, booking) => {
      acc[booking.venueName] = (acc[booking.venueName] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )
  const topVenue = Object.entries(favoriteVenues).sort(([, a], [, b]) => b - a)[0]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-display">
            Welcome back, {user.fullName.split(" ")[0]}!
          </h1>
          <p className="text-gray-600">Here's your sports booking overview</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Upcoming</p>
                  <p className="text-2xl font-bold text-gray-900">{upcomingBookings.length}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">₹{totalSpent.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Favorite Venue</p>
                  <p className="text-sm font-bold text-gray-900 truncate">{topVenue ? topVenue[0] : "None yet"}</p>
                  {topVenue && <p className="text-xs text-gray-500">{topVenue[1]} visits</p>}
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Star className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upcoming Bookings */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Upcoming Bookings</CardTitle>
                <Link href="/bookings">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {upcomingBookings.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No upcoming bookings</p>
                  <Link href="/venues">
                    <Button size="sm">Book a Court</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingBookings.slice(0, 3).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{booking.venueName}</h4>
                        <p className="text-sm text-gray-600">
                          {booking.courtName} - {booking.sport}
                        </p>
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{format(new Date(booking.date), "MMM dd, yyyy")}</span>
                          <Clock className="h-4 w-4 ml-3 mr-1" />
                          <span>{booking.timeSlots[0]}</span>
                          {booking.timeSlots.length > 1 && <span> +{booking.timeSlots.length - 1} more</span>}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="default" className="mb-2">
                          {booking.status}
                        </Badge>
                        <p className="text-sm font-semibold text-green-600">₹{booking.totalAmount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {recentBookings.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No recent activity</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{booking.venueName}</h4>
                        <p className="text-sm text-gray-600">
                          {booking.courtName} - {booking.sport}
                        </p>
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{format(new Date(booking.date), "MMM dd, yyyy")}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={booking.status === "completed" ? "secondary" : "destructive"}
                          className="mb-2 capitalize"
                        >
                          {booking.status}
                        </Badge>
                        <p className="text-sm font-semibold text-green-600">₹{booking.totalAmount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/venues">
                <Button className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                  <MapPin className="h-6 w-6" />
                  <span>Find Venues</span>
                </Button>
              </Link>
              <Link href="/bookings">
                <Button
                  variant="outline"
                  className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                >
                  <Calendar className="h-6 w-6" />
                  <span>My Bookings</span>
                </Button>
              </Link>
              <Link href="/profile">
                <Button
                  variant="outline"
                  className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                >
                  <Activity className="h-6 w-6" />
                  <span>Profile Settings</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
