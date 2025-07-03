'use client'

import React, { useState, useEffect } from 'react'
import { Patient, ToothStatus } from '@/types/patient'
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui'
import { getToothStatusColor, getToothStatusBg } from '@/lib/utils'
import ToothSVG from './ToothSVG'
import DentalLegend from './DentalLegend'
import ToothModal from './ToothModal'

interface DentalChartProps {
  patient: Patient
}

// Configuración de dientes para adultos (32 piezas)
const adultTeethConfig = {
  upperRight: [18, 17, 16, 15, 14, 13, 12, 11],
  upperLeft: [21, 22, 23, 24, 25, 26, 27, 28],
  lowerLeft: [38, 37, 36, 35, 34, 33, 32, 31],
  lowerRight: [41, 42, 43, 44, 45, 46, 47, 48]
}

// Configuración de dientes para niños (20 piezas)
const childTeethConfig = {
  upperRight: [55, 54, 53, 52, 51],
  upperLeft: [61, 62, 63, 64, 65],
  lowerLeft: [75, 74, 73, 72, 71],
  lowerRight: [81, 82, 83, 84, 85]
}

const DentalChart: React.FC<DentalChartProps> = ({ patient }) => {
  const [chartType, setChartType] = useState<'adult' | 'child'>('adult')
  const [teethStatus, setTeethStatus] = useState<ToothStatus[]>([])
  const [selectedTooth, setSelectedTooth] = useState<ToothStatus | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const teethConfig = chartType === 'adult' ? adultTeethConfig : childTeethConfig

  // Inicializar estado de dientes
  useEffect(() => {
    const initializeTeeth = () => {
      const allTeeth: ToothStatus[] = []
      
      Object.values(teethConfig).forEach(quadrant => {
        quadrant.forEach(toothNumber => {
          allTeeth.push({
            number: toothNumber,
            status: 'healthy',
            notes: '',
            date: new Date().toISOString()
          })
        })
      })
      
      setTeethStatus(allTeeth)
    }

    initializeTeeth()
  }, [chartType])

  const getToothStatus = (toothNumber: number): ToothStatus => {
    return teethStatus.find(tooth => tooth.number === toothNumber) || {
      number: toothNumber,
      status: 'healthy',
      notes: '',
      date: new Date().toISOString()
    }
  }

  const updateToothStatus = (toothNumber: number, status: ToothStatus['status'], notes?: string) => {
    setTeethStatus(prev => prev.map(tooth => 
      tooth.number === toothNumber 
        ? { ...tooth, status, notes: notes || tooth.notes, date: new Date().toISOString() }
        : tooth
    ))
  }

  const handleToothClick = (toothNumber: number) => {
    const tooth = getToothStatus(toothNumber)
    setSelectedTooth(tooth)
    setIsModalOpen(true)
  }

  const handleToothUpdate = (toothNumber: number, status: ToothStatus['status'], notes: string) => {
    updateToothStatus(toothNumber, status, notes)
    setIsModalOpen(false)
  }

  const renderQuadrant = (quadrant: number[], position: 'upper-right' | 'upper-left' | 'lower-left' | 'lower-right') => {
    return (
      <div className={`flex ${position.includes('left') ? 'flex-row-reverse' : ''} space-x-2`}>
        {quadrant.map(toothNumber => {
          const tooth = getToothStatus(toothNumber)
          return (
            <div key={toothNumber} className="flex flex-col items-center">
              <div className="text-xs text-gray-500 mb-1">{toothNumber}</div>
              <ToothSVG
                toothNumber={toothNumber}
                status={tooth.status}
                onClick={() => handleToothClick(toothNumber)}
                className="cursor-pointer hover:scale-110 transition-transform duration-200"
              />
            </div>
          )
        })}
      </div>
    )
  }

  const getStatusCounts = () => {
    const counts = {
      healthy: 0,
      caries: 0,
      endodoncia: 0,
      extraccion: 0,
      implante: 0,
      corona: 0
    }

    teethStatus.forEach(tooth => {
      counts[tooth.status]++
    })

    return counts
  }

  const statusCounts = getStatusCounts()

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Odontograma</h2>
          <p className="text-gray-600">Estado dental interactivo de {patient.nombre} {patient.apellido}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setChartType('adult')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                chartType === 'adult' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Adulto (32)
            </button>
            <button
              onClick={() => setChartType('child')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                chartType === 'child' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Niño (20)
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Dental Chart */}
        <div className="xl:col-span-3">
          <Card>
            <CardContent className="p-8">
              <div className="space-y-8">
                {/* Upper Jaw */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 text-center">Maxilar Superior</h3>
                  <div className="flex justify-center space-x-8">
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-2">Derecho</div>
                      {renderQuadrant(teethConfig.upperRight, 'upper-right')}
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-2">Izquierdo</div>
                      {renderQuadrant(teethConfig.upperLeft, 'upper-left')}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200"></div>

                {/* Lower Jaw */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 text-center">Maxilar Inferior</h3>
                  <div className="flex justify-center space-x-8">
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-2">Izquierdo</div>
                      {renderQuadrant(teethConfig.lowerLeft, 'lower-left')}
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-2">Derecho</div>
                      {renderQuadrant(teethConfig.lowerRight, 'lower-right')}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Legend */}
          <DentalLegend />

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Sanos</span>
                </div>
                <Badge variant="success" size="sm">{statusCounts.healthy}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Caries</span>
                </div>
                <Badge variant="error" size="sm">{statusCounts.caries}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Endodoncia</span>
                </div>
                <Badge variant="outline" size="sm">{statusCounts.endodoncia}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Extracciones</span>
                </div>
                <Badge variant="outline" size="sm">{statusCounts.extraccion}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Implantes</span>
                </div>
                <Badge variant="info" size="sm">{statusCounts.implante}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Coronas</span>
                </div>
                <Badge variant="warning" size="sm">{statusCounts.corona}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tooth Modal */}
      {selectedTooth && (
        <ToothModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          tooth={selectedTooth}
          onUpdate={handleToothUpdate}
        />
      )}
    </div>
  )
}

export default DentalChart

