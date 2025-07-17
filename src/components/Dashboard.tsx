import { useState, useEffect } from 'react'
import { blink } from '../blink/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Calendar, Clock, Users, Plus, CheckCircle, AlertCircle } from 'lucide-react'
import { User } from '../types/user'

type Meeting = {
  id: string
  title: string
  participants: string[]
  scheduledTime?: string
  status: 'pending' | 'scheduled' | 'completed'
  createdAt: string
  userId: string
}

type CalendarConnection = {
  id: string
  provider: 'google' | 'microsoft' | 'icloud'
  email: string
  connected: boolean
  lastSync?: string
  userId: string
}

type DashboardProps = {
  user: User
  onMeetingClick?: (meetingId: string) => void
}

export function Dashboard({ user, onMeetingClick }: DashboardProps) {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [connections, setConnections] = useState<CalendarConnection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Enhanced mock data with more realistic scenarios
      const currentDate = new Date()
      const tomorrow = new Date(currentDate)
      tomorrow.setDate(tomorrow.getDate() + 1)
      const nextWeek = new Date(currentDate)
      nextWeek.setDate(nextWeek.getDate() + 7)
      const nextMonth = new Date(currentDate)
      nextMonth.setMonth(nextMonth.getMonth() + 1)
      
      const mockMeetings: Meeting[] = [
        {
          id: '1',
          title: 'Weekly Team Sync',
          participants: ['john.doe@company.com', 'jane.smith@company.com', 'mike.wilson@company.com'],
          scheduledTime: tomorrow.toISOString(),
          status: 'scheduled',
          createdAt: new Date(currentDate.getTime() - 86400000).toISOString(), // Yesterday
          userId: user.id
        },
        {
          id: '2',
          title: 'Project Planning Meeting',
          participants: ['alice.johnson@company.com', 'bob.brown@company.com', 'charlie.davis@company.com'],
          status: 'pending',
          createdAt: new Date(currentDate.getTime() - 3600000).toISOString(), // 1 hour ago
          userId: user.id
        },
        {
          id: '3',
          title: 'Client Presentation',
          participants: ['client@external.com', 'sales@company.com'],
          scheduledTime: nextWeek.toISOString(),
          status: 'scheduled',
          createdAt: new Date(currentDate.getTime() - 172800000).toISOString(), // 2 days ago
          userId: user.id
        },
        {
          id: '4',
          title: 'Quarterly Review',
          participants: ['ceo@company.com', 'cto@company.com', 'hr@company.com'],
          status: 'pending',
          createdAt: new Date(currentDate.getTime() - 7200000).toISOString(), // 2 hours ago
          userId: user.id
        },
        {
          id: '5',
          title: 'Product Demo',
          participants: ['product@company.com', 'demo@client.com', 'support@company.com'],
          scheduledTime: new Date(currentDate.getTime() + 259200000).toISOString(), // 3 days from now
          status: 'scheduled',
          createdAt: new Date(currentDate.getTime() - 43200000).toISOString(), // 12 hours ago
          userId: user.id
        },
        {
          id: '6',
          title: 'Budget Planning Session',
          participants: ['finance@company.com', 'manager@company.com'],
          status: 'pending',
          createdAt: new Date(currentDate.getTime() - 1800000).toISOString(), // 30 minutes ago
          userId: user.id
        }
      ]
      setMeetings(mockMeetings)

      // Enhanced mock calendar connections
      const mockConnections: CalendarConnection[] = [
        {
          id: '1',
          provider: 'google',
          email: user.email || 'user@gmail.com',
          connected: true,
          lastSync: new Date(currentDate.getTime() - 300000).toISOString(), // 5 minutes ago
          userId: user.id
        },
        {
          id: '2',
          provider: 'microsoft',
          email: user.email?.replace('@gmail.com', '@outlook.com') || 'user@outlook.com',
          connected: true,
          lastSync: new Date(currentDate.getTime() - 600000).toISOString(), // 10 minutes ago
          userId: user.id
        }
      ]
      setConnections(mockConnections)
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [user.id, user.email])

  const getStatusColor = (status: Meeting['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'scheduled': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'google': return '📧'
      case 'microsoft': return '📅'
      case 'icloud': return '☁️'
      default: return '📅'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const connectedCalendars = connections.filter(c => c.connected).length
  const pendingMeetings = meetings.filter(m => m.status === 'pending').length
  const scheduledMeetings = meetings.filter(m => m.status === 'scheduled').length

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Connected Calendars</p>
                <p className="text-2xl font-bold">{connectedCalendars}</p>
              </div>
              <Calendar className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Meetings</p>
                <p className="text-2xl font-bold">{pendingMeetings}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Scheduled Meetings</p>
                <p className="text-2xl font-bold">{scheduledMeetings}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Connections Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Calendar Connections
          </CardTitle>
          <CardDescription>
            Connect your calendars to enable smart scheduling
          </CardDescription>
        </CardHeader>
        <CardContent>
          {connections.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No calendars connected yet</p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Connect Your First Calendar
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {connections.map((connection) => (
                <div
                  key={connection.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getProviderIcon(connection.provider)}</span>
                    <div>
                      <p className="font-medium capitalize">{connection.provider}</p>
                      <p className="text-sm text-muted-foreground">{connection.email}</p>
                    </div>
                  </div>
                  <Badge variant={connection.connected ? 'default' : 'secondary'}>
                    {connection.connected ? 'Connected' : 'Disconnected'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Meetings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Recent Meetings
          </CardTitle>
          <CardDescription>
            Your latest meeting scheduling activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          {meetings.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No meetings scheduled yet</p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Schedule Your First Meeting
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {meetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => onMeetingClick?.(meeting.id)}
                >
                  <div className="flex-1">
                    <h3 className="font-medium">{meeting.title}</h3>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {meeting.participants.length} participants
                      </span>
                      {meeting.scheduledTime && (
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {new Date(meeting.scheduledTime).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge className={getStatusColor(meeting.status)}>
                    {meeting.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}