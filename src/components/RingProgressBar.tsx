"use client"

interface RingProgressBarProps {
  progress: number // 0-100
  size?: number
  strokeWidth?: number
  ringColor?: string
  progressColor?: string
  showPercentage?: boolean
  children?: React.ReactNode
  className?: string
}

const RingProgressBar = ({
  progress,
  size = 120,
  strokeWidth = 8,
  ringColor,
  progressColor = "#33f693",
  showPercentage = false,
  children,
  className = "",
}: RingProgressBarProps) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (clampedProgress / 100) * circumference

  // Default ring color with dark mode support
  const defaultRingColor = ringColor || "#afafaf7a"

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
    >
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        style={{ width: size, height: size }}
      >
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={defaultRingColor}
          strokeWidth={strokeWidth}
          className="dark:stroke-[#d2d2d212]"
        />
        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-in-out"
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children ? (
          children
        ) : showPercentage ? (
          <span className="text-sm sm:text-base font-semibold">
            {clampedProgress.toFixed(0)}%
          </span>
        ) : null}
      </div>
    </div>
  )
}

export default RingProgressBar
