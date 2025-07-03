'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { getCurrentDoctor } from '@/lib/database'

interface Doctor {
  id: string
  nombre: string
  apellido: string
  especialidad: string
  email: string
  telefono?: string
  clinica_id?: string
  user_id: string
}

interface AuthContextType {
  user: User | null
  doctor: Doctor | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, doctorData: Partial<Doctor>) => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        const doctorData = await getCurrentDoctor()
        setDoctor(doctorData)
      }
      
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          const doctorData = await getCurrentDoctor()
          setDoctor(doctorData)
        } else {
          setDoctor(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const signUp = async (email: string, password: string, doctorData: Partial<Doctor>) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })

      if (error) return { error }

      // Create doctor profile
      if (data.user) {
        const { error: doctorError } = await supabase
          .from('doctores')
          .insert({
            user_id: data.user.id,
            email: email,
            nombre: doctorData.nombre || '',
            apellido: doctorData.apellido || '',
            especialidad: doctorData.especialidad || '',
            telefono: doctorData.telefono,
            clinica_id: doctorData.clinica_id
          })

        if (doctorError) {
          console.error('Error creating doctor profile:', doctorError)
        }
      }

      return { error }
    } catch (error) {
      return { error }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const value = {
    user,
    doctor,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

