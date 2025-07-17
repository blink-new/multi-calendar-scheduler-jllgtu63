import { PricingTier } from './pricing'

export interface User {
  id: string
  email: string
  displayName?: string
  pricingTier: PricingTier
  stripeCustomerId?: string
  subscriptionStatus: 'active' | 'inactive' | 'trialing' | 'past_due' | 'canceled'
  subscriptionId?: string
  trialEndsAt?: string
  createdAt: string
  updatedAt: string
}

export interface UserUsage {
  userId: string
  meetingsThisMonth: number
  lastResetDate: string
}

export interface CalendarConnection {
  id: string
  userId: string
  provider: 'google' | 'microsoft' | 'icloud'
  email: string
  connected: boolean
  accessToken?: string
  refreshToken?: string
  lastSync?: string
  syncEnabled: boolean
  createdAt: string
  updatedAt: string
}

export interface EventType {
  id: string
  userId: string
  name: string
  description?: string
  duration: number // in minutes
  bufferTimeBefore: number // in minutes
  bufferTimeAfter: number // in minutes
  minimumNotice: number // in hours
  color: string
  isActive: boolean
  maxParticipants?: number
  requiresPayment: boolean
  price?: number
  currency?: string
  customFields: CustomField[]
  routingForm?: RoutingForm
  createdAt: string
  updatedAt: string
}

export interface CustomField {
  id: string
  name: string
  type: 'text' | 'email' | 'phone' | 'select' | 'multiselect' | 'textarea'
  required: boolean
  options?: string[] // for select/multiselect
  placeholder?: string
}

export interface RoutingForm {
  id: string
  questions: RoutingQuestion[]
  rules: RoutingRule[]
}

export interface RoutingQuestion {
  id: string
  question: string
  type: 'text' | 'select' | 'multiselect' | 'boolean'
  options?: string[]
  required: boolean
}

export interface RoutingRule {
  id: string
  condition: {
    questionId: string
    operator: 'equals' | 'contains' | 'not_equals'
    value: string
  }
  action: {
    type: 'redirect' | 'assign_to' | 'require_approval'
    value: string
  }
}