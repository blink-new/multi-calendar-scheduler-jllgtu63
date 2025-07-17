import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback } from './ui/avatar'
import { Separator } from './ui/separator'
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Link2, 
  Edit, 
  Trash2, 
  Send,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { toast } from 'react-hot-toast'

type Meeting = {
  id: string
  title: string
  description?: string
  participants: string[]
  scheduledTime?: string
  duration: number
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled'
  createdAt: string
  userId: string
  timeZone: string
  meetingLink?: string
  location?: string
}

type MeetingDetailsProps = {
  meetingId: string
  onBack: () => void
}

export function MeetingDetails({ meetingId, onBack }: MeetingDetailsProps) {
  const [meeting, setMeeting] = useState<Meeting | null>(null)
  const [loading, setLoading] = useState(true)

  const loadMeetingDetails = useCallback(async () => {
    try {
      // Mock data - in a real app, this would fetch from the database
      const mockMeeting: Meeting = {
        id: meetingId,
        title: 'Weekly Team Sync',
        description: 'Weekly team synchronization meeting to discuss progress, blockers, and upcoming tasks. Please come prepared with your status updates.',
        participants: [
          'john.doe@example.com',
          'jane.smith@example.com',
          'alice.johnson@example.com',
          'bob.wilson@example.com'
        ],
        scheduledTime: '2024-01-22T10:00:00',
        duration: 60,
        status: 'scheduled',
        createdAt: '2024-01-19T09:00:00',
        userId: 'current-user',
        timeZone: 'America/New_York',
        meetingLink: 'https://meet.google.com/abc-defg-hij',
        location: 'Conference Room A / Virtual'
      }
      
      setMeeting(mockMeeting)
    } catch (error) {
      console.error('Failed to load meeting details:', error)
      toast.error('Failed to load meeting details')
    } finally {
      setLoading(false)
    }
  }, [meetingId])

  useEffect(() => {
    loadMeetingDetails()
  }, [loadMeetingDetails])

  const updateMeetingStatus = async (newStatus: Meeting['status']) => {
    if (!meeting) return
    
    try {
      setMeeting(prev => prev ? { ...prev, status: newStatus } : null)
      toast.success(`Meeting ${newStatus}`)
    } catch (error) {
      console.error('Failed to update meeting status:', error)
      toast.error('Failed to update meeting status')
    }
  }

  const copyMeetingLink = () => {
    if (meeting?.meetingLink) {
      navigator.clipboard.writeText(meeting.meetingLink)
      toast.success('Meeting link copied to clipboard')
    }
  }

  const getStatusColor = (status: Meeting['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'scheduled': return 'bg-green-100 text-green-800 border-green-200'
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: Meeting['status']) => {
    switch (status) {
      case 'pending': return <AlertCircle className="w-4 h-4" />
      case 'scheduled': return <CheckCircle className="w-4 h-4" />
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'cancelled': return <XCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    })
  }

  const getInitials = (email: string) => {
    const name = email.split('@')[0]
    return name.split('.').map(part => part[0]).join('').toUpperCase().slice(0, 2)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!meeting) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Meeting not found</h3>
        <p className="text-muted-foreground mb-4">The meeting you're looking for doesn't exist.</p>
        <Button onClick={onBack}>Go Back</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            ← Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{meeting.title}</h1>
            <p className="text-muted-foreground">
              Created on {new Date(meeting.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={`${getStatusColor(meeting.status)} flex items-center gap-1`}>
            {getStatusIcon(meeting.status)}
            {meeting.status}
          </Badge>
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Meeting Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Meeting Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {meeting.description && (
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-muted-foreground">{meeting.description}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Duration</p>
                    <p className="text-sm text-muted-foreground">{meeting.duration} minutes</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Participants</p>
                    <p className="text-sm text-muted-foreground">{meeting.participants.length} people</p>
                  </div>
                </div>

                {meeting.location && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">{meeting.location}</p>
                    </div>
                  </div>
                )}

                {meeting.meetingLink && (
                  <div className="flex items-center space-x-3">
                    <Link2 className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Meeting Link</p>
                      <Button
                        variant="link"
                        className="h-auto p-0 text-sm"
                        onClick={copyMeetingLink}
                      >
                        Copy link
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {meeting.scheduledTime && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Scheduled Time</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDateTime(meeting.scheduledTime)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Participants */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Participants ({meeting.participants.length})
              </CardTitle>
              <CardDescription>
                People invited to this meeting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {meeting.participants.map((participant, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">
                          {getInitials(participant)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{participant}</p>
                        <p className="text-xs text-muted-foreground">
                          {participant.split('@')[0].replace('.', ' ')}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {index === 0 ? 'Organizer' : 'Invited'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {meeting.status === 'pending' && (
                <Button 
                  className="w-full" 
                  onClick={() => updateMeetingStatus('scheduled')}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm Meeting
                </Button>
              )}
              
              {meeting.status === 'scheduled' && (
                <>
                  {meeting.meetingLink && (
                    <Button 
                      className="w-full" 
                      onClick={() => window.open(meeting.meetingLink, '_blank')}
                    >
                      <Link2 className="w-4 h-4 mr-2" />
                      Join Meeting
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => updateMeetingStatus('completed')}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark Complete
                  </Button>
                </>
              )}

              <Button variant="outline" className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Send Reminder
              </Button>

              <Separator />

              <Button 
                variant="outline" 
                className="w-full text-destructive hover:text-destructive"
                onClick={() => updateMeetingStatus('cancelled')}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Cancel Meeting
              </Button>

              <Button 
                variant="outline" 
                className="w-full text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Meeting
              </Button>
            </CardContent>
          </Card>

          {/* Meeting Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-sm">Meeting Created</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(meeting.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {meeting.scheduledTime && (
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-sm">Time Scheduled</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(meeting.scheduledTime).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {meeting.status === 'completed' && (
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-sm">Meeting Completed</p>
                      <p className="text-xs text-muted-foreground">
                        Today
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}