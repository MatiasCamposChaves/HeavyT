export default function PasswordVisibilityButton({ visible, onToggle }) {
  const label = visible ? "Ocultar contraseña" : "Mostrar contraseña"

  return (
    <button
      aria-label={label}
      className="absolute inset-y-1 right-1 inline-flex w-9 items-center justify-center rounded-md border-0 bg-[#3a3e45] text-white transition-colors hover:bg-[#c91f33]"
      title={label}
      type="button"
      onClick={onToggle}
    >
      <i aria-hidden="true" className={`bi ${visible ? "bi-eye-slash" : "bi-eye"} text-base leading-none`} />
    </button>
  )
}
