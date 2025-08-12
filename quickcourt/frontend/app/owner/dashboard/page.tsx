"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { Calendar, TrendingUp, MapPin, Clock, DollarSign, Settings, BarChart3 } from "lucide-react"
import Link from "next/link"
import { format, subDays } from "date-fns"

// Mock data for charts
const bookingTrendsData = [
  { name: "Mon", bookings: 12, earnings: 8400 },
  { name: "Tue", bookings: 19, earnings: 13300 },
  { name: "Wed", bookings: 15, earnings: 10500 },
  { name: "Thu", bookings: 22, earnings: 15400 },
  { name: "Fri", bookings: 28, earnings: 19600 },
  { name: "Sat", bookings: 35, earnings: 24500 },
  { name: "Sun", bookings: 31, earnings: 21700 },
]

const earningsData = [
  { name: "Badminton", value: 45000, color: "#10B981" },
  { name: "Tennis", value: 32000, color: "#3B82F6" },
  { name: "Football", value: 28000, color: "#F59E0B" },
  { name: "Cricket", value: 15000, color: "#EF4444" },
]

const peakHoursData = [
  { hour: "6 AM", bookings: 5 },
  { hour: "7 AM", bookings: 8 },
  { hour: "8 AM", bookings: 12 },
  { hour: "9 AM", bookings: 15 },
  { hour: "10 AM", bookings: 18 },
  { hour: "11 AM", bookings: 22 },
  { hour: "12 PM", bookings: 25 },
  { hour: "1 PM", bookings: 20 },
  { hour: "2 PM", bookings: 18 },
  { hour: "3 PM", bookings: 22 },
  { hour: "4 PM", bookings: 28 },
  { hour: "5 PM", bookings: 35 },
  { hour: "6 PM", bookings: 42 },
  { hour: "7 PM", bookings: 38 },
  { hour: "8 PM", bookings: 32 },
  { hour: "9 PM", bookings: 25 },
  { hour: "10 PM", bookings: 15 },
]

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
}

export default function OwnerDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [recentBookings, setRecentBookings] = useState<Booking[]>([])

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    if (user.role !== "owner") {
      if (user.role === "user") {
        router.push("/dashboard")
      } else if (user.role === "admin") {
        router.push("/admin/dashboard")
      }
      return
    }

    // Mock recent bookings data
    const mockBookings: Booking[] = [
      {
        id: 1,
        userName: "Rahul Sharma",
        userEmail: "rahul@example.com",
        courtName: "Badminton Court 1",
        sport: "Badminton",
        date: format(new Date(), "yyyy-MM-dd"),
        timeSlots: ["6:00 PM", "7:00 PM"],
        status: "confirmed",
        amount: 1000,
      },
      {
        id: 2,
        userName: "Priya Singh",
        userEmail: "priya@example.com",
        courtName: "Tennis Court 1",
        sport: "Tennis",
        date: format(subDays(new Date(), 1), "yyyy-MM-dd"),
        timeSlots: ["8:00 AM"],
        status: "completed",
        amount: 600,
      },
      {
        id: 3,
        userName: "Amit Kumar",
        userEmail: "amit@example.com",
        courtName: "Badminton Court 2",
        sport: "Badminton",
        date: format(subDays(new Date(), 2), "yyyy-MM-dd"),
        timeSlots: ["7:00 PM"],
        status: "cancelled",
        amount: 500,
      },
    ]

    setRecentBookings(mockBookings)
  }, [user, router])

  if (!user || user.role !== "owner") {
    return null
  }

  const totalBookings = 156
  const activeCourts = 8
  const totalEarnings = 120000
  const thisWeekBookings = 45

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-display">
            Welcome back, {user.fullName.split(" ")[0]}!
          </h1>
          <p className="text-gray-600">Here's your facility performance overview</p>
        </div>

        {/* KPI Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
                  <p className="text-xs text-green-600 mt-1">+12% from last month</p>
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
                  <p className="text-sm font-medium text-gray-600">Active Courts</p>
                  <p className="text-2xl font-bold text-gray-900">{activeCourts}</p>
                  <p className="text-xs text-gray-500 mt-1">Across 2 facilities</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">₹{totalEarnings.toLocaleString()}</p>
                  <p className="text-xs text-green-600 mt-1">+8% from last month</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Week</p>
                  <p className="text-2xl font-bold text-gray-900">{thisWeekBookings}</p>
                  <p className="text-xs text-green-600 mt-1">+15% from last week</p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Booking Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Booking Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={bookingTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="bookings" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Earnings by Sport */}
          <Card>
            <CardHeader>
              <CardTitle>Earnings by Sport</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={earningsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {earningsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center mt-4 space-x-4">
                {earningsData.map((entry, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-sm">{entry.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Peak Hours Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Peak Booking Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={peakHoursData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="bookings" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Recent Bookings</CardTitle>
                <Link href="/owner/bookings">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{booking.userName}</h4>
                      <p className="text-sm text-gray-600">
                        {booking.courtName} - {booking.sport}
                      </p>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{format(new Date(booking.date), "MMM dd, yyyy")}</span>
                        <Clock className="h-4 w-4 ml-3 mr-1" />
                        <span>{booking.timeSlots.join(", ")}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          booking.status === "confirmed"
                            ? "default"
                            : booking.status === "completed"
                              ? "secondary"
                              : "destructive"
                        }
                        className="mb-2 capitalize"
                      >
                        {booking.status}
                      </Badge>
                      <p className="text-sm font-semibold text-green-600">₹{booking.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Link href="/owner/facilities">
                  <Button className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                    <MapPin className="h-6 w-6" />
                    <span className="text-sm">Manage Facilities</span>
                  </Button>
                </Link>
                <Link href="/owner/courts">
                  <Button
                    variant="outline"
                    className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                  >
                    <Settings className="h-6 w-6" />
                    <span className="text-sm">Manage Courts</span>
                  </Button>
                </Link>
                <Link href="/owner/schedule">
                  <Button
                    variant="outline"
                    className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                  >
                    <Clock className="h-6 w-6" />
                    <span className="text-sm">Schedule</span>
                  </Button>
                </Link>
                <Link href="/owner/bookings">
                  <Button
                    variant="outline"
                    className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                  >
                    <BarChart3 className="h-6 w-6" />
                    <span className="text-sm">View Bookings</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
