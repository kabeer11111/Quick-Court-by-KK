"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Plus, Edit2, Trash2, Clock, DollarSign } from "lucide-react"

interface Court {
  id: number
  name: string
  sport: string
  pricePerHour: number
  operatingHours: string
  facilityId: number
  facilityName: string
  isActive: boolean
}

const availableSports = ["Badminton", "Tennis", "Football", "Cricket", "Basketball", "Swimming", "Gym"]

export default function CourtsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [courts, setCourts] = useState<Court[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingCourt, setEditingCourt] = useState<Court | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    sport: "",
    pricePerHour: "",
    operatingHours: "6:00 AM - 11:00 PM",
    facilityId: "",
    facilityName: "",
  })

  const mockFacilities = [
    { id: 1, name: "SportZone Arena" },
    { id: 2, name: "Green Turf Ground" },
  ]

  useEffect(() => {
    if (!user || user.role !== "owner") {
      router.push("/auth/login")
      return
    }

    // Mock courts data
    const mockCourts: Court[] = [
      {
        id: 1,
        name: "Badminton Court 1",
        sport: "Badminton",
        pricePerHour: 500,
        operatingHours: "6:00 AM - 11:00 PM",
        facilityId: 1,
        facilityName: "SportZone Arena",
        isActive: true,
      },
      {
        id: 2,
        name: "Badminton Court 2",
        sport: "Badminton",
        pricePerHour: 500,
        operatingHours: "6:00 AM - 11:00 PM",
        facilityId: 1,
        facilityName: "SportZone Arena",
        isActive: true,
      },
      {
        id: 3,
        name: "Tennis Court 1",
        sport: "Tennis",
        pricePerHour: 600,
        operatingHours: "6:00 AM - 11:00 PM",
        facilityId: 1,
        facilityName: "SportZone Arena",
        isActive: true,
      },
      {
        id: 4,
        name: "Football Field",
        sport: "Football",
        pricePerHour: 800,
        operatingHours: "5:00 AM - 10:00 PM",
        facilityId: 2,
        facilityName: "Green Turf Ground",
        isActive: true,
      },
    ]

    setCourts(mockCourts)
  }, [user, router])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      sport: "",
      pricePerHour: "",
      operatingHours: "6:00 AM - 11:00 PM",
      facilityId: "",
      facilityName: "",
    })
  }

  const handleAddCourt = () => {
    if (!formData.name || !formData.sport || !formData.pricePerHour || !formData.facilityId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const selectedFacility = mockFacilities.find((f) => f.id.toString() === formData.facilityId)

    const newCourt: Court = {
      id: Date.now(),
      name: formData.name,
      sport: formData.sport,
      pricePerHour: Number.parseInt(formData.pricePerHour),
      operatingHours: formData.operatingHours,
      facilityId: Number.parseInt(formData.facilityId),
      facilityName: selectedFacility?.name || "",
      isActive: true,
    }

    setCourts((prev) => [...prev, newCourt])
    toast({
      title: "Court Added",
      description: "Your court has been added successfully.",
    })
    setShowAddModal(false)
    resetForm()
  }

  const handleEditCourt = (court: Court) => {
    setEditingCourt(court)
    setFormData({
      name: court.name,
      sport: court.sport,
      pricePerHour: court.pricePerHour.toString(),
      operatingHours: court.operatingHours,
      facilityId: court.facilityId.toString(),
      facilityName: court.facilityName,
    })
  }

  const handleUpdateCourt = () => {
    if (!editingCourt) return

    const selectedFacility = mockFacilities.find((f) => f.id.toString() === formData.facilityId)

    const updatedCourt: Court = {
      ...editingCourt,
      name: formData.name,
      sport: formData.sport,
      pricePerHour: Number.parseInt(formData.pricePerHour),
      operatingHours: formData.operatingHours,
      facilityId: Number.parseInt(formData.facilityId),
      facilityName: selectedFacility?.name || "",
    }

    setCourts((prev) => prev.map((c) => (c.id === editingCourt.id ? updatedCourt : c)))
    toast({
      title: "Court Updated",
      description: "Your court has been updated successfully.",
    })
    setEditingCourt(null)
    resetForm()
  }

  const handleDeleteCourt = (id: number) => {
    setCourts((prev) => prev.filter((c) => c.id !== id))
    toast({
      title: "Court Deleted",
      description: "The court has been deleted successfully.",
    })
  }

  const toggleCourtStatus = (id: number) => {
    setCourts((prev) => prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c)))
    toast({
      title: "Court Status Updated",
      description: "The court status has been updated.",
    })
  }

  if (!user || user.role !== "owner") {
    return null
  }

  const renderCourtForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="facility">Facility *</Label>
        <Select value={formData.facilityId} onValueChange={(value) => handleInputChange("facilityId", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select facility" />
          </SelectTrigger>
          <SelectContent>
            {mockFacilities.map((facility) => (
              <SelectItem key={facility.id} value={facility.id.toString()}>
                {facility.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Court Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="e.g., Badminton Court 1"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sport">Sport Type *</Label>
          <Select value={formData.sport} onValueChange={(value) => handleInputChange("sport", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select sport" />
            </SelectTrigger>
            <SelectContent>
              {availableSports.map((sport) => (
                <SelectItem key={sport} value={sport}>
                  {sport}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price per Hour (₹) *</Label>
          <Input
            id="price"
            type="number"
            value={formData.pricePerHour}
            onChange={(e) => handleInputChange("pricePerHour", e.target.value)}
            placeholder="500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hours">Operating Hours</Label>
          <Input
            id="hours"
            value={formData.operatingHours}
            onChange={(e) => handleInputChange("operatingHours", e.target.value)}
            placeholder="6:00 AM - 11:00 PM"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          variant="outline"
          onClick={() => {
            setShowAddModal(false)
            setEditingCourt(null)
            resetForm()
          }}
        >
          Cancel
        </Button>
        <Button onClick={editingCourt ? handleUpdateCourt : handleAddCourt}>
          {editingCourt ? "Update Court" : "Add Court"}
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2 font-display">Court Management</h1>
            <p className="text-gray-600">Manage your courts, pricing, and operating hours</p>
          </div>
          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Court
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Court</DialogTitle>
              </DialogHeader>
              {renderCourtForm()}
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courts.map((court) => (
            <Card key={court.id} className={`${!court.isActive ? "opacity-60" : ""}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{court.name}</CardTitle>
                    <p className="text-sm text-gray-600">{court.facilityName}</p>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="outline" size="sm" onClick={() => handleEditCourt(court)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteCourt(court.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{court.sport}</Badge>
                  <Badge variant={court.isActive ? "default" : "destructive"}>
                    {court.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Price per Hour</span>
                    </div>
                    <span className="font-semibold text-green-600">₹{court.pricePerHour}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Operating Hours</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 ml-6">{court.operatingHours}</p>
                </div>

                <Button
                  variant={court.isActive ? "outline" : "default"}
                  size="sm"
                  className="w-full"
                  onClick={() => toggleCourtStatus(court.id)}
                >
                  {court.isActive ? "Deactivate" : "Activate"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Edit Modal */}
        <Dialog open={!!editingCourt} onOpenChange={() => setEditingCourt(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Court</DialogTitle>
            </DialogHeader>
            {renderCourtForm()}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
