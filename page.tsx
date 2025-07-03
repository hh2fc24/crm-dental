'use client'

import { useState } from 'react'
import { AuthProvider, useAuth } from '@/components/auth/AuthProvider'
import AuthPage from '@/components/auth/AuthPage'
import Sidebar from '@/components/Sidebar'
import PatientView from '@/components/PatientView'
import { Patient } from '@/types/patient'
import { Loading } from '@/components/ui'

function DashboardContent() {
  const { user, doctor, loading } = useAuth()
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <Loading size="lg" />
          <p className="mt-4 text-gray-600">Cargando CRM Dental...</p>
        </div>
      </div>
    )
  }

  if (!user || !doctor) {
    return <AuthPage />
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Sidebar */}
      <div className="w-80 flex-shrink-0">
        <Sidebar 
          onPatientSelect={setSelectedPatient}
          selectedPatient={selectedPatient}
        />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {selectedPatient ? (
          <PatientView patient={selectedPatient} />
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Bienvenido, Dr. {doctor.nombre} {doctor.apellido}
              </h2>
              <p className="text-gray-600 max-w-md mb-4">
                Selecciona un paciente desde el panel lateral para ver su ficha clínica completa
              </p>
              <div className="text-sm text-gray-500">
                <p>Especialidad: {doctor.especialidad}</p>
                {doctor.telefono && <p>Teléfono: {doctor.telefono}</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  )
}

