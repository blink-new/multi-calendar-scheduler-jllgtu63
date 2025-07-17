import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Badge } from './ui/badge'
import { Alert, AlertDescription } from './ui/alert'
import { Bot, Users, Clock, Send, Copy, CheckCircle, AlertCircle, Plus, X, Mail } from 'lucide-react'
import { User } from '../types/user'
import { MeetingBot as MeetingBotType } from '../types/meeting'
import { canAccessFeature } from '../types/pricing'
import { toast } from 'react-hot-toast'

interface MeetingBotProps {
  user: User
}

export function MeetingBot({ user }: MeetingBotProps) {
  const [bots, setBots] = useState<MeetingBotType[]>([])
  const [loading, setLoading] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '60',
    participantEmails: [] as string[],
    autoSchedule: true
  })
  const [newEmail, setNewEmail] = useState('')

  const canUseMeetingBot = canAccessFeature(user.pricingTier, 'professional')

  useEffect(() => {
    const loadData = async () => {
      try {
        // Mock data for demonstration
        const mockBots: MeetingBotType[] = [
          {
            id: '1',
            meetingId: 'meeting_1',
            createdBy: user.id,
            participantEmails: ['john@company.com', 'jane@client.com', 'mike@company.com'],
            permissionLink: 'https://schedulr.app/bot/abc123',
            status: 'collecting_permissions',
            permissionsGranted: ['john@company.com'],
            remindersSent: 1,
            lastReminderSent: new Date(Date.now() - 3600000).toISOString(),
            autoScheduleEnabled: true,
            createdAt: new Date(Date.now() - 7200000).toISOString(),
            updatedAt: new Date(Date.now() - 3600000).toISOString()
          },
          {
            id: '2',
            meetingId: 'meeting_2',
            createdBy: user.id,
            participantEmails: ['alice@startup.com', 'bob@investor.com'],
            permissionLink: 'https://schedulr.app/bot/def456',
            status: 'scheduled',
            permissionsGranted: ['alice@startup.com', 'bob@investor.com'],
            remindersSent: 2,
            autoScheduleEnabled: true,
            scheduledSlot: {
              date: '2024-01-25',
              startTime: '14:00',
              endTime: '15:00',
              available: true,
              conflicts: []
            },
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date(Date.now() - 1800000).toISOString()
          }
        ]
        setBots(mockBots)
      } catch (error) {
        console.error('Failed to load meeting bots:', error)
        toast.error('Failed to load meeting bots')
      }
    }

    if (canUseMeetingBot) {
      loadData()
    }
  }, [canUseMeetingBot, user.id])

  const loadMeetingBots = async () => {
    try {
      // Mock data for demonstration
      const mockBots: MeetingBotType[] = [
        {
          id: '1',
          meetingId: 'meeting_1',
          createdBy: user.id,
          participantEmails: ['john@company.com', 'jane@client.com', 'mike@company.com'],
          permissionLink: 'https://schedulr.app/bot/abc123',
          status: 'collecting_permissions',
          permissionsGranted: ['john@company.com'],
          remindersSent: 1,
          lastReminderSent: new Date(Date.now() - 3600000).toISOString(),
          autoScheduleEnabled: true,
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          updatedAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: '2',
          meetingId: 'meeting_2',
          createdBy: user.id,
          participantEmails: ['alice@startup.com', 'bob@investor.com'],
          permissionLink: 'https://schedulr.app/bot/def456',
          status: 'scheduled',
          permissionsGranted: ['alice@startup.com', 'bob@investor.com'],
          remindersSent: 2,
          autoScheduleEnabled: true,
          scheduledSlot: {
            date: '2024-01-25',
            startTime: '14:00',
            endTime: '15:00',
            available: true,
            conflicts: []
          },
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 1800000).toISOString()
        }
      ]
      setBots(mockBots)
    } catch (error) {
      console.error('Failed to load meeting bots:', error)
      toast.error('Failed to load meeting bots')
    }
  }

  const addParticipantEmail = () => {
    if (newEmail.trim() && !formData.participantEmails.includes(newEmail.trim())) {
      setFormData(prev => ({
        ...prev,
        participantEmails: [...prev.participantEmails, newEmail.trim()]
      }))
      setNewEmail('')
    }
  }

  const removeParticipantEmail = (email: string) => {
    setFormData(prev => ({
      ...prev,
      participantEmails: prev.participantEmails.filter(e => e !== email)
    }))
  }

  const createMeetingBot = async () => {
    if (!formData.title.trim() || formData.participantEmails.length === 0) {
      toast.error('Please provide a meeting title and at least one participant')
      return
    }

    setLoading(true)
    try {
      // Simulate bot creation process
      toast.loading('Creating meeting bot...', { duration: 800 })
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.loading('Generating permission links...', { duration: 600 })
      await new Promise(resolve => setTimeout(resolve, 800))
      
      toast.loading('Sending invitations...', { duration: 600 })
      await new Promise(resolve => setTimeout(resolve, 800))

      const newBot: MeetingBotType = {
        id: Date.now().toString(),
        meetingId: `meeting_${Date.now()}`,
        createdBy: user.id,
        participantEmails: formData.participantEmails,
        permissionLink: `https://schedulr.app/bot/${Math.random().toString(36).substring(2, 15)}`,
        status: 'collecting_permissions',
        permissionsGranted: [],
        remindersSent: 0,
        autoScheduleEnabled: formData.autoSchedule,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      setBots(prev => [newBot, ...prev])
      setShowCreateForm(false)
      setFormData({
        title: '',
        description: '',
        duration: '60',
        participantEmails: [],
        autoSchedule: true
      })

      toast.success('Meeting bot created! Invitations sent to all participants.')
      toast.success(`Permission link: ${newBot.permissionLink}`, { duration: 5000 })
    } catch (error) {
      console.error('Failed to create meeting bot:', error)
      toast.error('Failed to create meeting bot')
    } finally {
      setLoading(false)
    }
  }

  const copyPermissionLink = (link: string) => {
    navigator.clipboard.writeText(link)
    toast.success('Permission link copied to clipboard!')
  }

  const sendReminder = async (botId: string) => {
    try {
      toast.loading('Sending reminder emails...', { duration: 1000 })
      await new Promise(resolve => setTimeout(resolve, 1200))

      setBots(prev => prev.map(bot => 
        bot.id === botId 
          ? { 
              ...bot, 
              remindersSent: bot.remindersSent + 1,
              lastReminderSent: new Date().toISOString()
            }
          : bot
      ))

      toast.success('Reminder emails sent to pending participants!')
    } catch (error) {
      console.error('Failed to send reminders:', error)
      toast.error('Failed to send reminders')
    }
  }

  const getStatusColor = (status: MeetingBotType['status']) => {
    switch (status) {
      case 'collecting_permissions': return 'bg-yellow-100 text-yellow-800'
      case 'ready_to_schedule': return 'bg-blue-100 text-blue-800'
      case 'scheduled': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: MeetingBotType['status']) => {
    switch (status) {
      case 'collecting_permissions': return <Clock className="w-4 h-4" />
      case 'ready_to_schedule': return <Bot className="w-4 h-4" />
      case 'scheduled': return <CheckCircle className="w-4 h-4" />
      case 'failed': return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  if (!canUseMeetingBot) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Meeting Bot</h1>
          <p className="text-muted-foreground">
            Automate meeting scheduling with AI-powered coordination
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <Bot className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Meeting Bot is a Professional Feature</h3>
                <p className="text-muted-foreground mt-2">
                  Upgrade to Professional to access our AI-powered meeting scheduling bot that automatically 
                  collects permissions and finds the perfect time for all participants.
                </p>
              </div>
              <Button className="mt-4">
                Upgrade to Professional
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="w-8 h-8 text-primary" />
            Meeting Bot
          </h1>
          <p className="text-muted-foreground">
            Automate meeting scheduling with AI-powered coordination
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Meeting Bot
        </Button>
      </div>

      {/* How it Works */}
      <Card>
        <CardHeader>
          <CardTitle>How Meeting Bot Works</CardTitle>
          <CardDescription>
            Automate the entire scheduling process for multi-party meetings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center space-y-2">
              <div className="mx-auto w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">1</span>
              </div>
              <h4 className="font-medium">Add Participants</h4>
              <p className="text-sm text-muted-foreground">Enter email addresses of all meeting participants</p>
            </div>
            <div className="text-center space-y-2">
              <div className="mx-auto w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">2</span>
              </div>
              <h4 className="font-medium">Send Permissions</h4>
              <p className="text-sm text-muted-foreground">Bot sends permission links to all participants</p>
            </div>
            <div className="text-center space-y-2">
              <div className="mx-auto w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">3</span>
              </div>
              <h4 className="font-medium">Collect Access</h4>
              <p className="text-sm text-muted-foreground">Participants grant calendar access via secure link</p>
            </div>
            <div className="text-center space-y-2">
              <div className="mx-auto w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">4</span>
              </div>
              <h4 className="font-medium">Auto Schedule</h4>
              <p className="text-sm text-muted-foreground">Bot finds optimal time and schedules automatically</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Meeting Bot</CardTitle>
            <CardDescription>
              Set up automated scheduling for your multi-party meeting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Meeting Title</Label>
              <Input
                id="title"
                placeholder="e.g., Q1 Planning Session"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Meeting agenda or additional details..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Participant Emails</Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter email address"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addParticipantEmail()}
                />
                <Button onClick={addParticipantEmail} disabled={!newEmail.trim()}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              {formData.participantEmails.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.participantEmails.map((email) => (
                    <Badge key={email} variant="secondary" className="flex items-center gap-1">
                      {email}
                      <button
                        onClick={() => removeParticipantEmail(email)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Alert>
              <Bot className="h-4 w-4" />
              <AlertDescription>
                The bot will automatically send permission requests to all participants and schedule the meeting 
                once everyone has granted calendar access.
              </AlertDescription>
            </Alert>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
              <Button onClick={createMeetingBot} disabled={loading}>
                {loading ? 'Creating...' : 'Create Meeting Bot'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Bots */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Active Meeting Bots</h2>
        
        {bots.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <Bot className="w-12 h-12 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="font-medium">No Meeting Bots Yet</h3>
                  <p className="text-muted-foreground text-sm">
                    Create your first meeting bot to automate scheduling
                  </p>
                </div>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Meeting Bot
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bots.map((bot) => (
              <Card key={bot.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(bot.status)}>
                          {getStatusIcon(bot.status)}
                          <span className="ml-1 capitalize">{bot.status.replace('_', ' ')}</span>
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Created {new Date(bot.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-medium">Meeting Bot #{bot.id}</h3>
                        <p className="text-sm text-muted-foreground">
                          {bot.participantEmails.length} participants • {bot.permissionsGranted.length} permissions granted
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">Participants:</span>
                        </div>
                        <div className="flex flex-wrap gap-2 ml-6">
                          {bot.participantEmails.map((email) => (
                            <Badge 
                              key={email} 
                              variant={bot.permissionsGranted.includes(email) ? 'default' : 'outline'}
                            >
                              {email}
                              {bot.permissionsGranted.includes(email) && (
                                <CheckCircle className="w-3 h-3 ml-1" />
                              )}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {bot.scheduledSlot && (
                        <div className="p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="font-medium text-green-800">Meeting Scheduled</span>
                          </div>
                          <p className="text-sm text-green-700 mt-1">
                            {new Date(bot.scheduledSlot.date).toLocaleDateString()} at {bot.scheduledSlot.startTime}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <span>{bot.remindersSent} reminder{bot.remindersSent !== 1 ? 's' : ''} sent</span>
                        {bot.lastReminderSent && (
                          <span>• Last: {new Date(bot.lastReminderSent).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyPermissionLink(bot.permissionLink)}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Link
                      </Button>
                      
                      {bot.status === 'collecting_permissions' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => sendReminder(bot.id)}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Send Reminder
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}