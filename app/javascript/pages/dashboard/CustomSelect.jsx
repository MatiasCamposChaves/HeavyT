import { useState } from "react"

export default function CustomSelect({
  buttonClassName,
  label,
  labelClassName = "grid gap-2 text-xs font-bold uppercase text-[#aeb2ba]",
  onChange,
  options,
  placeholder = "Selecciona una opción",
  value,
}) {
  const [open, setOpen] = useState(false)
  const selected = options.find((option) => String(option.value) === String(value))

  function choose(option) {
    onChange(option.value)
    setOpen(false)
  }

  return (
    <div
      className={`relative ${labelClassName}`}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
      }}
    >
      {label && <span>{label}</span>}
      <button
        aria-expanded={open}
        className={`${buttonClassName} flex cursor-pointer items-center justify-between text-left font-extrabold normal-case`}
        type="button"
        onClick={() => setOpen((current) => !current)}
      >
        <span className={selected ? "text-white" : "text-[#8f96a3]"}>{selected?.label || placeholder}</span>
        <i aria-hidden="true" className={`bi ${open ? "bi-chevron-up" : "bi-chevron-down"} text-xs text-[#aeb2ba]`} />
      </button>

      {open && (
        <div
          className="absolute left-0 right-0 top-full z-40 mt-1 max-h-64 overflow-y-auto rounded-md border border-[#3b4049] bg-[#171a20] py-1 shadow-xl shadow-black/30"
          role="listbox"
          tabIndex={-1}
        >
          {options.map((option) => {
            const active = String(option.value) === String(value)

            return (
              <button
                aria-selected={active}
                className={`block w-full px-3 py-2 text-left text-sm font-extrabold normal-case text-white transition-colors hover:bg-[#e5253b] focus:bg-[#e5253b] focus:outline-none ${active ? "bg-[#e5253b]" : "bg-[#171a20]"}`}
                key={option.value}
                role="option"
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(option)}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
