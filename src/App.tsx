import { useState, useEffect } from 'react'
import { blink } from './blink/client'
import { Dashboard } from './components/Dashboard'
import { NewMeeting } from './components/NewMeeting'
import { CalendarIntegration } from './components/CalendarIntegration'
import { AvailabilityView } from './components/AvailabilityView'
import { MeetingDetails } from './components/MeetingDetails'
import { PricingPage } from './components/PricingPage'
import { EventTypes } from './components/EventTypes'
import { TeamManagement } from './components/TeamManagement'
import { Analytics } from './components/Analytics'
import { Integrations } from './components/Integrations'
import { MeetingBot } from './components/MeetingBot'
import { Button } from './components/ui/button'
import { Card, CardContent } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Calendar, Users, Settings, Plus, Crown, Bot, BarChart3, Puzzle, UserCheck } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { User } from './types/user'
import { PricingTier, getPlanByTier } from './types/pricing'

type View = 'dashboard' | 'new-meeting' | 'calendar-integration' | 'availability' | 'meeting-details' | 'pricing' | 'event-types' | 'team' | 'analytics' | 'integrations' | 'meeting-bot'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState<View>('dashboard')
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      if (state.user) {
        // Mock user with subscription data - in real app this would come from database
        const mockUser: User = {
          id: state.user.id,
          email: state.user.email || '',
          displayName: state.user.displayName,
          pricingTier: 'basic', // Default to basic plan
          subscriptionStatus: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        setUser(mockUser)
      } else {
        setUser(null)
      }
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold">Schedulr</h1>
                <p className="text-muted-foreground mt-2">
                  The ultimate scheduling platform with AI-powered meeting coordination
                </p>
              </div>
              <Button onClick={() => blink.auth.login()} className="w-full">
                Sign In to Get Started
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-8 h-8 text-primary" />
                <h1 className="text-xl font-semibold">Schedulr</h1>
              </div>
              <nav className="hidden lg:flex space-x-1">
                <Button
                  variant={currentView === 'dashboard' ? 'default' : 'ghost'}
                  onClick={() => setCurrentView('dashboard')}
                  size="sm"
                >
                  Dashboard
                </Button>
                <Button
                  variant={currentView === 'new-meeting' ? 'default' : 'ghost'}
                  onClick={() => setCurrentView('new-meeting')}
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Meeting
                </Button>
                <Button
                  variant={currentView === 'event-types' ? 'default' : 'ghost'}
                  onClick={() => setCurrentView('event-types')}
                  size="sm"
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  Event Types
                </Button>
                <Button
                  variant={currentView === 'meeting-bot' ? 'default' : 'ghost'}
                  onClick={() => setCurrentView('meeting-bot')}
                  size="sm"
                >
                  <Bot className="w-4 h-4 mr-2" />
                  Meeting Bot
                </Button>
                <Button
                  variant={currentView === 'calendar-integration' ? 'default' : 'ghost'}
                  onClick={() => setCurrentView('calendar-integration')}
                  size="sm"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Calendars
                </Button>
                <Button
                  variant={currentView === 'availability' ? 'default' : 'ghost'}
                  onClick={() => setCurrentView('availability')}
                  size="sm"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Availability
                </Button>
                <Button
                  variant={currentView === 'analytics' ? 'default' : 'ghost'}
                  onClick={() => setCurrentView('analytics')}
                  size="sm"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
                <Button
                  variant={currentView === 'integrations' ? 'default' : 'ghost'}
                  onClick={() => setCurrentView('integrations')}
                  size="sm"
                >
                  <Puzzle className="w-4 h-4 mr-2" />
                  Integrations
                </Button>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Badge variant={user.pricingTier === 'professional' ? 'default' : user.pricingTier === 'advanced' ? 'secondary' : 'outline'}>
                  {getPlanByTier(user.pricingTier).name}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentView('pricing')}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade
                </Button>
              </div>
              <span className="text-sm text-muted-foreground">
                {user.displayName || user.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => blink.auth.logout()}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && (
          <Dashboard 
            user={user}
            onMeetingClick={(meetingId) => {
              setSelectedMeetingId(meetingId)
              setCurrentView('meeting-details')
            }}
          />
        )}
        {currentView === 'new-meeting' && <NewMeeting user={user} />}
        {currentView === 'event-types' && <EventTypes user={user} />}
        {currentView === 'meeting-bot' && <MeetingBot user={user} />}
        {currentView === 'calendar-integration' && <CalendarIntegration user={user} />}
        {currentView === 'availability' && (
          <AvailabilityView 
            user={user}
            participants={['user@example.com']}
            duration={60}
            onTimeSlotSelect={(date, time) => {
              toast.success(`Selected ${date} at ${time}`)
            }}
          />
        )}
        {currentView === 'analytics' && <Analytics user={user} />}
        {currentView === 'integrations' && <Integrations user={user} />}
        {currentView === 'team' && <TeamManagement user={user} />}
        {currentView === 'pricing' && (
          <PricingPage 
            user={user}
            onPlanSelected={(tier) => {
              // Update user tier - in real app this would update database
              setUser(prev => prev ? { ...prev, pricingTier: tier } : null)
              setCurrentView('dashboard')
              toast.success(`Upgraded to ${getPlanByTier(tier).name} plan!`)
            }}
          />
        )}
        {currentView === 'meeting-details' && selectedMeetingId && (
          <MeetingDetails 
            meetingId={selectedMeetingId}
            user={user}
            onBack={() => setCurrentView('dashboard')}
          />
        )}
      </main>
    </div>
  )
}

export default App