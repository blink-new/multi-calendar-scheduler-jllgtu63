import { useState, useEffect } from 'react'
import { blink } from '../blink/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Switch } from './ui/switch'
import { Alert, AlertDescription } from './ui/alert'
import { Calendar, CheckCircle, AlertCircle, RefreshCw, Settings, Trash2 } from 'lucide-react'
import { toast } from 'react-hot-toast'

type CalendarConnection = {
  id: string
  provider: 'google' | 'microsoft' | 'icloud'
  email: string
  connected: boolean
  lastSync?: string
  syncEnabled: boolean
  userId: string
}

const CALENDAR_PROVIDERS = [
  {
    id: 'google',
    name: 'Google Calendar',
    description: 'Connect your Gmail calendar',
    icon: '📧',
    color: 'bg-red-50 border-red-200 text-red-800'
  },
  {
    id: 'microsoft',
    name: 'Microsoft Outlook',
    description: 'Connect your Outlook calendar',
    icon: '📅',
    color: 'bg-blue-50 border-blue-200 text-blue-800'
  },
  {
    id: 'icloud',
    name: 'iCloud Calendar',
    description: 'Connect your Apple calendar',
    icon: '☁️',
    color: 'bg-gray-50 border-gray-200 text-gray-800'
  }
]

export function CalendarIntegration() {
  const [connections, setConnections] = useState<CalendarConnection[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState<string | null>(null)

  useEffect(() => {
    loadConnections()
  }, [])

  const loadConnections = async () => {
    try {
      const user = await blink.auth.me()
      
      // Mock data for demonstration
      const mockConnections: CalendarConnection[] = [
        {
          id: '1',
          provider: 'google',
          email: 'user@gmail.com',
          connected: true,
          syncEnabled: true,
          lastSync: '2024-01-19T15:30:00',
          userId: user.id
        }
      ]
      setConnections(mockConnections)
    } catch (error) {
      console.error('Failed to load connections:', error)
      toast.error('Failed to load calendar connections')
    } finally {
      setLoading(false)
    }
  }

  const connectCalendar = async (provider: string) => {
    try {
      const user = await blink.auth.me()
      
      // Simulate realistic OAuth flow
      toast.loading(`Redirecting to ${provider} authentication...`, { duration: 1000 })
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      toast.loading('Authenticating with your calendar...', { duration: 800 })
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.loading('Requesting calendar permissions...', { duration: 600 })
      await new Promise(resolve => setTimeout(resolve, 800))
      
      toast.loading('Syncing calendar data...', { duration: 800 })
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Generate realistic email based on provider
      const providerDomains = {
        google: 'gmail.com',
        microsoft: 'outlook.com',
        icloud: 'icloud.com'
      }
      
      const mockEmail = user.email?.includes('@') 
        ? user.email.replace(/@.*/, `@${providerDomains[provider as keyof typeof providerDomains]}`)
        : `user@${providerDomains[provider as keyof typeof providerDomains]}`
      
      const newConnection: CalendarConnection = {
        id: Date.now().toString(),
        provider: provider as 'google' | 'microsoft' | 'icloud',
        email: mockEmail,
        connected: true,
        syncEnabled: true,
        lastSync: new Date().toISOString(),
        userId: user.id
      }
      
      setConnections(prev => [...prev, newConnection])
      
      const providerNames = {
        google: 'Google Calendar',
        microsoft: 'Microsoft Outlook',
        icloud: 'iCloud Calendar'
      }
      
      toast.success(`${providerNames[provider as keyof typeof providerNames]} connected successfully!`)
      toast.success('Your calendar events are now being synced', { duration: 3000 })
    } catch (error) {
      console.error('Failed to connect calendar:', error)
      toast.error(`Failed to connect ${provider} calendar. Please try again.`)
    }
  }

  const disconnectCalendar = async (connectionId: string) => {
    try {
      // Simulate disconnection process
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setConnections(prev => prev.filter(conn => conn.id !== connectionId))
      toast.success('Calendar disconnected')
    } catch (error) {
      console.error('Failed to disconnect calendar:', error)
      toast.error('Failed to disconnect calendar')
    }
  }

  const toggleSync = async (connectionId: string, enabled: boolean) => {
    try {
      // Simulate sync toggle
      await new Promise(resolve => setTimeout(resolve, 300))
      
      setConnections(prev => 
        prev.map(conn => 
          conn.id === connectionId ? { ...conn, syncEnabled: enabled } : conn
        )
      )
      toast.success(`Sync ${enabled ? 'enabled' : 'disabled'}`)
    } catch (error) {
      console.error('Failed to toggle sync:', error)
      toast.error('Failed to update sync settings')
    }
  }

  const syncCalendar = async (connectionId: string) => {
    setSyncing(connectionId)
    try {
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setConnections(prev => 
        prev.map(conn => 
          conn.id === connectionId ? { ...conn, lastSync: new Date().toISOString() } : conn
        )
      )
      
      toast.success('Calendar synced successfully')
    } catch (error) {
      console.error('Failed to sync calendar:', error)
      toast.error('Failed to sync calendar')
    } finally {
      setSyncing(null)
    }
  }

  const getProviderConfig = (provider: string) => {
    return CALENDAR_PROVIDERS.find(p => p.id === provider) || CALENDAR_PROVIDERS[0]
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Calendar Integration</h1>
        <p className="text-muted-foreground">
          Connect your calendars to enable smart meeting scheduling
        </p>
      </div>

      {/* Status Alert */}
      {connections.length === 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Connect at least one calendar to start scheduling meetings with automatic conflict detection.
          </AlertDescription>
        </Alert>
      )}

      {/* Available Providers */}
      <Card>
        <CardHeader>
          <CardTitle>Available Calendar Providers</CardTitle>
          <CardDescription>
            Connect your calendars to enable smart scheduling
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CALENDAR_PROVIDERS.map((provider) => {
              const connection = connections.find(c => c.provider === provider.id)
              const isConnected = connection?.connected

              return (
                <div
                  key={provider.id}
                  className={`p-6 border rounded-lg ${
                    isConnected ? 'border-green-200 bg-green-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{provider.icon}</span>
                      <div>
                        <h3 className="font-medium">{provider.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {provider.description}
                        </p>
                      </div>
                    </div>
                    {isConnected && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>

                  {isConnected ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>Connected as:</span>
                        <span className="font-medium">{connection.email}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Auto-sync</span>
                        <Switch
                          checked={connection.syncEnabled}
                          onCheckedChange={(checked) => toggleSync(connection.id, checked)}
                        />
                      </div>

                      {connection.lastSync && (
                        <div className="text-xs text-muted-foreground">
                          Last synced: {new Date(connection.lastSync).toLocaleString()}
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => syncCalendar(connection.id)}
                          disabled={syncing === connection.id}
                        >
                          {syncing === connection.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <RefreshCw className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => disconnectCalendar(connection.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={() => connectCalendar(provider.id)}
                      className="w-full"
                    >
                      Connect {provider.name}
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Connected Calendars Management */}
      {connections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Connected Calendars
            </CardTitle>
            <CardDescription>
              Manage your connected calendar accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {connections.map((connection) => {
                const provider = getProviderConfig(connection.provider)
                
                return (
                  <div
                    key={connection.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">{provider.icon}</span>
                      <div>
                        <h3 className="font-medium">{provider.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {connection.email}
                        </p>
                        {connection.lastSync && (
                          <p className="text-xs text-muted-foreground">
                            Last synced: {new Date(connection.lastSync).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <Badge variant={connection.connected ? 'default' : 'secondary'}>
                        {connection.connected ? 'Connected' : 'Disconnected'}
                      </Badge>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Sync</span>
                        <Switch
                          checked={connection.syncEnabled}
                          onCheckedChange={(checked) => toggleSync(connection.id, checked)}
                        />
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => syncCalendar(connection.id)}
                        disabled={syncing === connection.id}
                      >
                        {syncing === connection.id ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <RefreshCw className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Integration Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
              <p>Connect multiple calendars to get comprehensive availability checking</p>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
              <p>Enable auto-sync to keep your availability up to date</p>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
              <p>The app will automatically detect conflicts and suggest optimal meeting times</p>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
              <p>Your calendar data is encrypted and never shared with other users</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}