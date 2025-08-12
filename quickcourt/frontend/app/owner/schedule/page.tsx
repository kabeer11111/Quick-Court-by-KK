"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Clock, Ban, CheckCircle, AlertTriangle } from "lucide-react"

// Mock data for courts
const courts = [
  { id: 1, name: "Court A", sport: "Badminton", status: "active" },
  { id: 2, name: "Court B", sport: "Badminton", status: "active" },
  { id: 3, name: "Tennis Court 1", sport: "Tennis", status: "active" },
  { id: 4, name: "Basketball Court", sport: "Basketball", status: "maintenance" },
]

// Mock data for time slots
const timeSlots = [
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
]

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedCourt, setSelectedCourt] = useState<string>("all")
  const [blockDialogOpen, setBlockDialogOpen] = useState(false)
  const [blockReason, setBlockReason] = useState("")
  const [blockStartTime, setBlockStartTime] = useState("")
  const [blockEndTime, setBlockEndTime] = useState("")

  // Mock schedule data
  const [schedule, setSchedule] = useState({
    "2024-01-15": {
      "1": {
        "09:00": { status: "booked", customer: "John Doe" },
        "10:00": { status: "booked", customer: "Jane Smith" },
        "14:00": { status: "blocked", reason: "Maintenance" },
        "15:00": { status: "blocked", reason: "Maintenance" },
      },
      "2": {
        "11:00": { status: "booked", customer: "Mike Johnson" },
        "16:00": { status: "booked", customer: "Sarah Wilson" },
      },
    },
  })

  const getSlotStatus = (courtId: string, time: string) => {
    const dateKey = selectedDate?.toISOString().split("T")[0]
    if (!dateKey || !schedule[dateKey] || !schedule[dateKey][courtId]) {
      return { status: "available" }
    }
    return schedule[dateKey][courtId][time] || { status: "available" }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "booked":
        return "bg-red-100 text-red-800 border-red-200"
      case "blocked":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "available":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "booked":
        return <AlertTriangle className="h-3 w-3" />
      case "blocked":
        return <Ban className="h-3 w-3" />
      case "available":
        return <CheckCircle className="h-3 w-3" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  const handleBlockTimeSlot = () => {
    // Implementation for blocking time slots
    console.log("Blocking time slot:", { blockStartTime, blockEndTime, blockReason })
    setBlockDialogOpen(false)
    setBlockReason("")
    setBlockStartTime("")
    setBlockEndTime("")
  }

  const filteredCourts =
    selectedCourt === "all" ? courts : courts.filter((court) => court.id.toString() === selectedCourt)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Schedule Management</h1>
        <p className="text-gray-600">Manage court availability and block time slots for maintenance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Date</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="court-filter">Court</Label>
                <Select value={selectedCourt} onValueChange={setSelectedCourt}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select court" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courts</SelectItem>
                    {courts.map((court) => (
                      <SelectItem key={court.id} value={court.id.toString()}>
                        {court.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Dialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <Ban className="h-4 w-4 mr-2" />
                    Block Time Slot
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Block Time Slot</DialogTitle>
                    <DialogDescription>Block time slots for maintenance or other reasons</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="start-time">Start Time</Label>
                        <Select value={blockStartTime} onValueChange={setBlockStartTime}>
                          <SelectTrigger>
                            <SelectValue placeholder="Start time" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="end-time">End Time</Label>
                        <Select value={blockEndTime} onValueChange={setBlockEndTime}>
                          <SelectTrigger>
                            <SelectValue placeholder="End time" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="reason">Reason</Label>
                      <Textarea
                        id="reason"
                        placeholder="Enter reason for blocking..."
                        value={blockReason}
                        onChange={(e) => setBlockReason(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setBlockDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleBlockTimeSlot}>Block Time Slot</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        {/* Schedule Grid */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Schedule for {selectedDate?.toLocaleDateString()}
              </CardTitle>
              <CardDescription>Manage court availability and view bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {filteredCourts.map((court) => (
                  <div key={court.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{court.name}</h3>
                        <p className="text-sm text-gray-600">{court.sport}</p>
                      </div>
                      <Badge variant={court.status === "active" ? "default" : "secondary"}>{court.status}</Badge>
                    </div>

                    <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
                      {timeSlots.map((time) => {
                        const slot = getSlotStatus(court.id.toString(), time)
                        return (
                          <div
                            key={time}
                            className={`p-2 rounded-md border text-xs text-center cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(slot.status)}`}
                            title={slot.customer || slot.reason || "Available"}
                          >
                            <div className="flex items-center justify-center mb-1">{getStatusIcon(slot.status)}</div>
                            <div className="font-medium">{time}</div>
                            {slot.status === "booked" && <div className="text-xs mt-1 truncate">{slot.customer}</div>}
                            {slot.status === "blocked" && <div className="text-xs mt-1 truncate">{slot.reason}</div>}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {filteredCourts.length === 0 && (
                <div className="text-center py-8 text-gray-500">No courts found matching your criteria</div>
              )}
            </CardContent>
          </Card>

          {/* Legend */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Legend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-100 border border-green-200"></div>
                  <span className="text-sm">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-100 border border-red-200"></div>
                  <span className="text-sm">Booked</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-yellow-100 border border-yellow-200"></div>
                  <span className="text-sm">Blocked/Maintenance</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
