interface ChevronDownProps {
  className?: string
}

const ChevronDown = ({ className }: ChevronDownProps) => {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      stroke-width="0"
      viewBox="0 0 448 512"
      height="200px"
      width="200px"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"></path>
    </svg>
  )
}

export default ChevronDown
