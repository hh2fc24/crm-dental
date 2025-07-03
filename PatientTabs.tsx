'use client'

import React from 'react'
import { FileText, Smile, Calendar, Settings, Download, Lock, History, Bell } from 'lucide-react'
import { Patient } from '@/types/patient'
import { cn } from '@/lib/utils'
import { exportPatientToPDF } from '@/lib/pdf-export'
import PatientOverview from '@/components/PatientOverview'
import DentalChart from '@/components/dental/DentalChart'
import PrivateNotes from '@/components/PrivateNotes'
import EditHistory from '@/components/EditHistory'
import ReminderSystem from '@/components/ReminderSystem'

interface PatientTabsProps {
  patient: Patient
  activeTab: string
  onTabChange: (tab: string) => void
}

const tabs = [
  {
    id: 'overview',
    label: 'Resumen',
    icon: FileText,
    description: 'Información general y historial reciente'
  },
  {
    id: 'dental-chart',
    label: 'Odontograma',
    icon: Smile,
    description: 'Estado dental interactivo'
  },
  {
    id: 'history',
    label: 'Historial',
    icon: Calendar,
    description: 'Historial clínico completo'
  },
  {
    id: 'notes',
    label: 'Notas Privadas',
    icon: Lock,
    description: 'Notas confidenciales del doctor'
  },
  {
    id: 'reminders',
    label: 'Recordatorios',
    icon: Bell,
    description: 'Seguimiento y recordatorios'
  },
  {
    id: 'audit',
    label: 'Auditoría',
    icon: History,
    description: 'Historial de cambios'
  },
  {
    id: 'settings',
    label: 'Configuración',
    icon: Settings,
    description: 'Datos del paciente y configuración'
  }
]

const PatientTabs: React.FC<PatientTabsProps> = ({ patient, activeTab, onTabChange }) => {
  const handleExportPDF = async () => {
    try {
      // Mock data para el ejemplo
      const mockRecords = [
        {
          id: '1',
          patient_id: patient.id,
          doctor_id: patient.doctor_id,
          fecha: '2024-07-01',
          tipo_tratamiento: 'Limpieza dental',
          diagnostico: 'Gingivitis leve',
          tratamiento_realizado: 'Profilaxis y aplicación de flúor',
          observaciones: 'Paciente colaborativo, se recomienda control en 6 meses',
          proxima_cita: null,
          archivos_adjuntos: null,
          tags: ['limpieza', 'control'],
          estado: 'completado' as const,
          created_at: '2024-07-01T10:00:00Z',
          updated_at: '2024-07-01T10:00:00Z',
          created_by: patient.doctor_id,
          updated_by: null
        }
      ]

      await exportPatientToPDF(patient, mockRecords, {
        includeHeader: true,
        includeDentalChart: true,
        includeHistory: true,
        includeMedicalInfo: true,
        watermark: 'CRM Dental - Confidencial'
      })
    } catch (error) {
      console.error('Error exporting PDF:', error)
      alert('Error al exportar PDF. Por favor, intenta nuevamente.')
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <PatientOverview patient={patient} />
      case 'dental-chart':
        return <DentalChart patient={patient} />
      case 'history':
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Historial Clínico Completo</h2>
            <p className="text-gray-600">Aquí se mostraría el historial clínico completo del paciente con todas las consultas, tratamientos y evolución.</p>
          </div>
        )
      case 'notes':
        return (
          <div className="p-6">
            <PrivateNotes patientId={patient.id} doctorId={patient.doctor_id} />
          </div>
        )
      case 'reminders':
        return (
          <div className="p-6">
            <ReminderSystem patientId={patient.id} />
          </div>
        )
      case 'audit':
        return (
          <div className="p-6">
            <EditHistory entityId={patient.id} entityType="patient" />
          </div>
        )
      case 'settings':
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Configuración del Paciente</h2>
            <p className="text-gray-600">Configuración y datos del paciente, gestión de permisos y preferencias.</p>
          </div>
        )
      default:
        return <PatientOverview patient={patient} />
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex items-center justify-between">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    'flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap',
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Export Button */}
          <button 
            onClick={handleExportPDF}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Exportar PDF</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {renderTabContent()}
      </div>
    </div>
  )
}

export default PatientTabs

