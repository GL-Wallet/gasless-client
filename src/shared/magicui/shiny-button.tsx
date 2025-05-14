import type { AnimationProps, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/shared/lib/utils'
import { motion } from 'framer-motion'

import React, { useCallback } from 'react' // Import useCallback

const animationProps = {
  initial: { '--x': '100%', 'scale': 1 },
  animate: { '--x': '-100%', 'scale': 1 },
  whileTap: { scale: 1.1 },
  transition: {
    repeat: Infinity,
    repeatType: 'loop',
    repeatDelay: 1,
    type: 'spring',
    stiffness: 20,
    damping: 15,
    mass: 2,
    scale: {
      type: 'spring',
      stiffness: 200,
      damping: 5,
      mass: 0.5,
    },
  },
} as AnimationProps

type ShinyButtonProps = HTMLMotionProps<'button'> & {
  text: string
  className?: string
}

const ShinyButton = React.forwardRef<HTMLButtonElement, ShinyButtonProps>(
  ({ text, className, disabled = false, onClick, ...props }, ref) => {
    // Memoize the onClick handler
    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (onClick) {
          onClick(event)
        }
      },
      [onClick], // Dependency array
    )

    return (
      <motion.button
        {...animationProps}
        {...props}
        disabled={disabled}
        ref={ref}
        onClick={handleClick}
        className={cn(
          'relative rounded-lg px-6 py-4 font-medium backdrop-blur-xl transition-[box-shadow] duration-300 ease-in-out',
          {
            'bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/10%)_0%,transparent_60%)] hover:shadow dark:bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/10%)_0%,transparent_60%)] dark:hover:shadow-[0_0_20px_hsl(var(--primary)/10%)]':
              !disabled,
            'border cursor-not-allowed': disabled,
          },
          className,
        )}
      >
        <span
          className={cn('relative block h-full text-sm uppercase tracking-wide', {
            'text-[rgb(0,0,0,65%)] dark:font-light dark:text-[rgb(255,255,255,90%)]': !disabled,
            'text-gray-600 dark:text-muted-foreground/70': disabled,
          })}
          style={{
            maskImage: `linear-gradient(-75deg,hsl(var(--primary)) calc(var(--x) + 20%),transparent calc(var(--x) + 30%),hsl(var(--primary)) calc(var(--x) + 100%))`,
          }}
        >
          {text}
        </span>
        <span
          style={{
            mask: 'linear-gradient(rgb(0,0,0), rgb(0,0,0)) content-box,linear-gradient(rgb(0,0,0), rgb(0,0,0))',
            maskComposite: 'exclude',
          }}
          className={cn('absolute inset-0 z-10 block rounded-[inherit]', {
            'bg-[linear-gradient(-75deg,hsl(var(--primary)/10%)_calc(var(--x)+20%),hsl(var(--primary)/50%)_calc(var(--x)+25%),hsl(var(--primary)/10%)_calc(var(--x)+100%))] p-px':
              !disabled,
          })}
        >
        </span>
      </motion.button>
    )
  },
)

ShinyButton.displayName = 'ShinyButton'

export default ShinyButton
