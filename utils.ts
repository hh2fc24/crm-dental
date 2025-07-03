import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRut(rut: string): string {
  // Eliminar puntos y guiones
  const cleanRut = rut.replace(/[.-]/g, '')
  
  // Separar número y dígito verificador
  const rutNumber = cleanRut.slice(0, -1)
  const dv = cleanRut.slice(-1)
  
  // Formatear con puntos
  const formattedNumber = rutNumber.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  
  return `${formattedNumber}-${dv}`
}

export function validateRut(rut: string): boolean {
  const cleanRut = rut.replace(/[.-]/g, '')
  
  if (cleanRut.length < 2) return false
  
  const rutNumber = cleanRut.slice(0, -1)
  const dv = cleanRut.slice(-1).toLowerCase()
  
  let sum = 0
  let multiplier = 2
  
  for (let i = rutNumber.length - 1; i >= 0; i--) {
    sum += parseInt(rutNumber[i]) * multiplier
    multiplier = multiplier === 7 ? 2 : multiplier + 1
  }
  
  const remainder = sum % 11
  const calculatedDv = remainder === 0 ? '0' : remainder === 1 ? 'k' : (11 - remainder).toString()
  
  return dv === calculatedDv
}

export function calculateAge(birthDate: string): number {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatDateTime(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function getToothStatusColor(status: string): string {
  const colors = {
    healthy: 'text-green-500',
    caries: 'text-red-500',
    endodoncia: 'text-purple-500',
    extraccion: 'text-gray-500',
    implante: 'text-cyan-500',
    corona: 'text-amber-500'
  }
  return colors[status as keyof typeof colors] || 'text-gray-400'
}

export function getToothStatusBg(status: string): string {
  const colors = {
    healthy: 'bg-green-100',
    caries: 'bg-red-100',
    endodoncia: 'bg-purple-100',
    extraccion: 'bg-gray-100',
    implante: 'bg-cyan-100',
    corona: 'bg-amber-100'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-50'
}

