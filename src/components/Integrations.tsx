import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Switch } from './ui/switch'
import { Puzzle, Video, Users, Mail, Zap, CheckCircle } from 'lucide-react'
import { User } from '../types/user'
import { canAccessFeature } from '../types/pricing'
import { toast } from 'react-hot-toast'

interface IntegrationsProps {
  user: User
}

export function Integrations({ user }: IntegrationsProps) {
  const [connectedIntegrations, setConnectedIntegrations] = useState<string[]>(['zoom'])
  const canUseIntegrations = canAccessFeature(user.pricingTier, 'professional')

  const integrations = [
    {
      id: 'zoom',
      name: 'Zoom',
      description: 'Video conferencing for meetings',
      icon: <Video className="w-6 h-6" />,
      category: 'Video Conferencing',
      requiredPlan: 'advanced'
    },
    {
      id: 'teams',
      name: 'Microsoft Teams',
      description: 'Enterprise video meetings',
      icon: <Video className="w-6 h-6" />,
      category: 'Video Conferencing',
      requiredPlan: 'advanced'
    },
    {
      id: 'google-meet',
      name: 'Google Meet',
      description: 'Google video conferencing',
      icon: <Video className="w-6 h-6" />,
      category: 'Video Conferencing',
      requiredPlan: 'advanced'
    },
    {
      id: 'salesforce',
      name: 'Salesforce',
      description: 'CRM integration for lead management',
      icon: <Users className="w-6 h-6" />,
      category: 'CRM',
      requiredPlan: 'professional'
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      description: 'Marketing and sales CRM',
      icon: <Users className="w-6 h-6" />,
      category: 'CRM',
      requiredPlan: 'professional'
    },
    {
      id: 'mailchimp',
      name: 'Mailchimp',
      description: 'Email marketing automation',
      icon: <Mail className="w-6 h-6" />,
      category: 'Marketing',
      requiredPlan: 'professional'
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Connect with 1000+ apps',
      icon: <Zap className="w-6 h-6" />,
      category: 'Automation',
      requiredPlan: 'professional'
    }
  ]

  const toggleIntegration = async (integrationId: string) => {
    if (!canUseIntegrations) {
      toast.error('Upgrade to Professional to use integrations')
      return
    }

    const isConnected = connectedIntegrations.includes(integrationId)
    
    if (isConnected) {
      setConnectedIntegrations(prev => prev.filter(id => id !== integrationId))
      toast.success('Integration disconnected')
    } else {
      // Simulate connection process
      toast.loading('Connecting integration...', { duration: 1000 })
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      setConnectedIntegrations(prev => [...prev, integrationId])
      toast.success('Integration connected successfully!')
    }
  }

  const groupedIntegrations = integrations.reduce((acc, integration) => {
    if (!acc[integration.category]) {
      acc[integration.category] = []
    }
    acc[integration.category].push(integration)
    return acc
  }, {} as Record<string, typeof integrations>)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Puzzle className="w-8 h-8 text-primary" />
          Integrations
        </h1>
        <p className="text-muted-foreground">
          Connect Schedulr with your favorite tools and services
        </p>
      </div>

      {!canUseIntegrations && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <Puzzle className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Integrations are a Professional Feature</h3>
                <p className="text-muted-foreground mt-2">
                  Upgrade to Professional to connect with video conferencing, CRM, and automation tools.
                </p>
              </div>
              <Button>
                Upgrade to Professional
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Integration Categories */}
      {Object.entries(groupedIntegrations).map(([category, categoryIntegrations]) => (
        <div key={category} className="space-y-4">
          <h2 className="text-xl font-semibold">{category}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryIntegrations.map((integration) => {
              const isConnected = connectedIntegrations.includes(integration.id)
              const canConnect = canAccessFeature(user.pricingTier, integration.requiredPlan as any)
              
              return (
                <Card key={integration.id} className={isConnected ? 'border-green-200 bg-green-50/50' : ''}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          {integration.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{integration.name}</CardTitle>
                          <CardDescription className="text-sm">
                            {integration.description}
                          </CardDescription>
                        </div>
                      </div>
                      {isConnected && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    {!canConnect && (
                      <Badge variant="outline" className="text-xs">
                        Requires {integration.requiredPlan} plan
                      </Badge>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {isConnected ? 'Connected' : 'Connect'}
                      </span>
                      <Switch
                        checked={isConnected}
                        onCheckedChange={() => toggleIntegration(integration.id)}
                        disabled={!canConnect}
                      />
                    </div>
                    
                    {isConnected && (
                      <div className="text-xs text-green-600">
                        ✓ Integration active and syncing
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      ))}

      {/* Integration Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Why Use Integrations?</CardTitle>
          <CardDescription>
            Streamline your workflow with powerful connections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium">Video Conferencing</h4>
              <p className="text-muted-foreground">
                Automatically generate meeting links and add them to calendar invites
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">CRM Integration</h4>
              <p className="text-muted-foreground">
                Sync meeting data with your sales pipeline and lead management
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Marketing Automation</h4>
              <p className="text-muted-foreground">
                Trigger email sequences and nurture campaigns based on meeting activity
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Workflow Automation</h4>
              <p className="text-muted-foreground">
                Connect with 1000+ apps through Zapier for custom workflows
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}