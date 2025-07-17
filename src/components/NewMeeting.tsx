import { useState } from 'react'
import { blink } from '../blink/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Badge } from './ui/badge'
import { Calendar, Clock, Users, Plus, X, Send } from 'lucide-react'
import { toast } from 'react-hot-toast'

type TimeSlot = {
  date: string
  startTime: string
  endTime: string
  available: boolean
  conflicts: string[]
}

export function NewMeeting() {
  const [step, setStep] = useState<'details' | 'participants' | 'scheduling'>('details')
  const [meetingData, setMeetingData] = useState({
    title: '',
    description: '',
    duration: '60',
    participants: [] as string[],
    preferredDates: [] as string[],
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  })
  const [newParticipant, setNewParticipant] = useState('')
  const [suggestedSlots, setSuggestedSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)

  const addParticipant = () => {
    if (newParticipant.trim() && !meetingData.participants.includes(newParticipant.trim())) {
      setMeetingData(prev => ({
        ...prev,
        participants: [...prev.participants, newParticipant.trim()]
      }))
      setNewParticipant('')
    }
  }

  const removeParticipant = (email: string) => {
    setMeetingData(prev => ({
      ...prev,
      participants: prev.participants.filter(p => p !== email)
    }))
  }

  const findAvailableSlots = async () => {
    setLoading(true)
    try {
      // Simulate AI-powered calendar analysis
      toast.loading('Analyzing calendars across all participants...', { duration: 1000 })
      
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Generate more realistic time slots based on current date
      const today = new Date()
      const slots: TimeSlot[] = []
      
      // Generate slots for the next 5 business days
      for (let dayOffset = 1; dayOffset <= 5; dayOffset++) {
        const date = new Date(today)
        date.setDate(date.getDate() + dayOffset)
        
        // Skip weekends
        if (date.getDay() === 0 || date.getDay() === 6) continue
        
        const dateStr = date.toISOString().split('T')[0]
        
        // Generate morning slots (9 AM - 12 PM)
        for (let hour = 9; hour < 12; hour++) {
          const startTime = `${hour.toString().padStart(2, '0')}:00`
          const endHour = hour + Math.floor(parseInt(meetingData.duration) / 60)
          const endMinute = parseInt(meetingData.duration) % 60
          const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`
          
          // Simulate conflicts (30% chance)
          const hasConflict = Math.random() < 0.3
          const conflictedParticipants = hasConflict 
            ? meetingData.participants.slice(0, Math.floor(Math.random() * meetingData.participants.length) + 1)
            : []
          
          slots.push({
            date: dateStr,
            startTime,
            endTime,
            available: !hasConflict,
            conflicts: conflictedParticipants.map(p => `${p} has a calendar conflict`)
          })
        }
        
        // Generate afternoon slots (2 PM - 5 PM)
        for (let hour = 14; hour < 17; hour++) {
          const startTime = `${hour.toString().padStart(2, '0')}:00`
          const endHour = hour + Math.floor(parseInt(meetingData.duration) / 60)
          const endMinute = parseInt(meetingData.duration) % 60
          const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`
          
          // Simulate conflicts (25% chance for afternoon - people prefer mornings)
          const hasConflict = Math.random() < 0.25
          const conflictedParticipants = hasConflict 
            ? meetingData.participants.slice(0, Math.floor(Math.random() * meetingData.participants.length) + 1)
            : []
          
          slots.push({
            date: dateStr,
            startTime,
            endTime,
            available: !hasConflict,
            conflicts: conflictedParticipants.map(p => `${p} has a calendar conflict`)
          })
        }
      }
      
      // Sort by availability (available slots first)
      const sortedSlots = slots.sort((a, b) => {
        if (a.available && !b.available) return -1
        if (!a.available && b.available) return 1
        return 0
      })
      
      setSuggestedSlots(sortedSlots.slice(0, 12)) // Show top 12 suggestions
      setStep('scheduling')
      
      const availableCount = sortedSlots.filter(s => s.available).length
      toast.success(`Found ${availableCount} available time slots!`)
    } catch (error) {
      console.error('Failed to find available slots:', error)
      toast.error('Failed to find available time slots')
    } finally {
      setLoading(false)
    }
  }

  const scheduleMeeting = async (slot: TimeSlot) => {
    setLoading(true)
    try {
      // Simulate comprehensive scheduling process
      toast.loading('Creating calendar invites...', { duration: 800 })
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.loading('Checking for last-minute conflicts...', { duration: 600 })
      await new Promise(resolve => setTimeout(resolve, 800))
      
      toast.loading('Sending notifications to participants...', { duration: 600 })
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Generate meeting link
      const meetingLink = `https://meet.google.com/${Math.random().toString(36).substring(2, 15)}`
      
      // Create meeting object
      const newMeeting = {
        id: Date.now().toString(),
        title: meetingData.title,
        description: meetingData.description,
        participants: meetingData.participants,
        scheduledTime: `${slot.date}T${slot.startTime}:00`,
        duration: parseInt(meetingData.duration),
        status: 'scheduled' as const,
        createdAt: new Date().toISOString(),
        timeZone: meetingData.timeZone,
        meetingLink
      }
      
      // In a real app, this would save to database
      console.log('Meeting created:', newMeeting)
      
      toast.success(`Meeting scheduled for ${new Date(slot.date).toLocaleDateString()} at ${slot.startTime}!`)
      toast.success(`Meeting link: ${meetingLink}`, { duration: 5000 })
      
      // Reset form
      setMeetingData({
        title: '',
        description: '',
        duration: '60',
        participants: [],
        preferredDates: [],
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      })
      setSuggestedSlots([])
      setStep('details')
    } catch (error) {
      console.error('Failed to schedule meeting:', error)
      toast.error('Failed to schedule meeting')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {['details', 'participants', 'scheduling'].map((stepName, index) => (
          <div key={stepName} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === stepName
                  ? 'bg-primary text-primary-foreground'
                  : index < ['details', 'participants', 'scheduling'].indexOf(step)
                  ? 'bg-green-500 text-white'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {index + 1}
            </div>
            <span className="ml-2 text-sm font-medium capitalize">{stepName}</span>
            {index < 2 && <div className="w-8 h-px bg-border ml-4" />}
          </div>
        ))}
      </div>

      {/* Step 1: Meeting Details */}
      {step === 'details' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Meeting Details
            </CardTitle>
            <CardDescription>
              Provide basic information about your meeting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Meeting Title</Label>
              <Input
                id="title"
                placeholder="e.g., Weekly Team Sync"
                value={meetingData.title}
                onChange={(e) => setMeetingData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Meeting agenda or additional details..."
                value={meetingData.description}
                onChange={(e) => setMeetingData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Select
                  value={meetingData.duration}
                  onValueChange={(value) => setMeetingData(prev => ({ ...prev, duration: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Time Zone</Label>
                <Select
                  value={meetingData.timeZone}
                  onValueChange={(value) => setMeetingData(prev => ({ ...prev, timeZone: value }))}
                >
                  <SelectTrigger>
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
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => setStep('participants')}
                disabled={!meetingData.title.trim()}
              >
                Next: Add Participants
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Participants */}
      {step === 'participants' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Add Participants
            </CardTitle>
            <CardDescription>
              Invite people to your meeting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Enter email address"
                value={newParticipant}
                onChange={(e) => setNewParticipant(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addParticipant()}
              />
              <Button onClick={addParticipant} disabled={!newParticipant.trim()}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {meetingData.participants.length > 0 && (
              <div className="space-y-2">
                <Label>Participants ({meetingData.participants.length})</Label>
                <div className="flex flex-wrap gap-2">
                  {meetingData.participants.map((participant) => (
                    <Badge key={participant} variant="secondary" className="flex items-center gap-1">
                      {participant}
                      <button
                        onClick={() => removeParticipant(participant)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('details')}>
                Back
              </Button>
              <Button
                onClick={findAvailableSlots}
                disabled={meetingData.participants.length === 0 || loading}
              >
                {loading ? 'Finding Slots...' : 'Find Available Times'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Scheduling */}
      {step === 'scheduling' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Choose Time Slot
            </CardTitle>
            <CardDescription>
              Select the best time for your meeting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestedSlots.map((slot, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg ${
                    slot.available
                      ? 'border-green-200 bg-green-50 hover:bg-green-100'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">
                        {new Date(slot.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {slot.startTime} - {slot.endTime}
                      </p>
                    </div>
                    {slot.available ? (
                      <Button
                        size="sm"
                        onClick={() => scheduleMeeting(slot)}
                        disabled={loading}
                      >
                        <Send className="w-4 h-4 mr-1" />
                        Schedule
                      </Button>
                    ) : (
                      <Badge variant="destructive">Conflict</Badge>
                    )}
                  </div>
                  {slot.conflicts.length > 0 && (
                    <div className="text-xs text-red-600">
                      {slot.conflicts.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('participants')}>
                Back
              </Button>
              <Button variant="outline" onClick={findAvailableSlots} disabled={loading}>
                Refresh Suggestions
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}