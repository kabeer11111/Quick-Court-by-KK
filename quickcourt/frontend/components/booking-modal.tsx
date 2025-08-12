"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { CalendarIcon, Clock, CreditCard, MapPin, Loader2 } from "lucide-react"
import { format, addDays } from "date-fns"

interface Venue {
  id: number
  name: string
  location: string
  courts: Court[]
}

interface Court {
  id: number
  name: string
  sport: string
  pricePerHour: number
  isAvailable: boolean
}

interface BookingModalProps {
  venue: Venue
  onClose: () => void
  onSuccess: () => void
}

const timeSlots = [
  "06:00 AM",
  "07:00 AM",
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
  "09:00 PM",
  "10:00 PM",
]

export function BookingModal({ venue, onClose, onSuccess }: BookingModalProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null)
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [step, setStep] = useState<"select" | "confirm" | "payment">("select")

  const availableCourts = venue.courts.filter((court) => court.isAvailable)

  const handleTimeSlotToggle = (timeSlot: string) => {
    setSelectedTimeSlots((prev) => {
      if (prev.includes(timeSlot)) {
        return prev.filter((slot) => slot !== timeSlot)
      } else {
        return [...prev, timeSlot].sort((a, b) => {
          const timeA = new Date(`2000/01/01 ${a}`)
          const timeB = new Date(`2000/01/01 ${b}`)
          return timeA.getTime() - timeB.getTime()
        })
      }
    })
  }

  const calculateTotal = () => {
    if (!selectedCourt || selectedTimeSlots.length === 0) return 0
    return selectedCourt.pricePerHour * selectedTimeSlots.length
  }

  const handleProceedToConfirm = () => {
    if (!selectedCourt || selectedTimeSlots.length === 0) {
      toast({
        title: "Incomplete Selection",
        description: "Please select a court and at least one time slot.",
        variant: "destructive",
      })
      return
    }
    setStep("confirm")
  }

  const handleProceedToPayment = () => {
    setStep("payment")
  }

  const handleConfirmBooking = async () => {
    setIsProcessing(true)
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Create booking record (in real app, this would be an API call)
      const booking = {
        id: Date.now(),
        venueId: venue.id,
        venueName: venue.name,
        courtId: selectedCourt!.id,
        courtName: selectedCourt!.name,
        sport: selectedCourt!.sport,
        date: format(selectedDate, "yyyy-MM-dd"),
        timeSlots: selectedTimeSlots,
        totalAmount: calculateTotal(),
        status: "confirmed",
        userId: user!._id,
      }

      // Store booking in localStorage (in real app, this would be saved to database)
      const existingBookings = JSON.parse(localStorage.getItem("quickcourt_bookings") || "[]")
      existingBookings.push(booking)
      localStorage.setItem("quickcourt_bookings", JSON.stringify(existingBookings))

      toast({
        title: "Booking Confirmed!",
        description: `Your court has been booked for ${format(selectedDate, "MMM dd, yyyy")}`,
      })

      onSuccess()
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const renderSelectStep = () => (
    <div className="space-y-6">
      {/* Court Selection */}
      <div>
        <Label className="text-base font-semibold">Select Court</Label>
        <div className="grid gap-3 mt-3">
          {availableCourts.map((court) => (
            <Card
              key={court.id}
              className={`cursor-pointer transition-colors ${
                selectedCourt?.id === court.id ? "ring-2 ring-green-500 bg-green-50" : "hover:bg-gray-50"
              }`}
              onClick={() => setSelectedCourt(court)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{court.name}</h4>
                    <p className="text-sm text-gray-600">{court.sport}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{court.pricePerHour}/hr</p>
                    <Badge variant="default" className="text-xs">
                      Available
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Date Selection */}
      <div>
        <Label className="text-base font-semibold">Select Date</Label>
        <div className="mt-3">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            disabled={(date) => date < new Date() || date > addDays(new Date(), 30)}
            className="rounded-md border"
          />
        </div>
      </div>

      {/* Time Slot Selection */}
      <div>
        <Label className="text-base font-semibold">Select Time Slots</Label>
        <div className="grid grid-cols-3 gap-2 mt-3">
          {timeSlots.map((timeSlot) => {
            const isSelected = selectedTimeSlots.includes(timeSlot)
            const isBooked = Math.random() > 0.7 // Simulate some slots being booked
            return (
              <Button
                key={timeSlot}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                disabled={isBooked}
                onClick={() => handleTimeSlotToggle(timeSlot)}
                className={`${isBooked ? "opacity-50" : ""}`}
              >
                {timeSlot}
              </Button>
            )
          })}
        </div>
        <p className="text-xs text-gray-500 mt-2">Select multiple slots for longer sessions</p>
      </div>

      {/* Price Summary */}
      {selectedCourt && selectedTimeSlots.length > 0 && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Total Amount</p>
                <p className="text-sm text-gray-600">
                  {selectedTimeSlots.length} slot(s) × ₹{selectedCourt.pricePerHour}
                </p>
              </div>
              <div className="text-2xl font-bold text-green-600">₹{calculateTotal()}</div>
            </div>
          </CardContent>
        </Card>
      )}

      <Button onClick={handleProceedToConfirm} className="w-full" size="lg">
        Proceed to Confirm
      </Button>
    </div>
  )

  const renderConfirmStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Confirm Your Booking</h3>
        <p className="text-gray-600">Please review your booking details</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="font-medium">{venue.name}</p>
              <p className="text-sm text-gray-600">{venue.location}</p>
            </div>
          </div>

          <Separator />

          <div className="flex items-start space-x-3">
            <CalendarIcon className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="font-medium">{format(selectedDate, "EEEE, MMMM dd, yyyy")}</p>
              <p className="text-sm text-gray-600">
                {selectedCourt?.name} - {selectedCourt?.sport}
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex items-start space-x-3">
            <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="font-medium">Time Slots</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedTimeSlots.map((slot) => (
                  <Badge key={slot} variant="secondary" className="text-xs">
                    {slot}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Total Amount</span>
            <span className="text-green-600">₹{calculateTotal()}</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex space-x-3">
        <Button variant="outline" onClick={() => setStep("select")} className="flex-1">
          Back
        </Button>
        <Button onClick={handleProceedToPayment} className="flex-1">
          Proceed to Payment
        </Button>
      </div>
    </div>
  )

  const renderPaymentStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <CreditCard className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Payment Simulation</h3>
        <p className="text-gray-600">This is a demo payment process</p>
      </div>

      <Card className="bg-gray-50">
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Court Booking</span>
              <span>₹{calculateTotal()}</span>
            </div>
            <div className="flex justify-between">
              <span>Platform Fee</span>
              <span>₹0</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes</span>
              <span>₹0</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span className="text-green-600">₹{calculateTotal()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Demo Mode:</strong> This is a simulated payment. No actual transaction will be processed.
        </p>
      </div>

      <div className="flex space-x-3">
        <Button variant="outline" onClick={() => setStep("confirm")} className="flex-1" disabled={isProcessing}>
          Back
        </Button>
        <Button onClick={handleConfirmBooking} className="flex-1" disabled={isProcessing}>
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Confirm & Pay"
          )}
        </Button>
      </div>
    </div>
  )

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === "select" && "Book Your Court"}
            {step === "confirm" && "Confirm Booking"}
            {step === "payment" && "Complete Payment"}
          </DialogTitle>
        </DialogHeader>

        {step === "select" && renderSelectStep()}
        {step === "confirm" && renderConfirmStep()}
        {step === "payment" && renderPaymentStep()}
      </DialogContent>
    </Dialog>
  )
}
