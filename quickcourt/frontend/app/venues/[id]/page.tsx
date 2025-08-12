"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookingModal } from "@/components/booking-modal"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import {
  MapPin,
  Star,
  Clock,
  Wifi,
  Car,
  Shirt,
  Droplets,
  Users,
  Phone,
  Mail,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface Venue {
  id: number
  name: string
  sports: string[]
  pricePerHour: number
  location: string
  address: string
  rating: number
  reviewCount: number
  images: string[]
  amenities: string[]
  description: string
  aboutVenue: string
  venueType: string
  operatingHours: string
  phone: string
  email: string
  courts: Court[]
  reviews: Review[]
}

interface Court {
  id: number
  name: string
  sport: string
  pricePerHour: number
  isAvailable: boolean
}

interface Review {
  id: number
  userName: string
  userAvatar: string
  rating: number
  comment: string
  date: string
}

const mockVenueData: Record<number, Venue> = {
  1: {
    id: 1,
    name: "SportZone Arena",
    sports: ["Badminton", "Tennis"],
    pricePerHour: 500,
    location: "Sector 18, Noida",
    address: "Plot No. 45, Sector 18, Noida, Uttar Pradesh 201301",
    rating: 4.5,
    reviewCount: 128,
    images: ["/modern-sports-arena.png", "/badminton-court.png", "/tennis-court-club.png", "/modern-gym.png"],
    amenities: ["Parking", "Changing Room", "Water", "Equipment", "AC", "WiFi"],
    description: "Premium indoor sports facility with air conditioning and modern equipment",
    aboutVenue:
      "SportZone Arena is a state-of-the-art indoor sports facility located in the heart of Noida. We offer premium badminton and tennis courts with professional-grade equipment and amenities. Our facility is fully air-conditioned and maintained to international standards.",
    venueType: "Indoor",
    operatingHours: "6:00 AM - 11:00 PM",
    phone: "+91 9876543210",
    email: "info@sportzonearena.com",
    courts: [
      { id: 1, name: "Badminton Court 1", sport: "Badminton", pricePerHour: 500, isAvailable: true },
      { id: 2, name: "Badminton Court 2", sport: "Badminton", pricePerHour: 500, isAvailable: true },
      { id: 3, name: "Tennis Court 1", sport: "Tennis", pricePerHour: 600, isAvailable: true },
      { id: 4, name: "Tennis Court 2", sport: "Tennis", pricePerHour: 600, isAvailable: false },
    ],
    reviews: [
      {
        id: 1,
        userName: "Rahul Sharma",
        userAvatar: "/placeholder.svg",
        rating: 5,
        comment: "Excellent facility with great equipment. Courts are well maintained and staff is helpful.",
        date: "2024-01-15",
      },
      {
        id: 2,
        userName: "Priya Singh",
        userAvatar: "/placeholder.svg",
        rating: 4,
        comment: "Good courts and clean facilities. Booking process is smooth. Slightly expensive but worth it.",
        date: "2024-01-10",
      },
      {
        id: 3,
        userName: "Amit Kumar",
        userAvatar: "/placeholder.svg",
        rating: 5,
        comment: "Best badminton courts in Noida. Air conditioning works great and parking is convenient.",
        date: "2024-01-05",
      },
    ],
  },
  2: {
    id: 2,
    name: "Green Turf Ground",
    sports: ["Football", "Cricket"],
    pricePerHour: 800,
    location: "Gurgaon",
    address: "Sector 29, Gurgaon, Haryana 122001",
    rating: 4.2,
    reviewCount: 95,
    images: ["/green-football-turf.png", "/cricket-ground.png"],
    amenities: ["Parking", "Floodlights", "Changing Room", "Equipment"],
    description: "Well-maintained outdoor turf with professional lighting",
    aboutVenue:
      "Green Turf Ground offers premium outdoor sports facilities for football and cricket enthusiasts. Our well-maintained turf provides the perfect playing surface for competitive matches and training sessions.",
    venueType: "Outdoor",
    operatingHours: "5:00 AM - 10:00 PM",
    phone: "+91 9876543211",
    email: "info@greenturfground.com",
    courts: [
      { id: 1, name: "Football Field", sport: "Football", pricePerHour: 800, isAvailable: true },
      { id: 2, name: "Cricket Ground", sport: "Cricket", pricePerHour: 1000, isAvailable: true },
    ],
    reviews: [
      {
        id: 1,
        userName: "Vikash Yadav",
        userAvatar: "/placeholder.svg",
        rating: 4,
        comment: "Great turf quality and good lighting for evening matches. Parking could be better.",
        date: "2024-01-12",
      },
    ],
  },
}

const amenityIcons: Record<string, any> = {
  Parking: Car,
  "Changing Room": Shirt,
  Water: Droplets,
  Equipment: Users,
  AC: Clock,
  WiFi: Wifi,
  Floodlights: Clock,
}

export default function VenuePage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [venue, setVenue] = useState<Venue | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showBookingModal, setShowBookingModal] = useState(false)

  useEffect(() => {
    const venueId = Number.parseInt(params.id as string)
    const venueData = mockVenueData[venueId]
    if (venueData) {
      setVenue(venueData)
    } else {
      router.push("/venues")
    }
  }, [params.id, router])

  const handleBookNow = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to book a court.",
        variant: "destructive",
      })
      router.push("/auth/login")
      return
    }
    setShowBookingModal(true)
  }

  const nextImage = () => {
    if (venue) {
      setCurrentImageIndex((prev) => (prev + 1) % venue.images.length)
    }
  }

  const prevImage = () => {
    if (venue) {
      setCurrentImageIndex((prev) => (prev - 1 + venue.images.length) % venue.images.length)
    }
  }

  if (!venue) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Venue not found</h1>
            <Button onClick={() => router.push("/venues")} className="mt-4">
              Back to Venues
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Venues
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative aspect-video">
                <img
                  src={venue.images[currentImageIndex] || "/placeholder.svg"}
                  alt={venue.name}
                  className="w-full h-full object-cover"
                />
                {venue.images.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute left-4 top-1/2 transform -translate-y-1/2"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {venue.images.map((_, index) => (
                        <button
                          key={index}
                          className={`w-2 h-2 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* Venue Details */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl font-bold">{venue.name}</CardTitle>
                    <div className="flex items-center mt-2 text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{venue.address}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center mb-1">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="text-lg font-semibold">{venue.rating}</span>
                      <span className="text-sm text-gray-500 ml-1">({venue.reviewCount} reviews)</span>
                    </div>
                    <Badge variant="secondary">{venue.venueType}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Sports Available</h3>
                    <div className="flex flex-wrap gap-2">
                      {venue.sports.map((sport) => (
                        <Badge key={sport} variant="outline">
                          {sport}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-gray-600">{venue.description}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Operating Hours</h3>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{venue.operatingHours}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Contact Information</h3>
                    <div className="space-y-1 text-gray-600">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{venue.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        <span>{venue.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs for Additional Info */}
            <Tabs defaultValue="amenities" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="about">About Venue</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="amenities">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {venue.amenities.map((amenity) => {
                        const IconComponent = amenityIcons[amenity] || Users
                        return (
                          <div key={amenity} className="flex items-center space-x-2">
                            <IconComponent className="h-5 w-5 text-green-600" />
                            <span className="text-sm">{amenity}</span>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="about">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-gray-600 leading-relaxed">{venue.aboutVenue}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      {venue.reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                          <div className="flex items-start space-x-4">
                            <Avatar>
                              <AvatarImage src={review.userAvatar || "/placeholder.svg"} />
                              <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold">{review.userName}</h4>
                                <span className="text-sm text-gray-500">{review.date}</span>
                              </div>
                              <div className="flex items-center mb-2">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <p className="text-gray-600">{review.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Book Now</span>
                  <div className="text-2xl font-bold text-green-600">₹{venue.pricePerHour}/hr</div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Available Courts</h4>
                  <div className="space-y-2">
                    {venue.courts.map((court) => (
                      <div
                        key={court.id}
                        className={`p-3 rounded-lg border ${
                          court.isAvailable ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{court.name}</p>
                            <p className="text-sm text-gray-600">{court.sport}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">₹{court.pricePerHour}/hr</p>
                            <Badge variant={court.isAvailable ? "default" : "secondary"} className="text-xs">
                              {court.isAvailable ? "Available" : "Booked"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button onClick={handleBookNow} className="w-full" size="lg">
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Now
                </Button>

                <p className="text-xs text-gray-500 text-center">Free cancellation up to 2 hours before your booking</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingModal
          venue={venue}
          onClose={() => setShowBookingModal(false)}
          onSuccess={() => router.push("/bookings")}
        />
      )}
    </div>
  )
}
