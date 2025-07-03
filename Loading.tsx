import React from 'react'
import { cn } from '@/lib/utils'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  text?: string
}

const Loading: React.FC<LoadingProps> = ({ size = 'md', className, text }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className={cn('flex items-center justify-center space-x-2', className)}>
      <div className={cn('animate-spin rounded-full border-2 border-gray-300 border-t-blue-600', sizeClasses[size])} />
      {text && <span className="text-sm text-gray-600">{text}</span>}
    </div>
  )
}

const LoadingSpinner: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 w-4 h-4', className)} />
)

const LoadingDots: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('flex space-x-1', className)}>
    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
  </div>
)

const LoadingPulse: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('w-4 h-4 bg-blue-600 rounded-full animate-pulse', className)} />
)

export { Loading, LoadingSpinner, LoadingDots, LoadingPulse }

