import { Link } from "@inertiajs/react"

import Logo from "../auth/Logo"
import FlashToast from "./FlashToast"
import HelpPopover from "./HelpPopover"

export const card = "rounded-lg bg-[#25282e] p-4 text-sm text-[#e7e8ec]"
export const primaryButton = "inline-flex min-h-10 items-center justify-center rounded-lg bg-[#e5253b] px-4 text-sm font-extrabold text-white no-underline transition hover:bg-[#c91f33]"

const roleNames = {
  admin: "Administrador",
  client: "Cliente",
  trainer: "Entrenador",
}

export default function DashboardShell({ children, user }) {
  const homePath = `/${user.role}/dashboard`
  const mainAction = user.role === "trainer"
    ? { href: "/trainer/routines", icon: "bi-clipboard2-pulse", label: "Administrar rutinas" }
    : user.role === "client"
      ? { href: "/client/routines", icon: "bi-clipboard2-check", label: "Mis rutinas" }
      : { href: "/admin/users", icon: "bi-people", label: "Gestionar usuarios" }

  return (
    <main className="min-h-dvh bg-[#101217] text-[#f6f7fb] sm:px-4 sm:py-6">
      <div className="relative mx-auto flex min-h-dvh w-full flex-col bg-[#171a20] px-4 py-5 shadow-2xl sm:min-h-[calc(100dvh-3rem)] sm:max-w-[520px] sm:rounded-xl sm:px-6 sm:py-6">
        <FlashToast />
        <div className="flex min-w-0 items-start justify-between gap-3 sm:gap-4">
          <Logo compact />
          <div className="min-w-0 pt-2 text-right">
            <p className="m-0 text-xs font-bold uppercase tracking-wide text-[#e5253b]">{roleNames[user.role]}</p>
            <p className="mt-1 break-words text-sm font-semibold">{user.full_name}</p>
            {user.role !== "admin" && <HelpPopover />}
          </div>
        </div>

        <div className="flex-1 py-5">{children}</div>

        <footer className="border-t border-[#343840] pt-3">
          <nav aria-label="Navegación principal" className="grid grid-cols-3 items-center gap-2">
            <Link aria-label={mainAction.label} className="inline-flex h-11 items-center justify-center rounded-lg text-xl text-[#c8cbd2] no-underline transition-colors hover:bg-[#c91f33] hover:text-white" href={mainAction.href} title={mainAction.label}>
              <i aria-hidden="true" className={`bi ${mainAction.icon}`} />
            </Link>
            <Link aria-label="Inicio" className="inline-flex h-11 items-center justify-center rounded-lg text-xl text-[#c8cbd2] no-underline transition-colors hover:bg-[#c91f33] hover:text-white" href={homePath} title="Inicio">
              <i aria-hidden="true" className="bi bi-house-door" />
            </Link>
            <Link aria-label="Perfil" className="inline-flex h-11 items-center justify-center rounded-lg border-0 bg-transparent text-xl text-[#c8cbd2] no-underline transition-colors hover:bg-[#c91f33] hover:text-white" href={`/${user.role}/profile`} title="Perfil">
              <i aria-hidden="true" className="bi bi-person" />
            </Link>
          </nav>
        </footer>
      </div>
    </main>
  )
}
