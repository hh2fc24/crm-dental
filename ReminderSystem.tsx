'use client'

import React, { useState, useEffect } from 'react'
import { Bell, Calendar, Clock, Plus, X, Check, AlertTriangle, Info } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@/components/ui'
import { formatDateTime, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface Reminder {
  id: string
  patient_id: string
  title: string
  description?: string
  reminder_date: string
  reminder_time?: string
  type: 'appointment' | 'follow_up' | 'medication' | 'treatment' | 'custom'
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'completed' | 'dismissed'
  created_by: string
  created_at: string
  completed_at?: string
}

interface ReminderSystemProps {
  patientId: string
  className?: string
}

const reminderTypes = [
  { value: 'appointment', label: 'Cita', icon: Calendar, color: 'blue' },
  { value: 'follow_up', label: 'Seguimiento', icon: Clock, color: 'green' },
  { value: 'medication', label: 'Medicación', icon: AlertTriangle, color: 'amber' },
  { value: 'treatment', label: 'Tratamiento', icon: Info, color: 'purple' },
  { value: 'custom', label: 'Personalizado', icon: Bell, color: 'gray' }
]

const ReminderSystem: React.FC<ReminderSystemProps> = ({ patientId, className }) => {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('pending')
  const [newReminder, setNewReminder] = useState({
    title: '',
    description: '',
    reminder_date: '',
    reminder_time: '',
    type: 'custom' as Reminder['type'],
    priority: 'medium' as Reminder['priority']
  })

  // Mock data para desarrollo
  useEffect(() => {
    const mockReminders: Reminder[] = [
      {
        id: '1',
        patient_id: patientId,
        title: 'Control post-operatorio',
        description: 'Revisar evolución después de la extracción del diente 18',
        reminder_date: '2024-07-15',
        reminder_time: '10:00',
        type: 'follow_up',
        priority: 'high',
        status: 'pending',
        created_by: 'doc1',
        created_at: '2024-07-03T14:00:00Z'
      },
      {
        id: '2',
        patient_id: patientId,
        title: 'Recordar tomar antibiótico',
        description: 'Amoxicilina 500mg cada 8 horas por 7 días',
        reminder_date: '2024-07-10',
        reminder_time: '08:00',
        type: 'medication',
        priority: 'high',
        status: 'completed',
        created_by: 'doc1',
        created_at: '2024-07-03T14:00:00Z',
        completed_at: '2024-07-10T08:00:00Z'
      },
      {
        id: '3',
        patient_id: patientId,
        title: 'Limpieza dental programada',
        description: 'Profilaxis y aplicación de flúor',
        reminder_date: '2024-08-01',
        reminder_time: '14:30',
        type: 'appointment',
        priority: 'medium',
        status: 'pending',
        created_by: 'doc1',
        created_at: '2024-07-03T14:00:00Z'
      }
    ]
    setReminders(mockReminders)
  }, [patientId])

  const filteredReminders = reminders.filter(reminder => {
    if (filter === 'all') return true
    return reminder.status === filter
  })

  const handleCreateReminder = () => {
    if (!newReminder.title.trim() || !newReminder.reminder_date) return

    const reminder: Reminder = {
      id: Date.now().toString(),
      patient_id: patientId,
      title: newReminder.title.trim(),
      description: newReminder.description.trim() || undefined,
      reminder_date: newReminder.reminder_date,
      reminder_time: newReminder.reminder_time || undefined,
      type: newReminder.type,
      priority: newReminder.priority,
      status: 'pending',
      created_by: 'doc1',
      created_at: new Date().toISOString()
    }

    setReminders(prev => [reminder, ...prev])
    setNewReminder({
      title: '',
      description: '',
      reminder_date: '',
      reminder_time: '',
      type: 'custom',
      priority: 'medium'
    })
    setIsCreating(false)
  }

  const handleCompleteReminder = (reminderId: string) => {
    setReminders(prev => prev.map(reminder =>
      reminder.id === reminderId
        ? { ...reminder, status: 'completed' as const, completed_at: new Date().toISOString() }
        : reminder
    ))
  }

  const handleDismissReminder = (reminderId: string) => {
    setReminders(prev => prev.map(reminder =>
      reminder.id === reminderId
        ? { ...reminder, status: 'dismissed' as const }
        : reminder
    ))
  }

  const handleDeleteReminder = (reminderId: string) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== reminderId))
  }

  const getPriorityColor = (priority: Reminder['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100'
      case 'medium':
        return 'text-amber-600 bg-amber-100'
      case 'low':
        return 'text-green-600 bg-green-100'
    }
  }

  const getTypeConfig = (type: Reminder['type']) => {
    return reminderTypes.find(t => t.value === type) || reminderTypes[4]
  }

  const ReminderCard: React.FC<{ reminder: Reminder }> = ({ reminder }) => {
    const typeConfig = getTypeConfig(reminder.type)
    const Icon = typeConfig.icon
    const isOverdue = new Date(reminder.reminder_date) < new Date() && reminder.status === 'pending'

    return (
      <Card className={cn(
        'transition-all duration-200',
        reminder.status === 'completed' && 'opacity-60',
        isOverdue && 'border-red-200 bg-red-50'
      )}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start space-x-3">
              <div className={cn(
                'p-2 rounded-lg',
                `bg-${typeConfig.color}-100 text-${typeConfig.color}-600`
              )}>
                <Icon className="w-4 h-4" />
              </div>
              
              <div className="flex-1">
                <h4 className={cn(
                  'font-medium text-gray-900 mb-1',
                  reminder.status === 'completed' && 'line-through'
                )}>
                  {reminder.title}
                </h4>
                
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="outline" size="sm">
                    {typeConfig.label}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    size="sm"
                    className={getPriorityColor(reminder.priority)}
                  >
                    {reminder.priority === 'high' ? 'Alta' : 
                     reminder.priority === 'medium' ? 'Media' : 'Baja'}
                  </Badge>
                  {isOverdue && (
                    <Badge variant="error" size="sm">
                      Vencido
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(reminder.reminder_date)}</span>
                  </div>
                  {reminder.reminder_time && (
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{reminder.reminder_time}</span>
                    </div>
                  )}
                </div>
                
                {reminder.description && (
                  <p className="text-sm text-gray-600 mt-2">
                    {reminder.description}
                  </p>
                )}
                
                {reminder.completed_at && (
                  <p className="text-xs text-green-600 mt-2">
                    Completado el {formatDateTime(reminder.completed_at)}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              {reminder.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleCompleteReminder(reminder.id)}
                    className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                    title="Marcar como completado"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDismissReminder(reminder.id)}
                    className="p-1 text-gray-400 hover:bg-gray-100 rounded transition-colors"
                    title="Descartar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              )}
              <button
                onClick={() => handleDeleteReminder(reminder.id)}
                className="p-1 text-red-400 hover:bg-red-100 rounded transition-colors"
                title="Eliminar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Recordatorios</h3>
          <Badge variant="outline" size="sm">
            {filteredReminders.length} recordatorio{filteredReminders.length !== 1 ? 's' : ''}
          </Badge>
        </div>

        <div className="flex items-center space-x-2">
          {/* Filter */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { value: 'pending', label: 'Pendientes' },
              { value: 'completed', label: 'Completados' },
              { value: 'all', label: 'Todos' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value as any)}
                className={cn(
                  'px-3 py-1 rounded-md text-sm font-medium transition-colors',
                  filter === option.value
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreating(true)}
          >
            <Plus className="w-4 h-4 mr-1" />
            Nuevo recordatorio
          </Button>
        </div>
      </div>

      {/* New Reminder Form */}
      {isCreating && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={newReminder.title}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Título del recordatorio"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo
                  </label>
                  <select
                    value={newReminder.type}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, type: e.target.value as Reminder['type'] }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {reminderTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={newReminder.description}
                  onChange={(e) => setNewReminder(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descripción opcional del recordatorio"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha *
                  </label>
                  <input
                    type="date"
                    value={newReminder.reminder_date}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, reminder_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hora
                  </label>
                  <input
                    type="time"
                    value={newReminder.reminder_time}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, reminder_time: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prioridad
                  </label>
                  <select
                    value={newReminder.priority}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, priority: e.target.value as Reminder['priority'] }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                  </select>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsCreating(false)
                    setNewReminder({
                      title: '',
                      description: '',
                      reminder_date: '',
                      reminder_time: '',
                      type: 'custom',
                      priority: 'medium'
                    })
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleCreateReminder}
                  disabled={!newReminder.title.trim() || !newReminder.reminder_date}
                >
                  Crear recordatorio
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reminders List */}
      <div className="space-y-3">
        {filteredReminders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                {filter === 'pending' ? 'No hay recordatorios pendientes' :
                 filter === 'completed' ? 'No hay recordatorios completados' :
                 'No hay recordatorios registrados'}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Crea recordatorios para hacer seguimiento de citas y tratamientos
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredReminders.map((reminder) => (
            <ReminderCard key={reminder.id} reminder={reminder} />
          ))
        )}
      </div>
    </div>
  )
}

export default ReminderSystem

