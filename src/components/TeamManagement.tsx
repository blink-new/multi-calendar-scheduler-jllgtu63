import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Users } from 'lucide-react'
import { User } from '../types/user'
import { canAccessFeature } from '../types/pricing'

interface TeamManagementProps {
  user: User
}

export function TeamManagement({ user }: TeamManagementProps) {
  const canUseTeamFeatures = canAccessFeature(user.pricingTier, 'professional')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="w-8 h-8 text-primary" />
          Team Management
        </h1>
        <p className="text-muted-foreground">
          Manage team members and collaborative scheduling
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Team Management is a Professional Feature</h3>
              <p className="text-muted-foreground mt-2">
                Upgrade to Professional to manage team members, shared calendars, and round-robin scheduling.
              </p>
            </div>
            <Badge variant="outline">Available in Professional plan</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}