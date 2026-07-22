import { Link, usePage } from "@inertiajs/react"

import Logo from "../auth/Logo"
import FlashToast from "./FlashToast"
import HelpPopover from "./HelpPopover"

export const card = "rounded-lg bg-[#25282e] p-4 text-sm text-[#e7e8ec] lg:p-5"
export const primaryButton = "inline-flex min-h-10 items-center justify-center rounded-lg bg-[#e5253b] px-4 text-sm font-extrabold text-white no-underline transition hover:bg-[#c91f33]"

const roleNames = { admin: "Administrador", client: "Cliente", trainer: "Entrenador" }

function NavLink({ action, compact = false }) {
  const currentPath = usePage().url.split("?")[0]
  const active = currentPath === action.href || (action.matchPrefix && currentPath.startsWith(action.matchPrefix))

  return <Link
    aria-label={action.label}
    className={compact
      ? `inline-flex h-11 items-center justify-center rounded-lg text-xl no-underline transition-colors ${active ? "bg-[#e5253b] text-white" : "text-[#c8cbd2] hover:bg-[#c91f33] hover:text-white"}`
      : `flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-bold no-underline transition-colors ${active ? "bg-[#e5253b] text-white" : "text-[#c8cbd2] hover:bg-[#343840] hover:text-white"}`}
    href={action.href}
    title={action.label}
  >
    <i aria-hidden="true" className={`bi ${action.icon} text-lg`} />
    {!compact && <span>{action.label}</span>}
  </Link>
}

export default function DashboardShell({ children, user }) {
  const homePath = `/${user.role}/dashboard`
  const mainAction = user.role === "trainer"
    ? { href: "/trainer/routines", matchPrefix: "/trainer/routines", icon: "bi-clipboard2-pulse", label: "Administrar rutinas" }
    : user.role === "client"
      ? { href: "/client/routines", matchPrefix: "/client/routines", icon: "bi-clipboard2-check", label: "Mis rutinas" }
      : { href: "/admin/users", matchPrefix: "/admin/users", icon: "bi-people", label: "Gestionar usuarios" }
  const profileAction = { href: `/${user.role}/profile`, icon: "bi-person", label: "Mi perfil" }
  const progressAction = user.role === "trainer"
    ? { href: "/trainer/progress", matchPrefix: "/trainer/progress", icon: "bi-graph-up-arrow", label: "Progreso de clientes" }
    : user.role === "client"
      ? { href: "/client/progress", matchPrefix: "/client/progress", icon: "bi-graph-up", label: "Mi progreso" }
      : null
  const notificationsAction = ["trainer", "client"].includes(user.role)
    ? { href: `/${user.role}/notifications`, matchPrefix: `/${user.role}/notifications`, icon: "bi-bell", label: "Notificaciones" }
    : null
  const actions = [
    { href: homePath, icon: "bi-house-door", label: "Inicio" },
    mainAction,
    progressAction,
    notificationsAction,
    profileAction,
  ].filter(Boolean)

  return <main className="min-h-dvh bg-[#101217] text-[#f6f7fb] lg:p-6">
    <div className="mx-auto min-h-dvh w-full lg:grid lg:min-h-[calc(100dvh-3rem)] lg:max-w-[1440px] lg:grid-cols-[250px_minmax(0,1fr)] lg:overflow-hidden lg:rounded-2xl lg:border lg:border-[#292d34] lg:bg-[#171a20] lg:shadow-2xl">
      <aside className="hidden border-r border-[#343840] bg-[#14171c] p-5 lg:flex lg:flex-col">
        <div className="mb-8"><Logo compact /></div>
        <nav aria-label="Navegación principal" className="grid gap-2">{actions.map((action) => <NavLink action={action} key={action.href} />)}</nav>
        <div className="mt-auto border-t border-[#343840] pt-5">
          <p className="m-0 text-xs font-bold uppercase tracking-wide text-[#e5253b]">{roleNames[user.role]}</p>
          <p className="mb-0 mt-1 break-words text-sm font-semibold">{user.full_name}</p>
        </div>
      </aside>

      <section className="relative flex min-h-dvh min-w-0 flex-col bg-[#171a20] px-4 py-5 sm:px-6 sm:py-6 lg:min-h-0 lg:px-8 lg:py-7 xl:px-10">
        <FlashToast />
        <header className="flex min-w-0 items-start justify-between gap-3 lg:hidden">
          <Logo compact />
          <div className="min-w-0 pt-2 text-right"><p className="m-0 text-xs font-bold uppercase tracking-wide text-[#e5253b]">{roleNames[user.role]}</p><p className="mt-1 break-words text-sm font-semibold">{user.full_name}</p><div className="mt-2 flex justify-end gap-2">{notificationsAction && <Link aria-label="Notificaciones" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e5253b] text-white transition hover:bg-[#c91f33]" href={notificationsAction.href}><i className="bi bi-bell" /></Link>}{user.role !== "admin" && <HelpPopover />}</div></div>
        </header>
        <header className="hidden items-center justify-between border-b border-[#343840] pb-5 lg:flex">
          <div><p className="m-0 text-xs font-bold uppercase tracking-[0.18em] text-[#e5253b]">HeavyT</p><p className="mb-0 mt-1 text-sm text-[#aeb2ba]">{roleNames[user.role]} · {user.full_name}</p></div>
          {user.role !== "admin" && <HelpPopover />}
        </header>

        <div className="mx-auto w-full max-w-[1120px] flex-1 py-5 lg:py-7">{children}</div>

        <footer className="border-t border-[#343840] pt-3 lg:hidden"><nav aria-label="Navegación principal" className="grid grid-cols-3 items-center gap-2">{[mainAction, actions[0], profileAction].map((action) => <NavLink action={action} compact key={action.href} />)}</nav></footer>
      </section>
    </div>
  </main>
}
