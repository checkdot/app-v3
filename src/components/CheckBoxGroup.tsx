import { Checkbox } from "@headlessui/react"
import CheckIcon from "./svgs/CheckIcon"

interface CheckBoxGroupProps {
  selected: boolean
  onChange: (selected: boolean) => void
  label: string
  className?: string
}

const CheckBoxGroup = ({
  selected,
  onChange,
  label,
  className,
}: CheckBoxGroupProps) => {
  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <Checkbox
        checked={selected}
        onChange={onChange}
        className="group size-6 rounded-md p-1 border border-[#d0d7df] dark:border-[#1f3a55]"
      >
        <CheckIcon className="hidden size-4 stroke-black group-data-checked:block dark:stroke-white stroke-2" />
      </Checkbox>
      <label htmlFor={label} className="text-sm font-medium">
        {label}
      </label>
    </div>
  )
}

export default CheckBoxGroup
