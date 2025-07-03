export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      pacientes: {
        Row: {
          id: string
          rut: string
          nombre: string
          apellido: string
          email: string | null
          telefono: string | null
          fecha_nacimiento: string
          sexo: 'M' | 'F' | 'Otro'
          direccion: string | null
          contacto_emergencia: string | null
          telefono_emergencia: string | null
          alergias: string[] | null
          medicamentos: string[] | null
          enfermedades_previas: string[] | null
          doctor_id: string
          clinica_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          rut: string
          nombre: string
          apellido: string
          email?: string | null
          telefono?: string | null
          fecha_nacimiento: string
          sexo: 'M' | 'F' | 'Otro'
          direccion?: string | null
          contacto_emergencia?: string | null
          telefono_emergencia?: string | null
          alergias?: string[] | null
          medicamentos?: string[] | null
          enfermedades_previas?: string[] | null
          doctor_id: string
          clinica_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          rut?: string
          nombre?: string
          apellido?: string
          email?: string | null
          telefono?: string | null
          fecha_nacimiento?: string
          sexo?: 'M' | 'F' | 'Otro'
          direccion?: string | null
          contacto_emergencia?: string | null
          telefono_emergencia?: string | null
          alergias?: string[] | null
          medicamentos?: string[] | null
          enfermedades_previas?: string[] | null
          doctor_id?: string
          clinica_id?: string | null
          updated_at?: string
        }
      }
      fichas_clinicas: {
        Row: {
          id: string
          patient_id: string
          doctor_id: string
          fecha: string
          tipo_tratamiento: string
          diagnostico: string
          tratamiento_realizado: string
          observaciones: string | null
          proxima_cita: string | null
          archivos_adjuntos: string[] | null
          tags: string[] | null
          estado: 'activo' | 'completado' | 'cancelado'
          created_at: string
          updated_at: string
          created_by: string
          updated_by: string | null
        }
        Insert: {
          id?: string
          patient_id: string
          doctor_id: string
          fecha: string
          tipo_tratamiento: string
          diagnostico: string
          tratamiento_realizado: string
          observaciones?: string | null
          proxima_cita?: string | null
          archivos_adjuntos?: string[] | null
          tags?: string[] | null
          estado?: 'activo' | 'completado' | 'cancelado'
          created_at?: string
          updated_at?: string
          created_by: string
          updated_by?: string | null
        }
        Update: {
          id?: string
          patient_id?: string
          doctor_id?: string
          fecha?: string
          tipo_tratamiento?: string
          diagnostico?: string
          tratamiento_realizado?: string
          observaciones?: string | null
          proxima_cita?: string | null
          archivos_adjuntos?: string[] | null
          tags?: string[] | null
          estado?: 'activo' | 'completado' | 'cancelado'
          updated_at?: string
          updated_by?: string | null
        }
      }
      dental_charts: {
        Row: {
          id: string
          patient_id: string
          teeth: Json
          type: 'adult' | 'child'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          teeth: Json
          type: 'adult' | 'child'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          teeth?: Json
          type?: 'adult' | 'child'
          updated_at?: string
        }
      }
      doctores: {
        Row: {
          id: string
          nombre: string
          apellido: string
          especialidad: string
          email: string
          telefono: string | null
          clinica_id: string | null
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre: string
          apellido: string
          especialidad: string
          email: string
          telefono?: string | null
          clinica_id?: string | null
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          apellido?: string
          especialidad?: string
          email?: string
          telefono?: string | null
          clinica_id?: string | null
          user_id?: string
          updated_at?: string
        }
      }
      clinicas: {
        Row: {
          id: string
          nombre: string
          direccion: string
          telefono: string
          email: string
          rut: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre: string
          direccion: string
          telefono: string
          email: string
          rut: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          direccion?: string
          telefono?: string
          email?: string
          rut?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

