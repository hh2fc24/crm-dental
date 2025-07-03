'use client'

import React, { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import ForgotPasswordForm from './ForgotPasswordForm'

type AuthMode = 'login' | 'register' | 'forgot-password'

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login')

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode)
  }

  const renderContent = () => {
    switch (mode) {
      case 'login':
        return (
          <LoginForm
            onToggleMode={() => handleModeChange('register')}
            onForgotPassword={() => handleModeChange('forgot-password')}
          />
        )
      case 'register':
        return (
          <RegisterForm
            onToggleMode={() => handleModeChange('login')}
          />
        )
      case 'forgot-password':
        return (
          <ForgotPasswordForm
            onBackToLogin={() => handleModeChange('login')}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Back Button */}
        {mode !== 'login' && (
          <button
            onClick={() => handleModeChange('login')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Volver</span>
          </button>
        )}

        {/* Auth Form */}
        <div className="animate-fade-in">
          {renderContent()}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            CRM Dental © 2024 - Sistema profesional de gestión clínica
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthPage

