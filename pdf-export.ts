import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { Patient, FichaClinica } from '@/types/patient'
import { formatDate, formatRut, calculateAge } from './utils'

export interface PDFExportOptions {
  includeHeader?: boolean
  includeDentalChart?: boolean
  includeHistory?: boolean
  includeMedicalInfo?: boolean
  watermark?: string
}

export class PDFExporter {
  private pdf: jsPDF
  private pageWidth: number
  private pageHeight: number
  private margin: number
  private currentY: number

  constructor() {
    this.pdf = new jsPDF('p', 'mm', 'a4')
    this.pageWidth = this.pdf.internal.pageSize.getWidth()
    this.pageHeight = this.pdf.internal.pageSize.getHeight()
    this.margin = 20
    this.currentY = this.margin
  }

  async exportPatientRecord(
    patient: Patient, 
    records: FichaClinica[], 
    options: PDFExportOptions = {}
  ): Promise<void> {
    const {
      includeHeader = true,
      includeDentalChart = true,
      includeHistory = true,
      includeMedicalInfo = true,
      watermark
    } = options

    // Header
    if (includeHeader) {
      this.addHeader(patient)
    }

    // Patient Information
    this.addPatientInfo(patient)

    // Medical Information
    if (includeMedicalInfo) {
      this.addMedicalInfo(patient)
    }

    // Clinical History
    if (includeHistory && records.length > 0) {
      this.addClinicalHistory(records)
    }

    // Dental Chart (placeholder for now)
    if (includeDentalChart) {
      this.addDentalChartPlaceholder()
    }

    // Footer
    this.addFooter(watermark)

    // Save the PDF
    this.pdf.save(`ficha-clinica-${patient.nombre}-${patient.apellido}-${formatDate(new Date())}.pdf`)
  }

  private addHeader(patient: Patient): void {
    // Logo placeholder
    this.pdf.setFillColor(59, 130, 246) // Blue
    this.pdf.rect(this.margin, this.currentY, 40, 15, 'F')
    
    this.pdf.setTextColor(255, 255, 255)
    this.pdf.setFontSize(12)
    this.pdf.setFont('helvetica', 'bold')
    this.pdf.text('DENTAL CRM', this.margin + 2, this.currentY + 10)

    // Title
    this.pdf.setTextColor(0, 0, 0)
    this.pdf.setFontSize(20)
    this.pdf.setFont('helvetica', 'bold')
    this.pdf.text('FICHA CLÍNICA', this.pageWidth - this.margin - 60, this.currentY + 10)

    this.currentY += 25

    // Patient name
    this.pdf.setFontSize(16)
    this.pdf.setFont('helvetica', 'bold')
    this.pdf.text(`${patient.nombre} ${patient.apellido}`, this.margin, this.currentY)

    this.currentY += 10

    // Date
    this.pdf.setFontSize(10)
    this.pdf.setFont('helvetica', 'normal')
    this.pdf.setTextColor(100, 100, 100)
    this.pdf.text(`Generado el ${formatDate(new Date())}`, this.margin, this.currentY)

    this.currentY += 15
    this.addSeparator()
  }

  private addPatientInfo(patient: Patient): void {
    this.addSectionTitle('INFORMACIÓN DEL PACIENTE')

    const age = calculateAge(patient.fecha_nacimiento)
    const info = [
      ['RUT:', formatRut(patient.rut)],
      ['Edad:', `${age} años`],
      ['Sexo:', patient.sexo === 'M' ? 'Masculino' : patient.sexo === 'F' ? 'Femenino' : 'Otro'],
      ['Fecha de nacimiento:', formatDate(patient.fecha_nacimiento)],
      ['Teléfono:', patient.telefono || 'No registrado'],
      ['Email:', patient.email || 'No registrado'],
      ['Dirección:', patient.direccion || 'No registrada']
    ]

    this.addInfoTable(info)
    this.currentY += 10
  }

  private addMedicalInfo(patient: Patient): void {
    this.addSectionTitle('INFORMACIÓN MÉDICA')

    // Alergias
    this.pdf.setFontSize(12)
    this.pdf.setFont('helvetica', 'bold')
    this.pdf.text('Alergias:', this.margin, this.currentY)
    this.currentY += 6

    if (patient.alergias && patient.alergias.length > 0) {
      this.pdf.setFont('helvetica', 'normal')
      patient.alergias.forEach(allergy => {
        this.pdf.text(`• ${allergy}`, this.margin + 5, this.currentY)
        this.currentY += 5
      })
    } else {
      this.pdf.setFont('helvetica', 'italic')
      this.pdf.text('Sin alergias conocidas', this.margin + 5, this.currentY)
      this.currentY += 5
    }

    this.currentY += 5

    // Medicamentos
    this.pdf.setFont('helvetica', 'bold')
    this.pdf.text('Medicamentos actuales:', this.margin, this.currentY)
    this.currentY += 6

    if (patient.medicamentos && patient.medicamentos.length > 0) {
      this.pdf.setFont('helvetica', 'normal')
      patient.medicamentos.forEach(medication => {
        this.pdf.text(`• ${medication}`, this.margin + 5, this.currentY)
        this.currentY += 5
      })
    } else {
      this.pdf.setFont('helvetica', 'italic')
      this.pdf.text('Sin medicamentos actuales', this.margin + 5, this.currentY)
      this.currentY += 5
    }

    this.currentY += 5

    // Antecedentes
    this.pdf.setFont('helvetica', 'bold')
    this.pdf.text('Antecedentes médicos:', this.margin, this.currentY)
    this.currentY += 6

    if (patient.enfermedades_previas && patient.enfermedades_previas.length > 0) {
      this.pdf.setFont('helvetica', 'normal')
      patient.enfermedades_previas.forEach(condition => {
        this.pdf.text(`• ${condition}`, this.margin + 5, this.currentY)
        this.currentY += 5
      })
    } else {
      this.pdf.setFont('helvetica', 'italic')
      this.pdf.text('Sin antecedentes relevantes', this.margin + 5, this.currentY)
      this.currentY += 5
    }

    this.currentY += 10
  }

  private addClinicalHistory(records: FichaClinica[]): void {
    this.addSectionTitle('HISTORIAL CLÍNICO')

    records.forEach((record, index) => {
      if (this.currentY > this.pageHeight - 50) {
        this.pdf.addPage()
        this.currentY = this.margin
      }

      // Record header
      this.pdf.setFillColor(245, 245, 245)
      this.pdf.rect(this.margin, this.currentY - 2, this.pageWidth - 2 * this.margin, 8, 'F')

      this.pdf.setFontSize(12)
      this.pdf.setFont('helvetica', 'bold')
      this.pdf.text(`${index + 1}. ${record.tipo_tratamiento}`, this.margin + 2, this.currentY + 4)

      this.pdf.setFontSize(10)
      this.pdf.setFont('helvetica', 'normal')
      this.pdf.text(formatDate(record.fecha), this.pageWidth - this.margin - 30, this.currentY + 4)

      this.currentY += 12

      // Record details
      const details = [
        ['Diagnóstico:', record.diagnostico],
        ['Tratamiento realizado:', record.tratamiento_realizado]
      ]

      if (record.observaciones) {
        details.push(['Observaciones:', record.observaciones])
      }

      details.forEach(([label, value]) => {
        this.pdf.setFont('helvetica', 'bold')
        this.pdf.text(label, this.margin + 2, this.currentY)
        
        this.pdf.setFont('helvetica', 'normal')
        const lines = this.pdf.splitTextToSize(value, this.pageWidth - this.margin - 40)
        this.pdf.text(lines, this.margin + 35, this.currentY)
        this.currentY += lines.length * 5
      })

      this.currentY += 8
    })
  }

  private addDentalChartPlaceholder(): void {
    this.addSectionTitle('ODONTOGRAMA')
    
    this.pdf.setFontSize(10)
    this.pdf.setFont('helvetica', 'italic')
    this.pdf.text('El odontograma interactivo se encuentra disponible en la versión digital.', this.margin, this.currentY)
    this.currentY += 6
    this.pdf.text('Para ver el estado actual de cada diente, consulte la aplicación web.', this.margin, this.currentY)
    
    this.currentY += 20
  }

  private addSectionTitle(title: string): void {
    if (this.currentY > this.pageHeight - 30) {
      this.pdf.addPage()
      this.currentY = this.margin
    }

    this.pdf.setFontSize(14)
    this.pdf.setFont('helvetica', 'bold')
    this.pdf.setTextColor(59, 130, 246) // Blue
    this.pdf.text(title, this.margin, this.currentY)
    this.currentY += 8
    
    // Underline
    this.pdf.setDrawColor(59, 130, 246)
    this.pdf.line(this.margin, this.currentY, this.margin + 60, this.currentY)
    this.currentY += 8
    
    this.pdf.setTextColor(0, 0, 0) // Reset to black
  }

  private addInfoTable(info: string[][]): void {
    const colWidth = (this.pageWidth - 2 * this.margin) / 2

    info.forEach(([label, value]) => {
      this.pdf.setFontSize(10)
      this.pdf.setFont('helvetica', 'bold')
      this.pdf.text(label, this.margin, this.currentY)
      
      this.pdf.setFont('helvetica', 'normal')
      this.pdf.text(value, this.margin + colWidth / 2, this.currentY)
      
      this.currentY += 6
    })
  }

  private addSeparator(): void {
    this.pdf.setDrawColor(200, 200, 200)
    this.pdf.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY)
    this.currentY += 8
  }

  private addFooter(watermark?: string): void {
    const footerY = this.pageHeight - 15

    this.pdf.setFontSize(8)
    this.pdf.setFont('helvetica', 'normal')
    this.pdf.setTextColor(100, 100, 100)
    
    // Page number
    this.pdf.text(`Página ${this.pdf.getNumberOfPages()}`, this.pageWidth - this.margin - 20, footerY)
    
    // Watermark
    if (watermark) {
      this.pdf.text(watermark, this.margin, footerY)
    }
    
    // Generated by
    this.pdf.text('Generado por CRM Dental', this.pageWidth / 2 - 20, footerY)
  }
}

// Helper function to export patient record
export const exportPatientToPDF = async (
  patient: Patient,
  records: FichaClinica[],
  options?: PDFExportOptions
): Promise<void> => {
  const exporter = new PDFExporter()
  await exporter.exportPatientRecord(patient, records, options)
}

