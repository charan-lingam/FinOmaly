import { cva } from "class-variance-authority"
import { HTMLMotionProps, motion } from "motion/react"

import { cn } from "../../lib/utils"

const waveLoaderVariants = cva("flex gap-2 items-center justify-center", {
  variants: {
    messagePlacement: {
      bottom: "flex-col",
      right: "flex-row",
      left: "flex-row-reverse",
    },
  },
  defaultVariants: {
    messagePlacement: "bottom",
  },
})

export interface WaveLoaderProps {
  /**
   * The number of bouncing bars to display.
   * @default 5
   */
  bars?: number
  /**
   * Optional message to display alongside the bars.
   */
  message?: string
  /**
   * Position of the message relative to the loader.
   * @default bottom
   */
  messagePlacement?: "bottom" | "left" | "right"
  /**
   * Colour of the bars — defaults to the current text colour (foreground).
   */
  colour?: string
}

export function WaveLoader({
  bars = 5,
  message,
  messagePlacement,
  colour,
  className,
  ...props
}: HTMLMotionProps<"div"> & WaveLoaderProps) {
  return (
    <div className={cn(waveLoaderVariants({ messagePlacement }))}>
      <div className={cn("flex gap-1 items-center justify-center")}>
        {Array(bars)
          .fill(undefined)
          .map((_, index) => (
            <motion.div
              key={index}
              className={cn("w-2 h-5 origin-bottom", className)}
              style={{ backgroundColor: colour ?? "currentColor" }}
              animate={{ scaleY: [1, 1.5, 1] }}
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                delay: index * 0.1,
              }}
              {...props}
            />
          ))}
      </div>
      {message && (
        <div style={{ fontSize: 13, color: "currentColor", opacity: 0.6 }}>
          {message}
        </div>
      )}
    </div>
  )
}

