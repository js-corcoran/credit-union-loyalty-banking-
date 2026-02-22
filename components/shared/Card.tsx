'use client'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  as?: 'div' | 'section' | 'article'
  ariaLabel?: string
}

export function Card({
  children,
  className = '',
  onClick,
  as: Component = 'div',
  ariaLabel,
}: CardProps) {
  return (
    <Component
      className={`
        bg-white rounded-xl border border-gray-200
        shadow-[0_1px_2px_rgba(0,0,0,0.05)]
        ${onClick ? 'cursor-pointer hover:shadow-[0_4px_6px_rgba(0,0,0,0.1)] transition-shadow duration-150' : ''}
        ${className}
      `.trim()}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={ariaLabel}
      onKeyDown={
        onClick
          ? (e: React.KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick()
              }
            }
          : undefined
      }
    >
      {children}
    </Component>
  )
}
