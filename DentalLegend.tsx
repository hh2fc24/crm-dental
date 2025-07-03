'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import ToothSVG from './ToothSVG'

const DentalLegend: React.FC = () => {
  const legendItems = [
    {
      status: 'healthy' as const,
      label: 'Sano',
      description: 'Diente en buen estado'
    },
    {
      status: 'caries' as const,
      label: 'Caries',
      description: 'Presencia de caries dental'
    },
    {
      status: 'endodoncia' as const,
      label: 'Endodoncia',
      description: 'Tratamiento de conducto'
    },
    {
      status: 'corona' as const,
      label: 'Corona',
      description: 'Corona dental colocada'
    },
    {
      status: 'implante' as const,
      label: 'Implante',
      description: 'Implante dental'
    },
    {
      status: 'extraccion' as const,
      label: 'Extracción',
      description: 'Diente extraído'
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leyenda</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {legendItems.map((item) => (
          <div key={item.status} className="flex items-center space-x-3">
            <ToothSVG
              toothNumber={11} // Usar un número de diente estándar para la leyenda
              status={item.status}
              className="flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{item.label}</p>
              <p className="text-xs text-gray-500">{item.description}</p>
            </div>
          </div>
        ))}
        
        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Haz clic en cualquier diente para editar su estado y agregar notas.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default DentalLegend

