'use client'

import React, { useState, useEffect } from 'react'
import { Lock, Edit3, Save, X, Eye, EyeOff, Plus } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@/components/ui'
import { formatDateTime } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface PrivateNote {
  id: string
  content: string
  created_at: string
  updated_at: string
  created_by: string
  is_confidential: boolean
  tags?: string[]
}

interface PrivateNotesProps {
  patientId: string
  doctorId: string
  className?: string
}

const PrivateNotes: React.FC<PrivateNotesProps> = ({ patientId, doctorId, className }) => {
  const [notes, setNotes] = useState<PrivateNote[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [newNoteContent, setNewNoteContent] = useState('')
  const [showConfidential, setShowConfidential] = useState(false)
  const [isConfidential, setIsConfidential] = useState(false)

  // Mock data para desarrollo
  useEffect(() => {
    const mockNotes: PrivateNote[] = [
      {
        id: '1',
        content: 'Paciente muy ansioso durante los procedimientos. Recomendar sedación consciente para próximas intervenciones.',
        created_at: '2024-07-01T10:30:00Z',
        updated_at: '2024-07-01T10:30:00Z',
        created_by: doctorId,
        is_confidential: true,
        tags: ['ansiedad', 'sedación']
      },
      {
        id: '2',
        content: 'Excelente higiene oral. Paciente muy colaborativo y cumple con todas las indicaciones.',
        created_at: '2024-06-15T14:20:00Z',
        updated_at: '2024-06-15T14:20:00Z',
        created_by: doctorId,
        is_confidential: false,
        tags: ['higiene', 'colaborativo']
      },
      {
        id: '3',
        content: 'Historial familiar de enfermedad periodontal. Monitorear de cerca el estado de las encías.',
        created_at: '2024-05-20T09:15:00Z',
        updated_at: '2024-05-20T09:15:00Z',
        created_by: doctorId,
        is_confidential: true,
        tags: ['antecedentes', 'periodoncia']
      }
    ]
    setNotes(mockNotes)
  }, [doctorId])

  const filteredNotes = showConfidential 
    ? notes 
    : notes.filter(note => !note.is_confidential)

  const handleSaveNote = () => {
    if (!newNoteContent.trim()) return

    const newNote: PrivateNote = {
      id: Date.now().toString(),
      content: newNoteContent.trim(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: doctorId,
      is_confidential: isConfidential,
      tags: []
    }

    setNotes(prev => [newNote, ...prev])
    setNewNoteContent('')
    setIsEditing(false)
    setIsConfidential(false)
  }

  const handleEditNote = (noteId: string, newContent: string) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId 
        ? { ...note, content: newContent, updated_at: new Date().toISOString() }
        : note
    ))
    setEditingNoteId(null)
  }

  const handleDeleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId))
  }

  const NoteCard: React.FC<{ note: PrivateNote }> = ({ note }) => {
    const [isEditingThis, setIsEditingThis] = useState(false)
    const [editContent, setEditContent] = useState(note.content)

    const handleSaveEdit = () => {
      handleEditNote(note.id, editContent)
      setIsEditingThis(false)
    }

    const handleCancelEdit = () => {
      setEditContent(note.content)
      setIsEditingThis(false)
    }

    return (
      <Card className={cn(
        'transition-all duration-200',
        note.is_confidential && 'border-amber-200 bg-amber-50'
      )}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              {note.is_confidential && (
                <Lock className="w-4 h-4 text-amber-600" />
              )}
              <span className="text-xs text-gray-500">
                {formatDateTime(note.created_at)}
              </span>
              {note.updated_at !== note.created_at && (
                <Badge variant="outline" size="sm">Editado</Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsEditingThis(true)}
                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                title="Editar nota"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteNote(note.id)}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                title="Eliminar nota"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {isEditingThis ? (
            <div className="space-y-3">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                autoFocus
              />
              <div className="flex space-x-2">
                <Button size="sm" onClick={handleSaveEdit}>
                  <Save className="w-4 h-4 mr-1" />
                  Guardar
                </Button>
                <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-700 text-sm leading-relaxed mb-3">
                {note.content}
              </p>
              
              {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {note.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Lock className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Notas Privadas</h3>
          <Badge variant="outline" size="sm">
            {notes.length} nota{notes.length !== 1 ? 's' : ''}
          </Badge>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowConfidential(!showConfidential)}
            className={cn(
              'flex items-center space-x-1 px-3 py-1 rounded-lg text-sm transition-colors',
              showConfidential 
                ? 'bg-amber-100 text-amber-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            {showConfidential ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span>Confidenciales</span>
          </button>
          
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            <Plus className="w-4 h-4 mr-1" />
            Nueva nota
          </Button>
        </div>
      </div>

      {/* New Note Form */}
      {isEditing && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="space-y-3">
              <textarea
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder="Escribe tu nota privada aquí..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                autoFocus
              />
              
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isConfidential}
                    onChange={(e) => setIsConfidential(e.target.checked)}
                    className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-sm text-gray-700 flex items-center">
                    <Lock className="w-4 h-4 mr-1 text-amber-600" />
                    Nota confidencial
                  </span>
                </label>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditing(false)
                      setNewNoteContent('')
                      setIsConfidential(false)
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSaveNote}
                    disabled={!newNoteContent.trim()}
                  >
                    <Save className="w-4 h-4 mr-1" />
                    Guardar nota
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes List */}
      <div className="space-y-3">
        {filteredNotes.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Lock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                {showConfidential 
                  ? 'No hay notas registradas' 
                  : 'No hay notas no confidenciales'
                }
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Las notas privadas solo son visibles para ti
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))
        )}
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <Lock className="w-4 h-4 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Privacidad de las notas</p>
            <p>
              Las notas privadas solo son visibles para ti y no aparecen en reportes o exportaciones. 
              Las notas marcadas como confidenciales requieren permisos especiales para ser visualizadas.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivateNotes

