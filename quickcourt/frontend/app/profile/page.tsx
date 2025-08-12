"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, Upload, Loader2 } from "lucide-react"

export default function ProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    avatar: "",
  })
  const [bookingStats, setBookingStats] = useState({
    totalBookings: 0,
    totalSpent: 0,
    memberSince: "",
  })

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    // Initialize form data with user info
    setFormData({
      fullName: user.fullName,
      email: user.email,
      phone: "+91 9876543210", // Mock data
      address: "New Delhi, India", // Mock data
      avatar: user.avatar || "",
    })

    // Load booking stats
    const savedBookings = JSON.parse(localStorage.getItem("quickcourt_bookings") || "[]")
    const userBookings = savedBookings.filter((booking: any) => booking.userId === user._id)
    const totalSpent = userBookings
      .filter((booking: any) => booking.status !== "cancelled")
      .reduce((sum: number, booking: any) => sum + booking.totalAmount, 0)

    setBookingStats({
      totalBookings: userBookings.length,
      totalSpent,
      memberSince: "January 2024", // Mock data
    })
  }, [user, router])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData((prev) => ({ ...prev, avatar: e.target?.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, this would update the user in the database
      // For now, we'll update localStorage
      const updatedUser = {
        ...user,
        fullName: formData.fullName,
        avatar: formData.avatar,
      }

      localStorage.setItem("quickcourt_user", JSON.stringify(updatedUser))

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      })

      setIsEditing(false)
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    // Reset form data
    setFormData({
      fullName: user?.fullName || "",
      email: user?.email || "",
      phone: "+91 9876543210",
      address: "New Delhi, India",
      avatar: user?.avatar || "",
    })
    setIsEditing(false)
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 font-display">Profile Settings</h1>
            <p className="text-gray-600">Manage your account information and preferences</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Personal Information</CardTitle>
                    {!isEditing ? (
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    ) : (
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={handleCancel} disabled={isLoading}>
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                        <Button size="sm" onClick={handleSave} disabled={isLoading}>
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4 mr-2" />
                          )}
                          Save
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center space-x-6">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={formData.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-2xl">
                        {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <div>
                        <Label htmlFor="avatar-upload" className="cursor-pointer">
                          <div className="flex items-center space-x-2 text-sm text-green-600 hover:text-green-700">
                            <Upload className="h-4 w-4" />
                            <span>Change Avatar</span>
                          </div>
                          <Input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarUpload}
                          />
                        </Label>
                        <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Form Fields */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      {isEditing ? (
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange("fullName", e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
                          <User className="h-4 w-4 text-gray-400" />
                          <span>{formData.fullName}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{formData.email}</span>
                        <Badge variant="secondary" className="ml-auto text-xs">
                          Verified
                        </Badge>
                      </div>
                      {isEditing && (
                        <p className="text-xs text-gray-500">Email cannot be changed. Contact support if needed.</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{formData.phone}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      {isEditing ? (
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{formData.address}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Account Type</Label>
                    <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
                      <Badge variant="default" className="capitalize">
                        {user.role.replace("_", " ")}
                      </Badge>
                      <span className="text-sm text-gray-600 ml-2">
                        {user.role === "user" && "Book sports facilities"}
                        {user.role === "owner" && "Manage sports venues"}
                        {user.role === "admin" && "Platform administrator"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Stats Sidebar */}
            <div className="space-y-6">
              {/* Account Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Account Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Member Since</span>
                    </div>
                    <span className="font-medium">{bookingStats.memberSince}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Total Bookings</span>
                    </div>
                    <span className="font-medium">{bookingStats.totalBookings}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Total Spent</span>
                    </div>
                    <span className="font-medium text-green-600">₹{bookingStats.totalSpent.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Account Security */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Account Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <AlertDescription>
                      Your account is secured with email verification. For additional security options, contact support.
                    </AlertDescription>
                  </Alert>

                  <Button variant="outline" className="w-full bg-transparent">
                    Change Password
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
