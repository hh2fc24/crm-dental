export interface Patient {
  id: string
  rut: string
  nombre: string
  apellido: string
  email?: string
  telefono?: string
  fecha_nacimiento: string
  sexo: 'M' | 'F' | 'Otro'
  direccion?: string
  contacto_emergencia?: string
  telefono_emergencia?: string
  alergias?: string[]
  medicamentos?: string[]
  enfermedades_previas?: string[]
  doctor_id: string
  clinica_id?: string
  created_at: string
  updated_at: string
}

export interface FichaClinica {
  id: string
  patient_id: string
  doctor_id: string
  fecha: string
  tipo_tratamiento: string
  diagnostico: string
  tratamiento_realizado: string
  observaciones?: string
  proxima_cita?: string
  archivos_adjuntos?: string[]
  tags?: string[]
  estado: 'activo' | 'completado' | 'cancelado'
  created_at: string
  updated_at: string
  created_by: string
  updated_by?: string
}

export interface ToothStatus {
  number: number
  status: 'healthy' | 'caries' | 'endodoncia' | 'extraccion' | 'implante' | 'corona'
  notes?: string
  date?: string
}

export interface DentalChart {
  id: string
  patient_id: string
  teeth: ToothStatus[]
  type: 'adult' | 'child' // 32 piezas adulto, 20 niño
  created_at: string
  updated_at: string
}

export interface Doctor {
  id: string
  nombre: string
  apellido: string
  especialidad: string
  email: string
  telefono?: string
  clinica_id?: string
}

export interface Clinica {
  id: string
  nombre: string
  direccion: string
  telefono: string
  email: string
  rut: string
}

