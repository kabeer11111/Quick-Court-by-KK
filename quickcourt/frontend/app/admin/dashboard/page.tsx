"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Building, Calendar, MapPin, TrendingUp, Star } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

// Mock data for charts
const bookingTrends = [
  { month: "Jan", bookings: 120, revenue: 12000 },
  { month: "Feb", bookings: 150, revenue: 15000 },
  { month: "Mar", bookings: 180, revenue: 18000 },
  { month: "Apr", bookings: 220, revenue: 22000 },
  { month: "May", bookings: 280, revenue: 28000 },
  { month: "Jun", bookings: 320, revenue: 32000 },
]

const userRegistrations = [
  { month: "Jan", users: 45, owners: 8 },
  { month: "Feb", users: 52, owners: 12 },
  { month: "Mar", users: 68, owners: 15 },
  { month: "Apr", users: 78, owners: 18 },
  { month: "May", users: 95, owners: 22 },
  { month: "Jun", users: 112, owners: 28 },
]

const facilityApprovals = [
  { month: "Jan", pending: 5, approved: 8, rejected: 2 },
  { month: "Feb", pending: 8, approved: 12, rejected: 1 },
  { month: "Mar", pending: 12, approved: 15, rejected: 3 },
  { month: "Apr", pending: 6, approved: 18, rejected: 2 },
  { month: "May", pending: 9, approved: 22, rejected: 1 },
  { month: "Jun", pending: 15, approved: 28, rejected: 4 },
]

const sportPopularity = [
  { name: "Badminton", bookings: 450, color: "#22c55e" },
  { name: "Tennis", bookings: 320, color: "#3b82f6" },
  { name: "Basketball", bookings: 280, color: "#f59e0b" },
  { name: "Football", bookings: 180, color: "#ef4444" },
  { name: "Cricket", bookings: 120, color: "#8b5cf6" },
]

export default function AdminDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of platform statistics and management tools</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Facility Owners</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,450</div>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courts</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Booking Activity Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Booking Activity Over Time
            </CardTitle>
            <CardDescription>Monthly booking trends and revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={bookingTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="bookings" stroke="#22c55e" strokeWidth={2} />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Registration Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Registration Trends
            </CardTitle>
            <CardDescription>New user and facility owner registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userRegistrations}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" fill="#22c55e" />
                <Bar dataKey="owners" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Facility Approval Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Facility Approval Trend
            </CardTitle>
            <CardDescription>Facility approval status over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={facilityApprovals}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="approved" fill="#22c55e" />
                <Bar dataKey="pending" fill="#f59e0b" />
                <Bar dataKey="rejected" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Most Active Sports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Most Active Sports
            </CardTitle>
            <CardDescription>Booking distribution by sport type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sportPopularity}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="bookings"
                >
                  {sportPopularity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Facility Registrations</CardTitle>
            <CardDescription>Latest facility approval requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Elite Sports Complex", owner: "John Smith", status: "pending", date: "2 hours ago" },
                { name: "City Badminton Center", owner: "Sarah Johnson", status: "approved", date: "5 hours ago" },
                { name: "Premium Tennis Club", owner: "Mike Wilson", status: "pending", date: "1 day ago" },
                { name: "Community Sports Hub", owner: "Lisa Brown", status: "approved", date: "2 days ago" },
              ].map((facility, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{facility.name}</p>
                    <p className="text-sm text-gray-600">by {facility.owner}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={facility.status === "approved" ? "default" : "secondary"}>{facility.status}</Badge>
                    <p className="text-xs text-gray-500 mt-1">{facility.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
            <CardDescription>Important notifications and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: "warning", message: "15 facilities pending approval", time: "1 hour ago" },
                { type: "info", message: "Monthly revenue report ready", time: "3 hours ago" },
                { type: "success", message: "System backup completed", time: "6 hours ago" },
                { type: "warning", message: "3 user reports require attention", time: "1 day ago" },
              ].map((alert, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      alert.type === "warning"
                        ? "bg-yellow-500"
                        : alert.type === "success"
                          ? "bg-green-500"
                          : "bg-blue-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm">{alert.message}</p>
                    <p className="text-xs text-gray-500">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
