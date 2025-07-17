import { useState, useEffect, useCallback } from 'react'
import { blink } from '../blink/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Calendar, Clock, Users, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'
import { toast } from 'react-hot-toast'

type TimeSlot = {
  time: string
  available: boolean
  conflicts: string[]
  participants: string[]
}

type DayAvailability = {
  date: string
  dayName: string
  slots: TimeSlot[]
}

type AvailabilityViewProps = {
  participants: string[]
  duration: number
  onTimeSlotSelect: (date: string, time: string) => void
}

export function AvailabilityView({ participants, duration, onTimeSlotSelect }: AvailabilityViewProps) {
  const [availability, setAvailability] = useState<DayAvailability[]>([])
  const [loading, setLoading] = useState(true)
  const [currentWeek, setCurrentWeek] = useState(0)
  const [selectedTimeZone, setSelectedTimeZone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  )

  const generateMockAvailability = useCallback((): DayAvailability[] => {
    const days: DayAvailability[] = []
    const startDate = new Date()
    startDate.setDate(startDate.getDate() + (currentWeek * 7))
    
    // Generate 7 days of availability
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)
      
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
      const dateStr = date.toISOString().split('T')[0]
      
      // Skip weekends for business hours
      const isWeekend = date.getDay() === 0 || date.getDay() === 6
      
      const slots: TimeSlot[] = []
      
      if (!isWeekend) {
        // Generate time slots from 9 AM to 5 PM
        for (let hour = 9; hour < 17; hour++) {
          for (let minute = 0; minute < 60; minute += 30) {
            const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
            
            // Simulate conflicts and availability
            const hasConflict = Math.random() < 0.3 // 30% chance of conflict
            const conflictedParticipants = hasConflict 
              ? participants.slice(0, Math.floor(Math.random() * participants.length) + 1)
              : []
            
            slots.push({
              time,
              available: !hasConflict,
              conflicts: conflictedParticipants.map(p => `${p} has a conflict`),
              participants: hasConflict ? conflictedParticipants : []
            })
          }
        }
      }
      
      days.push({
        date: dateStr,
        dayName,
        slots
      })
    }
    
    return days
  }, [participants, currentWeek])

  const loadAvailability = useCallback(async () => {
    setLoading(true)
    try {
      // Simulate API call to check availability across calendars
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockAvailability = generateMockAvailability()
      setAvailability(mockAvailability)
    } catch (error) {
      console.error('Failed to load availability:', error)
      toast.error('Failed to load availability data')
    } finally {
      setLoading(false)
    }
  }, [generateMockAvailability])

  useEffect(() => {
    loadAvailability()
  }, [loadAvailability])

  const handleTimeSlotClick = (date: string, time: string, available: boolean) => {
    if (!available) {
      toast.error('This time slot has conflicts')
      return
    }
    
    onTimeSlotSelect(date, time)
    toast.success(`Selected ${new Date(date).toLocaleDateString()} at ${time}`)
  }

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeek(prev => direction === 'prev' ? prev - 1 : prev + 1)
  }

  const getWeekRange = () => {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() + (currentWeek * 7))
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 6)
    
    return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
  }

  const getAvailableSlotCount = () => {
    return availability.reduce((total, day) => {
      return total + day.slots.filter(slot => slot.available).length
    }, 0)
  }

  const getBusySlotCount = () => {
    return availability.reduce((total, day) => {
      return total + day.slots.filter(slot => !slot.available).length
    }, 0)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Availability Overview
          </CardTitle>
          <CardDescription>
            Finding optimal meeting times for {participants.length} participants
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Analyzing calendar availability...</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Availability Overview
              </CardTitle>
              <CardDescription>
                {duration} minute meeting for {participants.length} participants
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={selectedTimeZone} onValueChange={setSelectedTimeZone}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/New_York">Eastern Time</SelectItem>
                  <SelectItem value="America/Chicago">Central Time</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={loadAvailability}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-sm">Available ({getAvailableSlotCount()})</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span className="text-sm">Busy ({getBusySlotCount()})</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-300 rounded"></div>
                <span className="text-sm">Outside hours</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium min-w-[200px] text-center">
                {getWeekRange()}
              </span>
              <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Availability Grid */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-8 gap-2">
            {/* Time column header */}
            <div className="text-sm font-medium text-muted-foreground py-2">
              Time
            </div>
            
            {/* Day headers */}
            {availability.map((day) => (
              <div key={day.date} className="text-center">
                <div className="text-sm font-medium">{day.dayName}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(day.date).getDate()}
                </div>
              </div>
            ))}

            {/* Time slots grid */}
            {Array.from({ length: 16 }, (_, hourIndex) => {
              const hour = 9 + Math.floor(hourIndex / 2)
              const minute = (hourIndex % 2) * 30
              const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
              
              return (
                <div key={timeStr} className="contents">
                  {/* Time label */}
                  <div className="text-xs text-muted-foreground py-1 pr-2 text-right">
                    {timeStr}
                  </div>
                  
                  {/* Slots for each day */}
                  {availability.map((day) => {
                    const slot = day.slots.find(s => s.time === timeStr)
                    const isWeekend = new Date(day.date).getDay() === 0 || new Date(day.date).getDay() === 6
                    
                    if (isWeekend || !slot) {
                      return (
                        <div
                          key={`${day.date}-${timeStr}`}
                          className="h-8 bg-gray-100 rounded border"
                        />
                      )
                    }
                    
                    return (
                      <button
                        key={`${day.date}-${timeStr}`}
                        onClick={() => handleTimeSlotClick(day.date, timeStr, slot.available)}
                        className={`h-8 rounded border transition-colors ${
                          slot.available
                            ? 'bg-green-100 hover:bg-green-200 border-green-300 cursor-pointer'
                            : 'bg-red-100 border-red-300 cursor-not-allowed'
                        }`}
                        title={
                          slot.available
                            ? `Available at ${timeStr}`
                            : `Conflicts: ${slot.conflicts.join(', ')}`
                        }
                      />
                    )
                  })}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Participants Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Participant Availability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {participants.map((participant, index) => {
              // Mock availability percentage
              const availabilityPercent = Math.floor(Math.random() * 40) + 60 // 60-100%
              
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium">
                        {participant.split('@')[0].slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{participant}</p>
                      <p className="text-xs text-muted-foreground">
                        {availabilityPercent}% available this week
                      </p>
                    </div>
                  </div>
                  <Badge variant={availabilityPercent > 80 ? 'default' : 'secondary'}>
                    {availabilityPercent > 80 ? 'Highly Available' : 'Limited Availability'}
                  </Badge>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button variant="outline" className="justify-start">
              <Calendar className="w-4 h-4 mr-2" />
              Find Next Available
            </Button>
            <Button variant="outline" className="justify-start">
              <Users className="w-4 h-4 mr-2" />
              Suggest Alternatives
            </Button>
            <Button variant="outline" className="justify-start">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Calendars
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}