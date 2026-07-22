import { Link } from "@inertiajs/react"

import Logo from "../auth/Logo"

export const card = "rounded-lg bg-[#25282e] p-4 text-sm text-[#e7e8ec]"
export const primaryButton = "inline-flex min-h-10 items-center justify-center rounded-lg bg-[#e5253b] px-4 text-sm font-extrabold text-white no-underline transition hover:bg-[#c91f33]"

const roleNames = {
  admin: "Administrador",
  client: "Cliente",
  trainer: "Entrenador",
}

export default function DashboardShell({ children, user }) {
  return (
    <main className="min-h-dvh bg-[#101217] px-4 py-6 text-[#f6f7fb]">
      <div className="mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-[390px] flex-col rounded-xl bg-[#171a20] px-5 py-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <Logo compact />
          <div className="pt-2 text-right">
            <p className="m-0 text-xs font-bold uppercase tracking-wide text-[#e5253b]">{roleNames[user.role]}</p>
            <p className="mt-1 text-sm font-semibold">{user.full_name}</p>
          </div>
        </div>

        <div className="flex-1 py-5">{children}</div>

        <footer className="border-t border-[#343840] pt-4">
          <Link className="text-sm font-bold text-[#d7d9df] no-underline hover:text-white" href="/logout" method="delete" as="button">
            Cerrar sesión
          </Link>
        </footer>
      </div>
    </main>
  )
}
