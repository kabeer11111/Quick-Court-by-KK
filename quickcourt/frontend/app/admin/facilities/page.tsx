"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Search, Eye, Check, X, Building, MapPin } from "lucide-react"

// Mock data for pending facilities
const pendingFacilities = [
  {
    id: 1,
    name: "Elite Sports Complex",
    owner: "John Smith",
    email: "john@example.com",
    location: "Downtown, City Center",
    description: "Premium sports facility with multiple courts and modern amenities",
    sports: ["Badminton", "Tennis", "Basketball"],
    amenities: ["Parking", "Locker Rooms", "Cafeteria", "AC"],
    photos: ["/modern-sports-arena.png", "/green-football-turf.png"],
    submittedDate: "2024-01-10",
    status: "pending",
    rating: 0,
  },
  {
    id: 2,
    name: "Community Sports Hub",
    owner: "Sarah Johnson",
    email: "sarah@example.com",
    location: "Suburb Area, North Zone",
    description: "Community-focused sports facility with affordable pricing",
    sports: ["Cricket", "Football", "Badminton"],
    amenities: ["Parking", "Restrooms", "Water Fountain"],
    photos: ["/cricket-ground.png", "/outdoor-basketball-court.png"],
    submittedDate: "2024-01-12",
    status: "pending",
    rating: 0,
  },
  {
    id: 3,
    name: "Premium Tennis Club",
    owner: "Mike Wilson",
    email: "mike@example.com",
    location: "Uptown, Business District",
    description: "Exclusive tennis club with professional-grade courts",
    sports: ["Tennis"],
    amenities: ["Parking", "Locker Rooms", "Pro Shop", "AC", "Restaurant"],
    photos: ["/modern-gym.png"],
    submittedDate: "2024-01-08",
    status: "pending",
    rating: 0,
  },
]

export default function FacilityApprovalPage() {
  const [facilities, setFacilities] = useState(pendingFacilities)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedFacility, setSelectedFacility] = useState(null)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [reviewComments, setReviewComments] = useState("")

  const filteredFacilities = facilities.filter((facility) => {
    const matchesSearch =
      facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facility.owner.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || facility.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleApprove = (facilityId: number) => {
    setFacilities((prev) =>
      prev.map((facility) => (facility.id === facilityId ? { ...facility, status: "approved" } : facility)),
    )
    setReviewDialogOpen(false)
    setReviewComments("")
  }

  const handleReject = (facilityId: number) => {
    setFacilities((prev) =>
      prev.map((facility) => (facility.id === facilityId ? { ...facility, status: "rejected" } : facility)),
    )
    setReviewDialogOpen(false)
    setReviewComments("")
  }

  const openReviewDialog = (facility) => {
    setSelectedFacility(facility)
    setReviewDialogOpen(true)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Facility Approval</h1>
        <p className="text-gray-600">Review and approve facility registration requests</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Facilities</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by facility name or owner..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Facilities List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredFacilities.map((facility) => (
          <Card key={facility.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{facility.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4" />
                    {facility.location}
                  </CardDescription>
                </div>
                <Badge
                  variant={
                    facility.status === "approved"
                      ? "default"
                      : facility.status === "rejected"
                        ? "destructive"
                        : "secondary"
                  }
                >
                  {facility.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Owner Details</p>
                  <p className="text-sm text-gray-600">{facility.owner}</p>
                  <p className="text-sm text-gray-600">{facility.email}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Description</p>
                  <p className="text-sm text-gray-600">{facility.description}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Sports Available</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {facility.sports.map((sport) => (
                      <Badge key={sport} variant="outline" className="text-xs">
                        {sport}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Amenities</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {facility.amenities.map((amenity) => (
                      <Badge key={amenity} variant="outline" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <p className="text-xs text-gray-500">
                    Submitted: {new Date(facility.submittedDate).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openReviewDialog(facility)}>
                      <Eye className="h-4 w-4 mr-1" />
                      Review
                    </Button>
                    {facility.status === "pending" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApprove(facility.id)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReject(facility.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFacilities.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No facilities found matching your criteria</p>
          </CardContent>
        </Card>
      )}

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Facility: {selectedFacility?.name}</DialogTitle>
            <DialogDescription>Review facility details and provide approval decision</DialogDescription>
          </DialogHeader>

          {selectedFacility && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Facility Name</Label>
                  <p className="text-sm text-gray-600">{selectedFacility.name}</p>
                </div>
                <div>
                  <Label>Owner</Label>
                  <p className="text-sm text-gray-600">{selectedFacility.owner}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="text-sm text-gray-600">{selectedFacility.email}</p>
                </div>
                <div>
                  <Label>Location</Label>
                  <p className="text-sm text-gray-600">{selectedFacility.location}</p>
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <p className="text-sm text-gray-600">{selectedFacility.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Sports</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedFacility.sports.map((sport) => (
                      <Badge key={sport} variant="outline" className="text-xs">
                        {sport}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Amenities</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedFacility.amenities.map((amenity) => (
                      <Badge key={amenity} variant="outline" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <Label>Photos</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {selectedFacility.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo || "/placeholder.svg"}
                      alt={`Facility photo ${index + 1}`}
                      className="w-full h-20 object-cover rounded-md border"
                    />
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="comments">Review Comments (Optional)</Label>
                <Textarea
                  id="comments"
                  placeholder="Add comments for the facility owner..."
                  value={reviewComments}
                  onChange={(e) => setReviewComments(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
              Cancel
            </Button>
            {selectedFacility?.status === "pending" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleReject(selectedFacility.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4 mr-1" />
                  Reject
                </Button>
                <Button onClick={() => handleApprove(selectedFacility.id)}>
                  <Check className="h-4 w-4 mr-1" />
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
