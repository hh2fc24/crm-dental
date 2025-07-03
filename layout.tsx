import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CRM Dental - Sistema de Gestión Clínica',
  description: 'Sistema profesional de gestión para clínicas dentales con interfaz elegante y funcionalidades avanzadas',
  keywords: 'CRM dental, gestión clínica, odontología, pacientes, historiales clínicos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        <div className="min-h-full bg-gradient-to-br from-slate-50 to-blue-50">
          {children}
        </div>
      </body>
    </html>
  )
}

