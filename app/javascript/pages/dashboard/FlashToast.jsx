import { usePage } from "@inertiajs/react"
import { useEffect, useState } from "react"

export default function FlashToast({ kind: suppliedKind, message: suppliedMessage } = {}) {
  const { flash } = usePage().props
  const message = suppliedMessage || flash?.alert || flash?.notice
  const kind = suppliedKind || (flash?.alert ? "alert" : "notice")
  const [visible, setVisible] = useState(Boolean(message))

  useEffect(() => {
    setVisible(Boolean(message))
    if (!message) return undefined

    const timer = window.setTimeout(() => setVisible(false), 4500)
    return () => window.clearTimeout(timer)
  }, [message, kind])

  if (!message || !visible) return null

  const danger = kind === "alert"

  return (
    <div aria-atomic="true" aria-live="polite" className="pointer-events-none absolute inset-x-3 top-3 z-[100] flex justify-center sm:inset-x-5 sm:top-5">
      <div className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border bg-[#25282e] p-4 text-sm text-white shadow-2xl ${danger ? "border-[#e5253b]" : "border-emerald-500"}`} role={danger ? "alert" : "status"}>
        <i aria-hidden="true" className={`bi mt-0.5 text-lg ${danger ? "bi-exclamation-circle-fill text-[#ff6678]" : "bi-check-circle-fill text-emerald-400"}`} />
        <p className="m-0 flex-1 font-bold leading-5">{message}</p>
        <button aria-label="Cerrar notificación" className="-m-1 inline-flex h-8 w-8 items-center justify-center rounded-md border-0 bg-transparent text-lg text-[#c8cbd2] transition-colors hover:bg-[#c91f33] hover:text-white" onClick={() => setVisible(false)} type="button">
          <i aria-hidden="true" className="bi bi-x-lg" />
        </button>
      </div>
    </div>
  )
}
