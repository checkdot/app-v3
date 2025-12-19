interface InputGroupProps {
  label: string
  type: string
  id: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

const InputGroup = ({
  label,
  type,
  id,
  value,
  onChange,
  placeholder,
  className,
  disabled,
}: InputGroupProps) => {
  return (
    <div className={`flex flex-col gap-2 ${className ?? ""}`}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        type={type}
        id={id}
        className="w-full rounded-lg border border-[#d0d7df] dark:border-[#1f3a55] bg-transparent p-2 disabled:opacity-50 disabled:cursor-not-allowed"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  )
}

export default InputGroup
