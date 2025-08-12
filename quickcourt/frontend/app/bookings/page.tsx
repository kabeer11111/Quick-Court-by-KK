"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Clock, X } from "lucide-react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

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

export default function BookingsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    // Load bookings from localStorage
    const savedBookings = JSON.parse(localStorage.getItem("quickcourt_bookings") || "[]")
    const userBookings = savedBookings.filter((booking: Booking) => booking.userId === user.id)
    setBookings(userBookings)
  }, [user, router])

  const handleCancelBooking = (bookingId: number) => {
    const updatedBookings = bookings.map((booking) =>
      booking.id === bookingId ? { ...booking, status: "cancelled" as const } : booking,
    )
    setBookings(updatedBookings)

    // Update localStorage
    const allBookings = JSON.parse(localStorage.getItem("quickcourt_bookings") || "[]")
    const updatedAllBookings = allBookings.map((booking: Booking) =>
      booking.id === bookingId ? { ...booking, status: "cancelled" } : booking,
    )
    localStorage.setItem("quickcourt_bookings", JSON.stringify(updatedAllBookings))

    toast({
      title: "Booking Cancelled",
      description: "Your booking has been cancelled successfully.",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default"
      case "cancelled":
        return "destructive"
      case "completed":
        return "secondary"
      default:
        return "default"
    }
  }

  const canCancelBooking = (booking: Booking) => {
    const bookingDate = new Date(booking.date)
    const now = new Date()
    const timeDiff = bookingDate.getTime() - now.getTime()
    const hoursDiff = timeDiff / (1000 * 3600)
    return booking.status === "confirmed" && hoursDiff > 2
  }

  const confirmedBookings = bookings.filter((booking) => booking.status === "confirmed")
  const pastBookings = bookings.filter((booking) => booking.status === "completed" || booking.status === "cancelled")

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-display">My Bookings</h1>
          <p className="text-gray-600">Manage your court bookings and view booking history</p>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming Bookings ({confirmedBookings.length})</TabsTrigger>
            <TabsTrigger value="history">Booking History ({pastBookings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-6">
            {confirmedBookings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Upcoming Bookings</h3>
                  <p className="text-gray-600 mb-4">You don't have any confirmed bookings yet.</p>
                  <Button onClick={() => router.push("/venues")}>Browse Venues</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {confirmedBookings.map((booking) => (
                  <Card key={booking.id} className="overflow-hidden">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{booking.venueName}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">
                            {booking.courtName} - {booking.sport}
                          </p>
                        </div>
                        <Badge variant={getStatusColor(booking.status)} className="capitalize">
                          {booking.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium">{format(new Date(booking.date), "EEEE, MMMM dd, yyyy")}</p>
                            <p className="text-sm text-gray-600">Booking Date</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Clock className="h-5 w-5 text-gray-400" />
                          <div>
                            <div className="flex flex-wrap gap-1">
                              {booking.timeSlots.map((slot) => (
                                <Badge key={slot} variant="outline" className="text-xs">
                                  {slot}
                                </Badge>
                              ))}
                            </div>
                            <p className="text-sm text-gray-600">Time Slots</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t">
                        <div>
                          <p className="text-lg font-semibold text-green-600">₹{booking.totalAmount}</p>
                          <p className="text-sm text-gray-600">Total Amount</p>
                        </div>
                        <div className="flex space-x-2">
                          {canCancelBooking(booking) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelBooking(booking.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          )}
                          <Button variant="outline" size="sm" onClick={() => router.push(`/venues/${booking.venueId}`)}>
                            View Venue
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            {pastBookings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Booking History</h3>
                  <p className="text-gray-600">Your completed and cancelled bookings will appear here.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {pastBookings.map((booking) => (
                  <Card key={booking.id} className="overflow-hidden opacity-75">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{booking.venueName}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">
                            {booking.courtName} - {booking.sport}
                          </p>
                        </div>
                        <Badge variant={getStatusColor(booking.status)} className="capitalize">
                          {booking.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium">{format(new Date(booking.date), "EEEE, MMMM dd, yyyy")}</p>
                            <p className="text-sm text-gray-600">Booking Date</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Clock className="h-5 w-5 text-gray-400" />
                          <div>
                            <div className="flex flex-wrap gap-1">
                              {booking.timeSlots.map((slot) => (
                                <Badge key={slot} variant="outline" className="text-xs">
                                  {slot}
                                </Badge>
                              ))}
                            </div>
                            <p className="text-sm text-gray-600">Time Slots</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t">
                        <div>
                          <p className="text-lg font-semibold text-green-600">₹{booking.totalAmount}</p>
                          <p className="text-sm text-gray-600">Total Amount</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => router.push(`/venues/${booking.venueId}`)}>
                          View Venue
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
