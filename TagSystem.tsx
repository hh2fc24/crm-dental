'use client'

import React, { useState, useRef, useEffect } from 'react'
import { X, Plus, Tag } from 'lucide-react'
import { Badge, Button } from '@/components/ui'
import { cn } from '@/lib/utils'

interface TagSystemProps {
  tags: string[]
  onTagsChange: (tags: string[]) => void
  suggestions?: string[]
  placeholder?: string
  maxTags?: number
  className?: string
}

const defaultSuggestions = [
  'Ortodoncia',
  'Implantes',
  'Endodoncia',
  'Periodoncia',
  'Cirugía oral',
  'Estética dental',
  'Prótesis',
  'Limpieza',
  'Urgencia',
  'Control',
  'Seguimiento',
  'Tratamiento activo',
  'Tratamiento completado',
  'Seguro privado',
  'Seguro público',
  'Paciente VIP',
  'Primera consulta',
  'Paciente recurrente'
]

const TagSystem: React.FC<TagSystemProps> = ({
  tags,
  onTagsChange,
  suggestions = defaultSuggestions,
  placeholder = 'Agregar tag...',
  maxTags = 10,
  className
}) => {
  const [inputValue, setInputValue] = useState('')
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = suggestions.filter(
        suggestion => 
          suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
          !tags.includes(suggestion)
      )
      setFilteredSuggestions(filtered)
    } else {
      setFilteredSuggestions([])
    }
  }, [inputValue, suggestions, tags])

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim()
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < maxTags) {
      onTagsChange([...tags, trimmedTag])
      setInputValue('')
      setFilteredSuggestions([])
    }
  }

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove))
  }

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (inputValue.trim()) {
        addTag(inputValue)
      }
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1])
    } else if (e.key === 'Escape') {
      setInputValue('')
      setIsInputFocused(false)
      inputRef.current?.blur()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    addTag(suggestion)
    inputRef.current?.focus()
  }

  const getTagColor = (tag: string) => {
    // Asignar colores basados en el tipo de tag
    const treatmentTags = ['Ortodoncia', 'Implantes', 'Endodoncia', 'Periodoncia', 'Cirugía oral', 'Estética dental', 'Prótesis']
    const statusTags = ['Tratamiento activo', 'Tratamiento completado', 'Urgencia', 'Control', 'Seguimiento']
    const patientTags = ['Paciente VIP', 'Primera consulta', 'Paciente recurrente']
    const insuranceTags = ['Seguro privado', 'Seguro público']

    if (treatmentTags.includes(tag)) return 'info'
    if (statusTags.includes(tag)) return 'success'
    if (patientTags.includes(tag)) return 'warning'
    if (insuranceTags.includes(tag)) return 'outline'
    return 'default'
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Tags Display */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant={getTagColor(tag) as any}
              className="flex items-center space-x-1 pr-1"
            >
              <Tag className="w-3 h-3" />
              <span>{tag}</span>
              <button
                onClick={() => removeTag(tag)}
                className="ml-1 p-0.5 hover:bg-black/10 rounded-full transition-colors"
                aria-label={`Eliminar tag ${tag}`}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="relative">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleInputKeyDown}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setTimeout(() => setIsInputFocused(false), 200)}
              placeholder={tags.length >= maxTags ? `Máximo ${maxTags} tags` : placeholder}
              disabled={tags.length >= maxTags}
              className={cn(
                'w-full px-3 py-2 text-sm border border-gray-300 rounded-lg',
                'focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none',
                'disabled:bg-gray-100 disabled:cursor-not-allowed',
                'transition-all duration-200'
              )}
            />
            
            {/* Suggestions Dropdown */}
            {isInputFocused && filteredSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                {filteredSuggestions.slice(0, 8).map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <Tag className="w-3 h-3 text-gray-400" />
                      <span>{suggestion}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => inputValue.trim() && addTag(inputValue)}
            disabled={!inputValue.trim() || tags.length >= maxTags}
            className="flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Quick Add Suggestions */}
      {!isInputFocused && tags.length < maxTags && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">Sugerencias rápidas:</p>
          <div className="flex flex-wrap gap-1">
            {suggestions
              .filter(suggestion => !tags.includes(suggestion))
              .slice(0, 6)
              .map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => addTag(suggestion)}
                  className="px-2 py-1 text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  + {suggestion}
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Help Text */}
      <p className="text-xs text-gray-500">
        Presiona Enter para agregar un tag personalizado • {tags.length}/{maxTags} tags
      </p>
    </div>
  )
}

export default TagSystem

