"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Calendar, Clock, User, Search, Filter } from "lucide-react"
import { format, subDays, addDays } from "date-fns"

interface Booking {
  id: number
  userName: string
  userEmail: string
  courtName: string
  sport: string
  date: string
  timeSlots: string[]
  status: "confirmed" | "cancelled" | "completed"
  amount: number
  facilityName: string
}

export default function OwnerBookingsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sportFilter, setSportFilter] = useState("all")

  useEffect(() => {
    if (!user || user.role !== "owner") {
      router.push("/auth/login")
      return
    }

    // Mock bookings data
    const mockBookings: Booking[] = [
      {
        id: 1,
        userName: "Rahul Sharma",
        userEmail: "rahul@example.com",
        courtName: "Badminton Court 1",
        sport: "Badminton",
        date: format(addDays(new Date(), 1), "yyyy-MM-dd"),
        timeSlots: ["6:00 PM", "7:00 PM"],
        status: "confirmed",
        amount: 1000,
        facilityName: "SportZone Arena",
      },
      {
        id: 2,
        userName: "Priya Singh",
        userEmail: "priya@example.com",
        courtName: "Tennis Court 1",
        sport: "Tennis",
        date: format(addDays(new Date(), 2), "yyyy-MM-dd"),
        timeSlots: ["8:00 AM"],
        status: "confirmed",
        amount: 600,
        facilityName: "SportZone Arena",
      },
      {
        id: 3,
        userName: "Amit Kumar",
        userEmail: "amit@example.com",
        courtName: "Badminton Court 2",
        sport: "Badminton",
        date: format(subDays(new Date(), 1), "yyyy-MM-dd"),
        timeSlots: ["7:00 PM"],
        status: "completed",
        amount: 500,
        facilityName: "SportZone Arena",
      },
      {
        id: 4,
        userName: "Neha Gupta",
        userEmail: "neha@example.com",
        courtName: "Football Field",
        sport: "Football",
        date: format(subDays(new Date(), 3), "yyyy-MM-dd"),
        timeSlots: ["5:00 PM", "6:00 PM"],
        status: "cancelled",
        amount: 1600,
        facilityName: "Green Turf Ground",
      },
      {
        id: 5,
        userName: "Vikash Yadav",
        userEmail: "vikash@example.com",
        courtName: "Tennis Court 1",
        sport: "Tennis",
        date: format(subDays(new Date(), 5), "yyyy-MM-dd"),
        timeSlots: ["9:00 AM", "10:00 AM"],
        status: "completed",
        amount: 1200,
        facilityName: "SportZone Arena",
      },
    ]

    setBookings(mockBookings)
  }, [user, router])

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.courtName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    const matchesSport = sportFilter === "all" || booking.sport === sportFilter

    return matchesSearch && matchesStatus && matchesSport
  })

  const upcomingBookings = filteredBookings.filter(
    (booking) => booking.status === "confirmed" && new Date(booking.date) >= new Date(),
  )
  const pastBookings = filteredBookings.filter(
    (booking) =>
      booking.status === "completed" || booking.status === "cancelled" || new Date(booking.date) < new Date(),
  )

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

  const uniqueSports = Array.from(new Set(bookings.map((booking) => booking.sport)))

  if (!user || user.role !== "owner") {
    return null
  }

  const renderBookingCard = (booking: Booking) => (
    <Card key={booking.id} className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{booking.userName}</CardTitle>
            <p className="text-sm text-gray-600">{booking.userEmail}</p>
          </div>
          <Badge variant={getStatusColor(booking.status)} className="capitalize">
            {booking.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-gray-400" />
            <div>
              <p className="font-medium">
                {booking.courtName} - {booking.sport}
              </p>
              <p className="text-sm text-gray-600">{booking.facilityName}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="font-medium">{format(new Date(booking.date), "EEEE, MMMM dd, yyyy")}</p>
              <p className="text-sm text-gray-600">Booking Date</p>
            </div>
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

        <div className="flex justify-between items-center pt-4 border-t">
          <div>
            <p className="text-lg font-semibold text-green-600">₹{booking.amount}</p>
            <p className="text-sm text-gray-600">Total Amount</p>
          </div>
          <div className="text-sm text-gray-500">Booking ID: #{booking.id}</div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-display">Booking Overview</h1>
          <p className="text-gray-600">View and manage all bookings for your facilities</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search bookings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sportFilter} onValueChange={setSportFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by sport" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sports</SelectItem>
                  {uniqueSports.map((sport) => (
                    <SelectItem key={sport} value={sport}>
                      {sport}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setStatusFilter("all")
                  setSportFilter("all")
                }}
              >
                <Filter className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming Bookings ({upcomingBookings.length})</TabsTrigger>
            <TabsTrigger value="history">Booking History ({pastBookings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-6">
            {upcomingBookings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Upcoming Bookings</h3>
                  <p className="text-gray-600">No confirmed bookings found matching your criteria.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">{upcomingBookings.map(renderBookingCard)}</div>
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            {pastBookings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Booking History</h3>
                  <p className="text-gray-600">No past bookings found matching your criteria.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">{pastBookings.map(renderBookingCard)}</div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
