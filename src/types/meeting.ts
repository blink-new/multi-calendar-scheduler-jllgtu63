export interface Meeting {
  id: string
  userId: string
  eventTypeId: string
  title: string
  description?: string
  scheduledTime?: string
  duration: number // in minutes
  timeZone: string
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled'
  participants: MeetingParticipant[]
  meetingLink?: string
  location?: string
  customFields?: Record<string, any>
  paymentStatus?: 'pending' | 'paid' | 'failed'
  paymentIntentId?: string
  createdAt: string
  updatedAt: string
}

export interface MeetingParticipant {
  id: string
  email: string
  name?: string
  status: 'pending' | 'confirmed' | 'declined'
  permissionGranted: boolean
  permissionToken?: string
  remindersSent: number
  lastReminderSent?: string
  customFieldResponses?: Record<string, any>
}

export interface AvailabilityWindow {
  id: string
  userId: string
  dayOfWeek: number // 0-6, Sunday = 0
  startTime: string // HH:mm format
  endTime: string // HH:mm format
  isActive: boolean
  dateSpecific?: string // YYYY-MM-DD for date-specific overrides
  createdAt: string
  updatedAt: string
}

export interface TimeSlot {
  date: string
  startTime: string
  endTime: string
  available: boolean
  conflicts: string[]
  participants?: string[]
}

export interface MeetingBot {
  id: string
  meetingId: string
  createdBy: string
  participantEmails: string[]
  permissionLink: string
  status: 'collecting_permissions' | 'ready_to_schedule' | 'scheduled' | 'failed'
  permissionsGranted: string[]
  remindersSent: number
  lastReminderSent?: string
  autoScheduleEnabled: boolean
  preferredTimeSlots?: TimeSlot[]
  scheduledSlot?: TimeSlot
  createdAt: string
  updatedAt: string
}

export interface Integration {
  id: string
  userId: string
  type: 'zoom' | 'teams' | 'google_meet' | 'webex' | 'salesforce' | 'hubspot' | 'mailchimp'
  name: string
  isActive: boolean
  credentials: Record<string, any>
  settings: Record<string, any>
  createdAt: string
  updatedAt: string
}