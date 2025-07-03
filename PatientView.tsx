'use client'

import React, { useState } from 'react'
import { Patient } from '@/types/patient'
import PatientHeader from '@/components/PatientHeader'
import PatientTabs from '@/components/PatientTabs'

interface PatientViewProps {
  patient: Patient
}

const PatientView: React.FC<PatientViewProps> = ({ patient }) => {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Patient Header - Apple Card Style */}
      <PatientHeader patient={patient} />
      
      {/* Patient Content Tabs */}
      <div className="flex-1 overflow-hidden">
        <PatientTabs 
          patient={patient}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
    </div>
  )
}

export default PatientView

