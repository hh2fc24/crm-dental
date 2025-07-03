'use client'

import React, { useState, useEffect } from 'react'
import { History, User, Clock, FileText, Eye, ChevronDown, ChevronRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, Badge, Avatar } from '@/components/ui'
import { formatDateTime } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface EditHistoryEntry {
  id: string
  entity_type: 'patient' | 'clinical_record' | 'dental_chart' | 'note'
  entity_id: string
  action: 'created' | 'updated' | 'deleted'
  field_changed?: string
  old_value?: string
  new_value?: string
  changed_by: string
  changed_by_name: string
  timestamp: string
  description: string
}

interface EditHistoryProps {
  entityId: string
  entityType?: 'patient' | 'clinical_record' | 'dental_chart' | 'note'
  className?: string
}

const EditHistory: React.FC<EditHistoryProps> = ({ entityId, entityType, className }) => {
  const [history, setHistory] = useState<EditHistoryEntry[]>([])
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState<'all' | 'created' | 'updated' | 'deleted'>('all')

  // Mock data para desarrollo
  useEffect(() => {
    const mockHistory: EditHistoryEntry[] = [
      {
        id: '1',
        entity_type: 'clinical_record',
        entity_id: entityId,
        action: 'updated',
        field_changed: 'observaciones',
        old_value: 'Paciente presenta molestias leves',
        new_value: 'Paciente presenta molestias leves. Se recomienda control en 2 semanas.',
        changed_by: 'doc1',
        changed_by_name: 'Dr. Juan Pérez',
        timestamp: '2024-07-03T14:30:00Z',
        description: 'Actualización de observaciones en ficha clínica'
      },
      {
        id: '2',
        entity_type: 'dental_chart',
        entity_id: entityId,
        action: 'updated',
        field_changed: 'tooth_status',
        old_value: 'healthy',
        new_value: 'caries',
        changed_by: 'doc1',
        changed_by_name: 'Dr. Juan Pérez',
        timestamp: '2024-07-03T14:25:00Z',
        description: 'Cambio de estado del diente 16 de sano a caries'
      },
      {
        id: '3',
        entity_type: 'clinical_record',
        entity_id: entityId,
        action: 'created',
        changed_by: 'doc1',
        changed_by_name: 'Dr. Juan Pérez',
        timestamp: '2024-07-03T14:00:00Z',
        description: 'Nueva ficha clínica creada - Limpieza dental'
      },
      {
        id: '4',
        entity_type: 'patient',
        entity_id: entityId,
        action: 'updated',
        field_changed: 'telefono',
        old_value: '+56912345678',
        new_value: '+56987654321',
        changed_by: 'doc1',
        changed_by_name: 'Dr. Juan Pérez',
        timestamp: '2024-07-01T10:15:00Z',
        description: 'Actualización de número de teléfono'
      },
      {
        id: '5',
        entity_type: 'patient',
        entity_id: entityId,
        action: 'created',
        changed_by: 'doc1',
        changed_by_name: 'Dr. Juan Pérez',
        timestamp: '2024-06-15T09:00:00Z',
        description: 'Paciente registrado en el sistema'
      }
    ]
    setHistory(mockHistory)
  }, [entityId])

  const filteredHistory = filter === 'all' 
    ? history 
    : history.filter(entry => entry.action === filter)

  const toggleExpanded = (entryId: string) => {
    const newExpanded = new Set(expandedEntries)
    if (newExpanded.has(entryId)) {
      newExpanded.delete(entryId)
    } else {
      newExpanded.add(entryId)
    }
    setExpandedEntries(newExpanded)
  }

  const getActionIcon = (action: EditHistoryEntry['action']) => {
    switch (action) {
      case 'created':
        return <div className="w-2 h-2 bg-green-500 rounded-full" />
      case 'updated':
        return <div className="w-2 h-2 bg-blue-500 rounded-full" />
      case 'deleted':
        return <div className="w-2 h-2 bg-red-500 rounded-full" />
    }
  }

  const getActionColor = (action: EditHistoryEntry['action']) => {
    switch (action) {
      case 'created':
        return 'text-green-700 bg-green-100'
      case 'updated':
        return 'text-blue-700 bg-blue-100'
      case 'deleted':
        return 'text-red-700 bg-red-100'
    }
  }

  const getEntityTypeLabel = (type: EditHistoryEntry['entity_type']) => {
    switch (type) {
      case 'patient':
        return 'Paciente'
      case 'clinical_record':
        return 'Ficha Clínica'
      case 'dental_chart':
        return 'Odontograma'
      case 'note':
        return 'Nota'
    }
  }

  const HistoryEntry: React.FC<{ entry: EditHistoryEntry }> = ({ entry }) => {
    const isExpanded = expandedEntries.has(entry.id)
    const hasDetails = entry.field_changed && (entry.old_value || entry.new_value)

    return (
      <div className="border-l-2 border-gray-200 pl-4 pb-4 last:pb-0">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-1">
            {getActionIcon(entry.action)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <Badge 
                  variant="outline" 
                  size="sm"
                  className={getActionColor(entry.action)}
                >
                  {entry.action === 'created' ? 'Creado' : 
                   entry.action === 'updated' ? 'Actualizado' : 'Eliminado'}
                </Badge>
                <Badge variant="outline" size="sm">
                  {getEntityTypeLabel(entry.entity_type)}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">
                  {formatDateTime(entry.timestamp)}
                </span>
                {hasDetails && (
                  <button
                    onClick={() => toggleExpanded(entry.id)}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            </div>
            
            <p className="text-sm text-gray-700 mb-2">
              {entry.description}
            </p>
            
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Avatar size="sm" fallback={entry.changed_by_name.split(' ').map(n => n[0]).join('')} />
              <span>{entry.changed_by_name}</span>
            </div>
            
            {/* Expanded Details */}
            {isExpanded && hasDetails && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <h5 className="text-sm font-medium text-gray-900 mb-2">
                  Campo modificado: {entry.field_changed}
                </h5>
                
                {entry.old_value && (
                  <div className="mb-2">
                    <span className="text-xs text-gray-500">Valor anterior:</span>
                    <p className="text-sm text-gray-700 bg-red-50 border border-red-200 rounded px-2 py-1 mt-1">
                      {entry.old_value}
                    </p>
                  </div>
                )}
                
                {entry.new_value && (
                  <div>
                    <span className="text-xs text-gray-500">Nuevo valor:</span>
                    <p className="text-sm text-gray-700 bg-green-50 border border-green-200 rounded px-2 py-1 mt-1">
                      {entry.new_value}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <History className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Historial de Cambios</h3>
          <Badge variant="outline" size="sm">
            {filteredHistory.length} entrada{filteredHistory.length !== 1 ? 's' : ''}
          </Badge>
        </div>

        {/* Filter */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          {[
            { value: 'all', label: 'Todos' },
            { value: 'created', label: 'Creados' },
            { value: 'updated', label: 'Actualizados' },
            { value: 'deleted', label: 'Eliminados' }
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
      </div>

      {/* History Timeline */}
      <Card>
        <CardContent className="p-6">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-8">
              <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No hay cambios registrados</p>
              <p className="text-sm text-gray-400 mt-1">
                Los cambios aparecerán aquí cuando se realicen modificaciones
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHistory.map((entry) => (
                <HistoryEntry key={entry.id} entry={entry} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <Clock className="w-4 h-4 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Auditoría de cambios</p>
            <p>
              Todos los cambios realizados en el sistema quedan registrados para mantener 
              un historial completo y garantizar la trazabilidad de la información.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditHistory

