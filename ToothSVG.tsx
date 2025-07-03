'use client'

import React from 'react'
import { ToothStatus } from '@/types/patient'
import { cn } from '@/lib/utils'

interface ToothSVGProps {
  toothNumber: number
  status: ToothStatus['status']
  onClick?: () => void
  className?: string
}

const ToothSVG: React.FC<ToothSVGProps> = ({ toothNumber, status, onClick, className }) => {
  const getToothColor = (status: ToothStatus['status']) => {
    switch (status) {
      case 'healthy':
        return '#ffffff'
      case 'caries':
        return '#ef4444'
      case 'endodoncia':
        return '#8b5cf6'
      case 'extraccion':
        return '#64748b'
      case 'implante':
        return '#06b6d4'
      case 'corona':
        return '#f59e0b'
      default:
        return '#ffffff'
    }
  }

  const getStrokeColor = (status: ToothStatus['status']) => {
    switch (status) {
      case 'healthy':
        return '#d1d5db'
      case 'caries':
        return '#dc2626'
      case 'endodoncia':
        return '#7c3aed'
      case 'extraccion':
        return '#475569'
      case 'implante':
        return '#0891b2'
      case 'corona':
        return '#d97706'
      default:
        return '#d1d5db'
    }
  }

  // Determinar si es un diente frontal o posterior basado en el número
  const isFrontalTooth = (num: number) => {
    const lastDigit = num % 10
    return lastDigit >= 1 && lastDigit <= 3
  }

  const isCanine = (num: number) => {
    const lastDigit = num % 10
    return lastDigit === 3
  }

  const isPremolar = (num: number) => {
    const lastDigit = num % 10
    return lastDigit === 4 || lastDigit === 5
  }

  const isMolar = (num: number) => {
    const lastDigit = num % 10
    return lastDigit >= 6 && lastDigit <= 8
  }

  // Renderizar diferentes formas de dientes según el tipo
  const renderToothShape = () => {
    const fillColor = getToothColor(status)
    const strokeColor = getStrokeColor(status)
    
    if (status === 'extraccion') {
      // Mostrar X para dientes extraídos
      return (
        <g>
          <rect
            x="2"
            y="2"
            width="36"
            height="36"
            rx="4"
            fill="#f3f4f6"
            stroke={strokeColor}
            strokeWidth="2"
            strokeDasharray="4,4"
          />
          <path
            d="M12 12 L28 28 M28 12 L12 28"
            stroke={strokeColor}
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
      )
    }

    if (isFrontalTooth(toothNumber)) {
      // Incisivos - forma rectangular redondeada
      return (
        <rect
          x="8"
          y="4"
          width="24"
          height="32"
          rx="6"
          ry="4"
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="2"
        />
      )
    }

    if (isCanine(toothNumber)) {
      // Caninos - forma puntiaguda
      return (
        <path
          d="M20 4 L32 36 L8 36 Z"
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      )
    }

    if (isPremolar(toothNumber)) {
      // Premolares - forma cuadrada con dos cúspides
      return (
        <g>
          <rect
            x="6"
            y="6"
            width="28"
            height="28"
            rx="4"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="2"
          />
          <line
            x1="20"
            y1="6"
            x2="20"
            y2="34"
            stroke={strokeColor}
            strokeWidth="1"
            opacity="0.5"
          />
        </g>
      )
    }

    if (isMolar(toothNumber)) {
      // Molares - forma cuadrada con cuatro cúspides
      return (
        <g>
          <rect
            x="4"
            y="4"
            width="32"
            height="32"
            rx="6"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="2"
          />
          <line
            x1="20"
            y1="4"
            x2="20"
            y2="36"
            stroke={strokeColor}
            strokeWidth="1"
            opacity="0.5"
          />
          <line
            x1="4"
            y1="20"
            x2="36"
            y2="20"
            stroke={strokeColor}
            strokeWidth="1"
            opacity="0.5"
          />
        </g>
      )
    }

    // Forma por defecto
    return (
      <rect
        x="6"
        y="6"
        width="28"
        height="28"
        rx="4"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="2"
      />
    )
  }

  // Agregar indicadores especiales para ciertos estados
  const renderStatusIndicator = () => {
    if (status === 'implante') {
      return (
        <circle
          cx="20"
          cy="20"
          r="3"
          fill="#ffffff"
          stroke="#0891b2"
          strokeWidth="2"
        />
      )
    }

    if (status === 'corona') {
      return (
        <path
          d="M12 8 L28 8 L30 12 L26 16 L14 16 L10 12 Z"
          fill="#fbbf24"
          stroke="#d97706"
          strokeWidth="1"
        />
      )
    }

    if (status === 'endodoncia') {
      return (
        <line
          x1="20"
          y1="8"
          x2="20"
          y2="32"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )
    }

    return null
  }

  return (
    <div
      className={cn(
        'relative w-10 h-10 transition-all duration-200',
        onClick && 'cursor-pointer hover:scale-110',
        className
      )}
      onClick={onClick}
      title={`Diente ${toothNumber} - ${status}`}
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        className="w-full h-full"
      >
        {renderToothShape()}
        {renderStatusIndicator()}
      </svg>
      
      {/* Tooltip on hover */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 pointer-events-none transition-opacity duration-200 hover:opacity-100 whitespace-nowrap z-10">
        Diente {toothNumber}
      </div>
    </div>
  )
}

export default ToothSVG

