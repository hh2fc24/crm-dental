'use client'

import React, { useState, useEffect } from 'react'
import { X, Calendar, FileText } from 'lucide-react'
import { ToothStatus } from '@/types/patient'
import { Button, Badge } from '@/components/ui'
import { formatDate } from '@/lib/utils'
import ToothSVG from './ToothSVG'

interface ToothModalProps {
  isOpen: boolean
  onClose: () => void
  tooth: ToothStatus
  onUpdate: (toothNumber: number, status: ToothStatus['status'], notes: string) => void
}

const statusOptions = [
  { value: 'healthy', label: 'Sano', color: 'bg-green-500' },
  { value: 'caries', label: 'Caries', color: 'bg-red-500' },
  { value: 'endodoncia', label: 'Endodoncia', color: 'bg-purple-500' },
  { value: 'corona', label: 'Corona', color: 'bg-amber-500' },
  { value: 'implante', label: 'Implante', color: 'bg-cyan-500' },
  { value: 'extraccion', label: 'Extracción', color: 'bg-gray-500' }
] as const

const ToothModal: React.FC<ToothModalProps> = ({ isOpen, onClose, tooth, onUpdate }) => {
  const [selectedStatus, setSelectedStatus] = useState<ToothStatus['status']>(tooth.status)
  const [notes, setNotes] = useState(tooth.notes || '')

  useEffect(() => {
    if (isOpen) {
      setSelectedStatus(tooth.status)
      setNotes(tooth.notes || '')
    }
  }, [isOpen, tooth])

  const handleSave = () => {
    onUpdate(tooth.number, selectedStatus, notes)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSave()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div 
          className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 transform transition-all"
          onKeyDown={handleKeyDown}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <ToothSVG
                toothNumber={tooth.number}
                status={selectedStatus}
                className="w-12 h-12"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Diente {tooth.number}
                </h3>
                <p className="text-sm text-gray-500">
                  Editar estado y notas
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Status Info */}
          {tooth.date && (
            <div className="mb-6 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Última actualización: {formatDate(tooth.date)}</span>
              </div>
            </div>
          )}

          {/* Status Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Estado del diente
            </label>
            <div className="grid grid-cols-2 gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedStatus(option.value)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    selectedStatus === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${option.color}`} />
                    <span className="text-sm font-medium text-gray-900">
                      {option.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              Notas clínicas
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Agregar observaciones, tratamientos realizados, etc..."
              className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              className="flex-1"
            >
              Guardar cambios
            </Button>
          </div>

          {/* Keyboard shortcuts hint */}
          <div className="mt-4 text-xs text-gray-500 text-center">
            <kbd className="px-1 py-0.5 bg-gray-100 rounded">Esc</kbd> para cerrar • 
            <kbd className="px-1 py-0.5 bg-gray-100 rounded mx-1">⌘ Enter</kbd> para guardar
          </div>
        </div>
      </div>
    </div>
  )
}

export default ToothModal

