'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const variantStyles: Record<string, string> = {
  primary:
    'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
  secondary:
    'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-400',
  outline:
    'border-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus-visible:ring-gray-400',
  ghost:
    'text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-400',
}

const sizeStyles: Record<string, string> = {
  sm: 'px-3 py-2 text-sm min-h-[44px]',
  md: 'px-4 py-3 text-base min-h-[48px]',
  lg: 'px-6 py-4 text-base min-h-[48px]',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) {
    return (
      <button
        ref={ref}
        className={`
          inline-flex items-center justify-center rounded-lg font-semibold
          transition-colors duration-150
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `.trim()}
        {...props}
      >
        {children}
      </button>
    )
  }
)
