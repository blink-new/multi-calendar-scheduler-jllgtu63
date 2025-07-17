import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Switch } from './ui/switch'
import { Badge } from './ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { UserCheck, Plus, Edit, Trash2, Clock, Users, DollarSign, Settings } from 'lucide-react'
import { User } from '../types/user'
import { EventType } from '../types/user'
import { canAccessFeature } from '../types/pricing'
import { toast } from 'react-hot-toast'

interface EventTypesProps {
  user: User
}

export function EventTypes({ user }: EventTypesProps) {
  const [eventTypes, setEventTypes] = useState<EventType[]>([])
  const [loading, setLoading] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingEventType, setEditingEventType] = useState<EventType | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 30,
    bufferTimeBefore: 0,
    bufferTimeAfter: 0,
    minimumNotice: 24,
    color: '#2563EB',
    maxParticipants: 10,
    requiresPayment: false,
    price: 0,
    currency: 'USD'
  })

  const canCreateMultipleEventTypes = canAccessFeature(user.pricingTier, 'advanced')
  const canUsePayments = canAccessFeature(user.pricingTier, 'advanced')
  const canUseAdvancedSettings = canAccessFeature(user.pricingTier, 'professional')

  useEffect(() => {
    const loadData = async () => {
      try {
        // Mock data for demonstration
        const mockEventTypes: EventType[] = [
          {
            id: '1',
            userId: user.id,
            name: '30-minute Meeting',
            description: 'Quick sync or consultation call',
            duration: 30,
            bufferTimeBefore: 5,
            bufferTimeAfter: 5,
            minimumNotice: 24,
            color: '#2563EB',
            isActive: true,
            maxParticipants: 5,
            requiresPayment: false,
            customFields: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '2',
            userId: user.id,
            name: 'Strategy Session',
            description: 'Deep dive planning session',
            duration: 60,
            bufferTimeBefore: 10,
            bufferTimeAfter: 10,
            minimumNotice: 48,
            color: '#10B981',
            isActive: true,
            maxParticipants: 8,
            requiresPayment: true,
            price: 150,
            currency: 'USD',
            customFields: [
              {
                id: '1',
                name: 'Company Name',
                type: 'text',
                required: true
              },
              {
                id: '2',
                name: 'Project Type',
                type: 'select',
                required: true,
                options: ['Web Development', 'Mobile App', 'Consulting', 'Other']
              }
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]
        setEventTypes(mockEventTypes)
      } catch (error) {
        console.error('Failed to load event types:', error)
        toast.error('Failed to load event types')
      }
    }
    loadData()
  }, [user.id])

  const loadEventTypes = async () => {
    try {
      // Mock data for demonstration
      const mockEventTypes: EventType[] = [
        {
          id: '1',
          userId: user.id,
          name: '30-minute Meeting',
          description: 'Quick sync or consultation call',
          duration: 30,
          bufferTimeBefore: 5,
          bufferTimeAfter: 5,
          minimumNotice: 24,
          color: '#2563EB',
          isActive: true,
          maxParticipants: 5,
          requiresPayment: false,
          customFields: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          userId: user.id,
          name: 'Strategy Session',
          description: 'Deep dive planning session',
          duration: 60,
          bufferTimeBefore: 10,
          bufferTimeAfter: 10,
          minimumNotice: 48,
          color: '#10B981',
          isActive: true,
          maxParticipants: 8,
          requiresPayment: true,
          price: 150,
          currency: 'USD',
          customFields: [
            {
              id: '1',
              name: 'Company Name',
              type: 'text',
              required: true
            },
            {
              id: '2',
              name: 'Project Type',
              type: 'select',
              required: true,
              options: ['Web Development', 'Mobile App', 'Consulting', 'Other']
            }
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
      setEventTypes(mockEventTypes)
    } catch (error) {
      console.error('Failed to load event types:', error)
      toast.error('Failed to load event types')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      duration: 30,
      bufferTimeBefore: 0,
      bufferTimeAfter: 0,
      minimumNotice: 24,
      color: '#2563EB',
      maxParticipants: 10,
      requiresPayment: false,
      price: 0,
      currency: 'USD'
    })
    setEditingEventType(null)
  }

  const openCreateDialog = () => {
    if (!canCreateMultipleEventTypes && eventTypes.length >= 3) {
      toast.error('Upgrade to Advanced plan to create more event types')
      return
    }
    resetForm()
    setShowCreateDialog(true)
  }

  const openEditDialog = (eventType: EventType) => {
    setFormData({
      name: eventType.name,
      description: eventType.description || '',
      duration: eventType.duration,
      bufferTimeBefore: eventType.bufferTimeBefore,
      bufferTimeAfter: eventType.bufferTimeAfter,
      minimumNotice: eventType.minimumNotice,
      color: eventType.color,
      maxParticipants: eventType.maxParticipants || 10,
      requiresPayment: eventType.requiresPayment,
      price: eventType.price || 0,
      currency: eventType.currency || 'USD'
    })
    setEditingEventType(eventType)
    setShowCreateDialog(true)
  }

  const saveEventType = async () => {
    if (!formData.name.trim()) {
      toast.error('Please provide an event type name')
      return
    }

    setLoading(true)
    try {
      if (editingEventType) {
        // Update existing event type
        const updatedEventType: EventType = {
          ...editingEventType,
          name: formData.name,
          description: formData.description,
          duration: formData.duration,
          bufferTimeBefore: formData.bufferTimeBefore,
          bufferTimeAfter: formData.bufferTimeAfter,
          minimumNotice: formData.minimumNotice,
          color: formData.color,
          maxParticipants: formData.maxParticipants,
          requiresPayment: canUsePayments ? formData.requiresPayment : false,
          price: canUsePayments ? formData.price : undefined,
          currency: canUsePayments ? formData.currency : undefined,
          updatedAt: new Date().toISOString()
        }

        setEventTypes(prev => prev.map(et => 
          et.id === editingEventType.id ? updatedEventType : et
        ))
        toast.success('Event type updated successfully!')
      } else {
        // Create new event type
        const newEventType: EventType = {
          id: Date.now().toString(),
          userId: user.id,
          name: formData.name,
          description: formData.description,
          duration: formData.duration,
          bufferTimeBefore: formData.bufferTimeBefore,
          bufferTimeAfter: formData.bufferTimeAfter,
          minimumNotice: formData.minimumNotice,
          color: formData.color,
          isActive: true,
          maxParticipants: formData.maxParticipants,
          requiresPayment: canUsePayments ? formData.requiresPayment : false,
          price: canUsePayments ? formData.price : undefined,
          currency: canUsePayments ? formData.currency : undefined,
          customFields: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }

        setEventTypes(prev => [newEventType, ...prev])
        toast.success('Event type created successfully!')
      }

      setShowCreateDialog(false)
      resetForm()
    } catch (error) {
      console.error('Failed to save event type:', error)
      toast.error('Failed to save event type')
    } finally {
      setLoading(false)
    }
  }

  const toggleEventType = async (eventTypeId: string, isActive: boolean) => {
    try {
      setEventTypes(prev => prev.map(et => 
        et.id === eventTypeId ? { ...et, isActive } : et
      ))
      toast.success(`Event type ${isActive ? 'activated' : 'deactivated'}`)
    } catch (error) {
      console.error('Failed to toggle event type:', error)
      toast.error('Failed to update event type')
    }
  }

  const deleteEventType = async (eventTypeId: string) => {
    try {
      setEventTypes(prev => prev.filter(et => et.id !== eventTypeId))
      toast.success('Event type deleted')
    } catch (error) {
      console.error('Failed to delete event type:', error)
      toast.error('Failed to delete event type')
    }
  }

  const colorOptions = [
    { value: '#2563EB', label: 'Blue' },
    { value: '#10B981', label: 'Green' },
    { value: '#F59E0B', label: 'Yellow' },
    { value: '#EF4444', label: 'Red' },
    { value: '#8B5CF6', label: 'Purple' },
    { value: '#06B6D4', label: 'Cyan' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <UserCheck className="w-8 h-8 text-primary" />
            Event Types
          </h1>
          <p className="text-muted-foreground">
            Create and manage different types of meetings you offer
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="w-4 h-4 mr-2" />
          Create Event Type
        </Button>
      </div>

      {/* Event Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventTypes.map((eventType) => (
          <Card key={eventType.id} className="relative">
            <div 
              className="absolute top-0 left-0 right-0 h-1 rounded-t-lg"
              style={{ backgroundColor: eventType.color }}
            />
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{eventType.name}</CardTitle>
                  {eventType.description && (
                    <CardDescription className="mt-1">
                      {eventType.description}
                    </CardDescription>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={eventType.isActive}
                    onCheckedChange={(checked) => toggleEventType(eventType.id, checked)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{eventType.duration} min</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>Max {eventType.maxParticipants}</span>
                </div>
              </div>

              {eventType.requiresPayment && (
                <div className="flex items-center space-x-2 text-sm">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-green-600 font-medium">
                    ${eventType.price} {eventType.currency}
                  </span>
                </div>
              )}

              <div className="text-xs text-muted-foreground space-y-1">
                <div>Buffer: {eventType.bufferTimeBefore}min before, {eventType.bufferTimeAfter}min after</div>
                <div>Minimum notice: {eventType.minimumNotice}h</div>
              </div>

              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEditDialog(eventType)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteEventType(eventType.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add New Card */}
        <Card 
          className="border-dashed border-2 cursor-pointer hover:border-primary/50 transition-colors"
          onClick={openCreateDialog}
        >
          <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
            <Plus className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="font-medium">Create Event Type</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Add a new meeting type
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingEventType ? 'Edit Event Type' : 'Create Event Type'}
            </DialogTitle>
            <DialogDescription>
              Configure your meeting type settings and availability
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="font-medium">Basic Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="name">Event Type Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., 30-minute Consultation"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of this meeting type..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Select
                    value={formData.duration.toString()}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, duration: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Select
                    value={formData.color}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, color: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: color.value }}
                            />
                            <span>{color.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Advanced Settings */}
            {canUseAdvancedSettings && (
              <div className="space-y-4">
                <h3 className="font-medium flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Advanced Settings
                </h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bufferBefore">Buffer Before (min)</Label>
                    <Input
                      id="bufferBefore"
                      type="number"
                      min="0"
                      max="60"
                      value={formData.bufferTimeBefore}
                      onChange={(e) => setFormData(prev => ({ ...prev, bufferTimeBefore: parseInt(e.target.value) || 0 }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bufferAfter">Buffer After (min)</Label>
                    <Input
                      id="bufferAfter"
                      type="number"
                      min="0"
                      max="60"
                      value={formData.bufferTimeAfter}
                      onChange={(e) => setFormData(prev => ({ ...prev, bufferTimeAfter: parseInt(e.target.value) || 0 }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minimumNotice">Min Notice (hours)</Label>
                    <Input
                      id="minimumNotice"
                      type="number"
                      min="1"
                      max="168"
                      value={formData.minimumNotice}
                      onChange={(e) => setFormData(prev => ({ ...prev, minimumNotice: parseInt(e.target.value) || 24 }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxParticipants">Maximum Participants</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.maxParticipants}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) || 10 }))}
                  />
                </div>
              </div>
            )}

            {/* Payment Settings */}
            {canUsePayments && (
              <div className="space-y-4">
                <h3 className="font-medium flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Payment Settings
                </h3>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.requiresPayment}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, requiresPayment: checked }))}
                  />
                  <Label>Require payment for this event type</Label>
                </div>

                {formData.requiresPayment && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select
                        value={formData.currency}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                          <SelectItem value="CAD">CAD ($)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={saveEventType} disabled={loading}>
                {loading ? 'Saving...' : editingEventType ? 'Update Event Type' : 'Create Event Type'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}