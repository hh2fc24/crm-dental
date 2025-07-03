'use client'

import React from 'react'
import { Calendar, Clock, User, FileText, AlertCircle, Pill, Heart } from 'lucide-react'
import { Patient } from '@/types/patient'
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui'
import { formatDate, formatDateTime } from '@/lib/utils'

interface PatientOverviewProps {
  patient: Patient
}

// Datos mock para el historial clínico
const mockRecords = [
  {
    id: '1',
    fecha: '2024-07-01',
    tipo_tratamiento: 'Limpieza dental',
    diagnostico: 'Gingivitis leve',
    tratamiento_realizado: 'Profilaxis y aplicación de flúor',
    doctor: 'Dr. Juan Pérez',
    estado: 'completado'
  },
  {
    id: '2',
    fecha: '2024-06-15',
    tipo_tratamiento: 'Consulta de control',
    diagnostico: 'Control post-tratamiento',
    tratamiento_realizado: 'Evaluación de evolución de tratamiento ortodóncico',
    doctor: 'Dr. Juan Pérez',
    estado: 'completado'
  },
  {
    id: '3',
    fecha: '2024-05-20',
    tipo_tratamiento: 'Ortodoncia',
    diagnostico: 'Maloclusión clase II',
    tratamiento_realizado: 'Ajuste de brackets y cambio de arco',
    doctor: 'Dr. Juan Pérez',
    estado: 'activo'
  }
]

const PatientOverview: React.FC<PatientOverviewProps> = ({ patient }) => {
  return (
    <div className="p-6 space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card variant="elevated" padding="md">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Última visita</p>
              <p className="font-semibold text-gray-900">Hace 2 días</p>
            </div>
          </div>
        </Card>

        <Card variant="elevated" padding="md">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total consultas</p>
              <p className="font-semibold text-gray-900">12</p>
            </div>
          </div>
        </Card>

        <Card variant="elevated" padding="md">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Próxima cita</p>
              <p className="font-semibold text-gray-900">15 Jul</p>
            </div>
          </div>
        </Card>

        <Card variant="elevated" padding="md">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <User className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Estado</p>
              <Badge variant="success" size="sm">Activo</Badge>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Medical History */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>Historial Clínico Reciente</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRecords.map((record) => (
                  <div key={record.id} className="border-l-4 border-blue-200 pl-4 py-2">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{record.tipo_tratamiento}</h4>
                        <p className="text-sm text-gray-600">{formatDate(record.fecha)}</p>
                      </div>
                      <Badge 
                        variant={record.estado === 'completado' ? 'success' : 'info'} 
                        size="sm"
                      >
                        {record.estado}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-1">
                      <strong>Diagnóstico:</strong> {record.diagnostico}
                    </p>
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Tratamiento:</strong> {record.tratamiento_realizado}
                    </p>
                    <p className="text-xs text-gray-500">Dr. {record.doctor}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Medical Information */}
        <div className="space-y-6">
          {/* Allergies & Medications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span>Información Médica</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Allergies */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <AlertCircle className="w-4 h-4 text-red-500 mr-1" />
                  Alergias
                </h4>
                {patient.alergias && patient.alergias.length > 0 ? (
                  <div className="space-y-1">
                    {patient.alergias.map((allergy, index) => (
                      <Badge key={index} variant="error" size="sm">
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Sin alergias conocidas</p>
                )}
              </div>

              {/* Medications */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <Pill className="w-4 h-4 text-blue-500 mr-1" />
                  Medicamentos
                </h4>
                {patient.medicamentos && patient.medicamentos.length > 0 ? (
                  <div className="space-y-1">
                    {patient.medicamentos.map((medication, index) => (
                      <p key={index} className="text-sm text-gray-700">• {medication}</p>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Sin medicamentos actuales</p>
                )}
              </div>

              {/* Medical History */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <Heart className="w-4 h-4 text-pink-500 mr-1" />
                  Antecedentes
                </h4>
                {patient.enfermedades_previas && patient.enfermedades_previas.length > 0 ? (
                  <div className="space-y-1">
                    {patient.enfermedades_previas.map((condition, index) => (
                      <p key={index} className="text-sm text-gray-700">• {condition}</p>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Sin antecedentes relevantes</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          {(patient.contacto_emergencia || patient.telefono_emergencia) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-green-600" />
                  <span>Contacto de Emergencia</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {patient.contacto_emergencia && (
                  <p className="text-sm text-gray-700 mb-1">
                    <strong>Nombre:</strong> {patient.contacto_emergencia}
                  </p>
                )}
                {patient.telefono_emergencia && (
                  <p className="text-sm text-gray-700">
                    <strong>Teléfono:</strong> {patient.telefono_emergencia}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default PatientOverview

