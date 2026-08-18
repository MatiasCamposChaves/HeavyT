function EyeIcon({ hidden }) {
  if (hidden) {
    return (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
        <path
          d="M3 3l18 18M10.58 10.58a2 2 0 002.83 2.83M9.88 5.09A9.9 9.9 0 0112 4.86c4.52 0 8.3 3.02 9.5 7.14a10.28 10.28 0 01-2.06 3.6M6.1 6.1A10.08 10.08 0 002.5 12c1.2 4.12 4.98 7.14 9.5 7.14a9.9 9.9 0 004.33-.99"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path
        d="M2.5 12c1.2-4.12 4.98-7.14 9.5-7.14s8.3 3.02 9.5 7.14c-1.2 4.12-4.98 7.14-9.5 7.14S3.7 16.12 2.5 12z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M12 15a3 3 0 100-6 3 3 0 000 6z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  )
}

export default function PasswordVisibilityButton({ visible, onToggle }) {
  const label = visible ? "Ocultar contraseña" : "Mostrar contraseña"

  return (
    <button
      aria-label={label}
      className="absolute inset-y-1 right-1 inline-flex w-9 cursor-pointer items-center justify-center rounded-md border-0 bg-[#3a3e45] text-white transition-colors hover:bg-[#c91f33] focus-visible:bg-[#c91f33] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6f7fb]/70"
      title={label}
      type="button"
      onClick={onToggle}
    >
      <EyeIcon hidden={visible} />
    </button>
  )
}
