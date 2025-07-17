import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Check, Crown, Zap, Star } from 'lucide-react'
import { PRICING_PLANS, PricingTier } from '../types/pricing'
import { User } from '../types/user'
import { toast } from 'react-hot-toast'

interface PricingPageProps {
  user: User
  onPlanSelected: (tier: PricingTier) => void
}

export function PricingPage({ user, onPlanSelected }: PricingPageProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const handleUpgrade = async (tier: PricingTier) => {
    if (tier === user.pricingTier) {
      toast.error('You are already on this plan')
      return
    }

    setLoading(tier)
    try {
      // Simulate Stripe checkout process
      toast.loading('Redirecting to Stripe checkout...', { duration: 1000 })
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      toast.loading('Processing payment...', { duration: 800 })
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.loading('Updating your subscription...', { duration: 600 })
      await new Promise(resolve => setTimeout(resolve, 800))
      
      onPlanSelected(tier)
    } catch (error) {
      console.error('Failed to upgrade plan:', error)
      toast.error('Failed to upgrade plan. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  const getPlanIcon = (tier: PricingTier) => {
    switch (tier) {
      case 'basic': return <Zap className="w-6 h-6" />
      case 'advanced': return <Star className="w-6 h-6" />
      case 'professional': return <Crown className="w-6 h-6" />
    }
  }

  const getPlanColor = (tier: PricingTier) => {
    switch (tier) {
      case 'basic': return 'border-gray-200'
      case 'advanced': return 'border-blue-200 bg-blue-50/50'
      case 'professional': return 'border-purple-200 bg-purple-50/50'
    }
  }

  const getButtonVariant = (tier: PricingTier) => {
    if (tier === user.pricingTier) return 'outline'
    if (tier === 'professional') return 'default'
    return 'outline'
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Choose Your Plan</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Unlock powerful scheduling features and grow your business with Schedulr's comprehensive plans
        </p>
        <div className="flex items-center justify-center space-x-2">
          <Badge variant="secondary">Current Plan: {PRICING_PLANS.find(p => p.id === user.pricingTier)?.name}</Badge>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {PRICING_PLANS.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative ${getPlanColor(plan.id)} ${
              plan.id === 'professional' ? 'ring-2 ring-purple-200' : ''
            }`}
          >
            {plan.id === 'professional' && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-purple-600 text-white">Most Popular</Badge>
              </div>
            )}
            
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                {getPlanIcon(plan.id)}
              </div>
              <div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </div>
              <div className="space-y-1">
                <div className="text-4xl font-bold">
                  ${plan.price}
                  <span className="text-lg font-normal text-muted-foreground">/month</span>
                </div>
                {plan.id === 'basic' && (
                  <p className="text-sm text-muted-foreground">Perfect for getting started</p>
                )}
                {plan.id === 'advanced' && (
                  <p className="text-sm text-muted-foreground">Great for growing teams</p>
                )}
                {plan.id === 'professional' && (
                  <p className="text-sm text-muted-foreground">Everything you need to scale</p>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Features List */}
              <div className="space-y-3">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <Button
                className="w-full"
                variant={getButtonVariant(plan.id)}
                onClick={() => handleUpgrade(plan.id)}
                disabled={loading === plan.id || plan.id === user.pricingTier}
              >
                {loading === plan.id ? (
                  'Processing...'
                ) : plan.id === user.pricingTier ? (
                  'Current Plan'
                ) : (
                  `Upgrade to ${plan.name}`
                )}
              </Button>

              {/* Limits Summary */}
              <div className="pt-4 border-t space-y-2 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Meetings/month:</span>
                  <span>{plan.limits.meetingsPerMonth === -1 ? 'Unlimited' : plan.limits.meetingsPerMonth}</span>
                </div>
                <div className="flex justify-between">
                  <span>Participants/meeting:</span>
                  <span>{plan.limits.participantsPerMeeting === -1 ? 'Unlimited' : plan.limits.participantsPerMeeting}</span>
                </div>
                <div className="flex justify-between">
                  <span>Calendar connections:</span>
                  <span>{plan.limits.calendarConnections === -1 ? 'Unlimited' : plan.limits.calendarConnections}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Feature Comparison */}
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Feature Comparison</CardTitle>
            <CardDescription>
              See what's included in each plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Feature</th>
                    <th className="text-center py-3 px-4">Basic</th>
                    <th className="text-center py-3 px-4">Advanced</th>
                    <th className="text-center py-3 px-4">Professional</th>
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  <tr className="border-b">
                    <td className="py-3 px-4">Calendar Integration</td>
                    <td className="text-center py-3 px-4"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                    <td className="text-center py-3 px-4"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                    <td className="text-center py-3 px-4"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Meeting Bot</td>
                    <td className="text-center py-3 px-4">-</td>
                    <td className="text-center py-3 px-4">-</td>
                    <td className="text-center py-3 px-4"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Custom Branding</td>
                    <td className="text-center py-3 px-4">-</td>
                    <td className="text-center py-3 px-4">-</td>
                    <td className="text-center py-3 px-4"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Analytics & Reporting</td>
                    <td className="text-center py-3 px-4">-</td>
                    <td className="text-center py-3 px-4"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                    <td className="text-center py-3 px-4"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">API Access</td>
                    <td className="text-center py-3 px-4">-</td>
                    <td className="text-center py-3 px-4">-</td>
                    <td className="text-center py-3 px-4"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Priority Support</td>
                    <td className="text-center py-3 px-4">-</td>
                    <td className="text-center py-3 px-4">-</td>
                    <td className="text-center py-3 px-4"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <h3 className="text-xl font-semibold">Frequently Asked Questions</h3>
        <div className="space-y-4 text-left">
          <div>
            <h4 className="font-medium">Can I change plans anytime?</h4>
            <p className="text-sm text-muted-foreground">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
          </div>
          <div>
            <h4 className="font-medium">Is there a free trial?</h4>
            <p className="text-sm text-muted-foreground">All new users get a 14-day free trial of the Professional plan to explore all features.</p>
          </div>
          <div>
            <h4 className="font-medium">What payment methods do you accept?</h4>
            <p className="text-sm text-muted-foreground">We accept all major credit cards through Stripe. Enterprise customers can pay by invoice.</p>
          </div>
        </div>
      </div>
    </div>
  )
}