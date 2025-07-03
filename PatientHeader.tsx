'use client'

import React from 'react'
import { Calendar, Phone, Mail, MapPin, AlertTriangle, Clock, FileText } from 'lucide-react'
import { Patient } from '@/types/patient'
import { Avatar, Badge, Card } from '@/components/ui'
import { formatRut, calculateAge, formatDate } from '@/lib/utils'

interface PatientHeaderProps {
  patient: Patient
}

const PatientHeader: React.FC<PatientHeaderProps> = ({ patient }) => {
  const age = calculateAge(patient.fecha_nacimiento)
  const getPatientInitials = () => {
    return `${patient.nombre.charAt(0)}${patient.apellido.charAt(0)}`.toUpperCase()
  }

  // Datos mock para próximas citas y alertas
  const nextAppointment = {
    date: '2024-07-15T10:00:00Z',
    type: 'Control de rutina'
  }

  const alerts = [
    { type: 'allergy', message: 'Alérgico a penicilina' },
    { type: 'medication', message: 'Toma anticoagulantes' }
  ]

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
      <Card variant="glass" className="overflow-hidden">
        <div className="p-6">
          {/* Main Patient Info */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Avatar
                size="xl"
                fallback={getPatientInitials()}
                className="ring-4 ring-white shadow-lg"
              />
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {patient.nombre} {patient.apellido}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{formatRut(patient.rut)}</span>
                  <span>•</span>
                  <span>{age} años</span>
                  <span>•</span>
                  <span>{patient.sexo === 'M' ? 'Masculino' : patient.sexo === 'F' ? 'Femenino' : 'Otro'}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Paciente desde {formatDate(patient.created_at)}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <FileText className="w-5 h-5" />
              </button>
              <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                <Phone className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Contact & Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Contact Info */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Contacto
              </h3>
              
              {patient.telefono && (
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{patient.telefono}</span>
                </div>
              )}
              
              {patient.email && (
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{patient.email}</span>
                </div>
              )}
              
              {patient.direccion && (
                <div className="flex items-start space-x-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <span className="text-gray-700">{patient.direccion}</span>
                </div>
              )}
            </div>

            {/* Next Appointment */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Próxima Cita
              </h3>
              
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="flex items-center space-x-2 mb-1">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-900">
                    {formatDate(nextAppointment.date)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    10:00 AM - {nextAppointment.type}
                  </span>
                </div>
              </div>
            </div>

            {/* Medical Alerts */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Alertas Médicas
              </h3>
              
              <div className="space-y-2">
                {alerts.length > 0 ? (
                  alerts.map((alert, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />
                      <span className="text-sm text-gray-700">{alert.message}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Sin alertas médicas</p>
                )}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="info" size="sm">Ortodoncia</Badge>
            <Badge variant="success" size="sm">Tratamiento activo</Badge>
            <Badge variant="outline" size="sm">Seguro privado</Badge>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default PatientHeader

