"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Plus, Edit2, Trash2, MapPin, Upload, X } from "lucide-react"

interface Facility {
  id: number
  name: string
  location: string
  description: string
  sports: string[]
  amenities: string[]
  images: string[]
  operatingHours: string
  phone: string
  email: string
}

const availableSports = ["Badminton", "Tennis", "Football", "Cricket", "Basketball", "Swimming", "Gym"]
const availableAmenities = ["Parking", "Changing Room", "Water", "Equipment", "AC", "WiFi", "Floodlights", "Lockers"]

export default function FacilitiesPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    sports: [] as string[],
    amenities: [] as string[],
    images: [] as string[],
    operatingHours: "6:00 AM - 11:00 PM",
    phone: "",
    email: "",
  })

  useEffect(() => {
    if (!user || user.role !== "owner") {
      router.push("/auth/login")
      return
    }

    // Mock facilities data
    const mockFacilities: Facility[] = [
      {
        id: 1,
        name: "SportZone Arena",
        location: "Sector 18, Noida",
        description: "Premium indoor sports facility with air conditioning and modern equipment",
        sports: ["Badminton", "Tennis"],
        amenities: ["Parking", "Changing Room", "Water", "Equipment", "AC", "WiFi"],
        images: ["/modern-sports-arena.png", "/badminton-court.png"],
        operatingHours: "6:00 AM - 11:00 PM",
        phone: "+91 9876543210",
        email: "info@sportzonearena.com",
      },
      {
        id: 2,
        name: "Green Turf Ground",
        location: "Sector 29, Gurgaon",
        description: "Well-maintained outdoor turf with professional lighting",
        sports: ["Football", "Cricket"],
        amenities: ["Parking", "Floodlights", "Changing Room", "Equipment"],
        images: ["/green-football-turf.png"],
        operatingHours: "5:00 AM - 10:00 PM",
        phone: "+91 9876543211",
        email: "info@greenturfground.com",
      },
    ]

    setFacilities(mockFacilities)
  }, [user, router])

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSportToggle = (sport: string) => {
    setFormData((prev) => ({
      ...prev,
      sports: prev.sports.includes(sport) ? prev.sports.filter((s) => s !== sport) : [...prev.sports, sport],
    }))
  }

  const handleAmenityToggle = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, imageUrl],
        }))
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      description: "",
      sports: [],
      amenities: [],
      images: [],
      operatingHours: "6:00 AM - 11:00 PM",
      phone: "",
      email: "",
    })
  }

  const handleAddFacility = () => {
    if (!formData.name || !formData.location || formData.sports.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const newFacility: Facility = {
      id: Date.now(),
      ...formData,
    }

    setFacilities((prev) => [...prev, newFacility])
    toast({
      title: "Facility Added",
      description: "Your facility has been added successfully.",
    })
    setShowAddModal(false)
    resetForm()
  }

  const handleEditFacility = (facility: Facility) => {
    setEditingFacility(facility)
    setFormData({
      name: facility.name,
      location: facility.location,
      description: facility.description,
      sports: facility.sports,
      amenities: facility.amenities,
      images: facility.images,
      operatingHours: facility.operatingHours,
      phone: facility.phone,
      email: facility.email,
    })
  }

  const handleUpdateFacility = () => {
    if (!editingFacility) return

    const updatedFacility: Facility = {
      ...editingFacility,
      ...formData,
    }

    setFacilities((prev) => prev.map((f) => (f.id === editingFacility.id ? updatedFacility : f)))
    toast({
      title: "Facility Updated",
      description: "Your facility has been updated successfully.",
    })
    setEditingFacility(null)
    resetForm()
  }

  const handleDeleteFacility = (id: number) => {
    setFacilities((prev) => prev.filter((f) => f.id !== id))
    toast({
      title: "Facility Deleted",
      description: "The facility has been deleted successfully.",
    })
  }

  if (!user || user.role !== "owner") {
    return null
  }

  const renderFacilityForm = () => (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Facility Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Enter facility name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            placeholder="Enter location"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Describe your facility"
          rows={3}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            placeholder="Enter phone number"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="Enter email address"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="hours">Operating Hours</Label>
        <Input
          id="hours"
          value={formData.operatingHours}
          onChange={(e) => handleInputChange("operatingHours", e.target.value)}
          placeholder="e.g., 6:00 AM - 11:00 PM"
        />
      </div>

      <div className="space-y-3">
        <Label>Sports Supported *</Label>
        <div className="grid grid-cols-2 gap-2">
          {availableSports.map((sport) => (
            <div key={sport} className="flex items-center space-x-2">
              <Checkbox
                id={`sport-${sport}`}
                checked={formData.sports.includes(sport)}
                onCheckedChange={() => handleSportToggle(sport)}
              />
              <Label htmlFor={`sport-${sport}`} className="text-sm cursor-pointer">
                {sport}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label>Amenities</Label>
        <div className="grid grid-cols-2 gap-2">
          {availableAmenities.map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox
                id={`amenity-${amenity}`}
                checked={formData.amenities.includes(amenity)}
                onCheckedChange={() => handleAmenityToggle(amenity)}
              />
              <Label htmlFor={`amenity-${amenity}`} className="text-sm cursor-pointer">
                {amenity}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label>Photos</Label>
        <div className="space-y-3">
          <div>
            <Label htmlFor="images" className="cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Click to upload images</p>
                <p className="text-xs text-gray-500">PNG, JPG up to 5MB each</p>
              </div>
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />
            </Label>
          </div>

          {formData.images.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {formData.images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-20 object-cover rounded"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          variant="outline"
          onClick={() => {
            setShowAddModal(false)
            setEditingFacility(null)
            resetForm()
          }}
        >
          Cancel
        </Button>
        <Button onClick={editingFacility ? handleUpdateFacility : handleAddFacility}>
          {editingFacility ? "Update Facility" : "Add Facility"}
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 font-display">Facility Management</h1>
            <p className="text-gray-600">Manage your sports facilities and their details</p>
          </div>
          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Facility
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Facility</DialogTitle>
              </DialogHeader>
              {renderFacilityForm()}
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {facilities.map((facility) => (
            <Card key={facility.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{facility.name}</CardTitle>
                    <div className="flex items-center mt-2 text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{facility.location}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditFacility(facility)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteFacility(facility.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">{facility.description}</p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Sports Available</h4>
                    <div className="flex flex-wrap gap-1">
                      {facility.sports.map((sport) => (
                        <Badge key={sport} variant="secondary">
                          {sport}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Amenities</h4>
                    <div className="flex flex-wrap gap-1">
                      {facility.amenities.map((amenity) => (
                        <Badge key={amenity} variant="outline">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {facility.images.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Photos</h4>
                    <div className="flex space-x-2 overflow-x-auto">
                      {facility.images.map((image, index) => (
                        <img
                          key={index}
                          src={image || "/placeholder.svg"}
                          alt={`${facility.name} ${index + 1}`}
                          className="w-24 h-24 object-cover rounded flex-shrink-0"
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Hours:</span> {facility.operatingHours}
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span> {facility.phone}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span> {facility.email}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Edit Modal */}
        <Dialog open={!!editingFacility} onOpenChange={() => setEditingFacility(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Facility</DialogTitle>
            </DialogHeader>
            {renderFacilityForm()}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
