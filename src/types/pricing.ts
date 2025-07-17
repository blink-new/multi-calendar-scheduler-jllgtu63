export type PricingTier = 'basic' | 'advanced' | 'professional'

export interface PricingPlan {
  id: PricingTier
  name: string
  price: number
  description: string
  features: string[]
  limits: {
    meetingsPerMonth: number
    participantsPerMeeting: number
    calendarConnections: number
    eventTypes: number
    customBranding: boolean
    apiAccess: boolean
    webhooks: boolean
    analytics: boolean
    ssoSupport: boolean
    prioritySupport: boolean
  }
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 1,
    description: 'Perfect for individuals and small teams',
    features: [
      'Up to 50 meetings per month',
      'Up to 5 participants per meeting',
      '2 calendar connections',
      'Basic event types',
      'Email notifications',
      'Basic availability windows',
      'Time zone detection',
      'Meeting duration options'
    ],
    limits: {
      meetingsPerMonth: 50,
      participantsPerMeeting: 5,
      calendarConnections: 2,
      eventTypes: 3,
      customBranding: false,
      apiAccess: false,
      webhooks: false,
      analytics: false,
      ssoSupport: false,
      prioritySupport: false
    }
  },
  {
    id: 'advanced',
    name: 'Advanced',
    price: 5,
    description: 'For growing teams and businesses',
    features: [
      'Up to 200 meetings per month',
      'Up to 15 participants per meeting',
      '5 calendar connections',
      'Custom event types',
      'SMS & email reminders',
      'Custom availability rules',
      'Buffer times & scheduling notice',
      'Group scheduling (round-robin)',
      'Basic routing forms',
      'Payment collection (Stripe)',
      'Custom booking pages',
      'Meeting limits per day/week',
      'Basic analytics'
    ],
    limits: {
      meetingsPerMonth: 200,
      participantsPerMeeting: 15,
      calendarConnections: 5,
      eventTypes: 10,
      customBranding: false,
      apiAccess: false,
      webhooks: false,
      analytics: true,
      ssoSupport: false,
      prioritySupport: false
    }
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 10,
    description: 'For enterprises and power users',
    features: [
      'Unlimited meetings',
      'Unlimited participants',
      'Unlimited calendar connections',
      'Unlimited custom event types',
      'Advanced routing & lead qualification',
      'Team scheduling & management',
      'Custom branding & white-labeling',
      'Advanced analytics & reporting',
      'CRM integrations (Salesforce, HubSpot)',
      'Video conferencing integrations',
      'API access & webhooks',
      'Zapier & Make integrations',
      'Priority support',
      'SOC 2 & GDPR compliance',
      'Meeting scheduling bot',
      'Automated permission collection'
    ],
    limits: {
      meetingsPerMonth: -1, // unlimited
      participantsPerMeeting: -1, // unlimited
      calendarConnections: -1, // unlimited
      eventTypes: -1, // unlimited
      customBranding: true,
      apiAccess: true,
      webhooks: true,
      analytics: true,
      ssoSupport: true,
      prioritySupport: true
    }
  }
]

export function getPlanByTier(tier: PricingTier): PricingPlan {
  return PRICING_PLANS.find(plan => plan.id === tier) || PRICING_PLANS[0]
}

export function canAccessFeature(userTier: PricingTier, requiredTier: PricingTier): boolean {
  const tierOrder: PricingTier[] = ['basic', 'advanced', 'professional']
  const userIndex = tierOrder.indexOf(userTier)
  const requiredIndex = tierOrder.indexOf(requiredTier)
  return userIndex >= requiredIndex
}