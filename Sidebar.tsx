'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Search, Plus, User, Phone, Calendar } from 'lucide-react'
import { Input, Avatar, Badge, LoadingSpinner } from '@/components/ui'
import { Patient } from '@/types/patient'
import { searchPatients } from '@/lib/database'
import { formatRut, calculateAge } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface SidebarProps {
  onPatientSelect: (patient: Patient) => void
  selectedPatient: Patient | null
}

// Datos de ejemplo para desarrollo
const mockPatients: Patient[] = [
  {
    id: '1',
    rut: '12345678-9',
    nombre: 'María',
    apellido: 'González',
    email: 'maria.gonzalez@email.com',
    telefono: '+56912345678',
    fecha_nacimiento: '1985-03-15',
    sexo: 'F',
    direccion: 'Av. Providencia 1234, Santiago',
    doctor_id: 'doc1',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    rut: '98765432-1',
    nombre: 'Carlos',
    apellido: 'Rodríguez',
    email: 'carlos.rodriguez@email.com',
    telefono: '+56987654321',
    fecha_nacimiento: '1978-11-22',
    sexo: 'M',
    direccion: 'Las Condes 567, Santiago',
    doctor_id: 'doc1',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    rut: '11223344-5',
    nombre: 'Ana',
    apellido: 'Martínez',
    email: 'ana.martinez@email.com',
    telefono: '+56911223344',
    fecha_nacimiento: '1992-07-08',
    sexo: 'F',
    direccion: 'Ñuñoa 890, Santiago',
    doctor_id: 'doc1',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
]

const Sidebar: React.FC<SidebarProps> = ({ onPatientSelect, selectedPatient }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [patients, setPatients] = useState<Patient[]>(mockPatients)
  const [isLoading, setIsLoading] = useState(false)

  // Filtrar pacientes basado en el término de búsqueda
  const filteredPatients = useMemo(() => {
    if (!searchTerm.trim()) return patients

    const term = searchTerm.toLowerCase()
    return patients.filter(patient => 
      patient.nombre.toLowerCase().includes(term) ||
      patient.apellido.toLowerCase().includes(term) ||
      patient.rut.includes(term) ||
      patient.telefono?.includes(term)
    )
  }, [patients, searchTerm])

  // Función para buscar pacientes (simulada por ahora)
  const handleSearch = async (term: string) => {
    if (term.length < 2) return

    setIsLoading(true)
    try {
      // En producción, usar: const results = await searchPatients(term)
      // Por ahora usamos datos mock
      await new Promise(resolve => setTimeout(resolve, 300)) // Simular delay
      // setPatients(results)
    } catch (error) {
      console.error('Error searching patients:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm) {
        handleSearch(searchTerm)
      }
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm])

  const getPatientInitials = (patient: Patient) => {
    return `${patient.nombre.charAt(0)}${patient.apellido.charAt(0)}`.toUpperCase()
  }

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-900">Pacientes</h1>
          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <Plus className="w-5 h-5" />
          </button>
        </div>
        
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar por nombre, RUT o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-xl text-sm placeholder:text-gray-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200"
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <LoadingSpinner />
            </div>
          )}
        </div>
      </div>

      {/* Patient List */}
      <div className="flex-1 overflow-y-auto">
        {filteredPatients.length === 0 ? (
          <div className="p-6 text-center">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              {searchTerm ? 'No se encontraron pacientes' : 'No hay pacientes registrados'}
            </p>
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                onClick={() => onPatientSelect(patient)}
                className={cn(
                  'p-4 rounded-xl cursor-pointer transition-all duration-200 group',
                  'hover:bg-gray-50 hover:shadow-sm',
                  selectedPatient?.id === patient.id 
                    ? 'bg-blue-50 border border-blue-200 shadow-sm' 
                    : 'border border-transparent'
                )}
              >
                <div className="flex items-start space-x-3">
                  <Avatar
                    size="md"
                    fallback={getPatientInitials(patient)}
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900 truncate">
                        {patient.nombre} {patient.apellido}
                      </h3>
                      <Badge variant="outline" size="sm">
                        {calculateAge(patient.fecha_nacimiento)} años
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      {formatRut(patient.rut)}
                    </p>
                    
                    <div className="space-y-1">
                      {patient.telefono && (
                        <div className="flex items-center text-xs text-gray-500">
                          <Phone className="w-3 h-3 mr-1" />
                          {patient.telefono}
                        </div>
                      )}
                      
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        Última visita: Hace 2 días
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">
          {filteredPatients.length} paciente{filteredPatients.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  )
}

export default Sidebar

