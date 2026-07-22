import { Head, Link } from "@inertiajs/react"

import DashboardShell, { card } from "../../dashboard/DashboardShell"

function formatDate(value) {
  if (!value) return "Sin fecha definida"
  return new Intl.DateTimeFormat("es-GT", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`))
}

export default function ClientNotifications({ notifications, user }) {
  return <DashboardShell user={user}>
    <Head title="Notificaciones" />
    <div className="mb-5 flex items-center gap-3"><i className="bi bi-bell text-xl text-[#e5253b]" /><h1 className="m-0 text-xl font-extrabold uppercase">Notificaciones</h1></div>
    <div className="grid gap-3">
      {notifications.length === 0 ? <p className={card}>Todavía no tienes notificaciones.</p> : notifications.map((notification) => <article className={`${card} border-l-4 border-[#e5253b]`} key={notification.id}>
        <div className="flex items-start gap-3">
          <i className="bi bi-clipboard2-check mt-0.5 text-lg text-[#ff6476]" />
          <div className="min-w-0 flex-1">
            <h2 className="m-0 text-base font-extrabold">Se te asignó una rutina</h2>
            <p className="mb-1 mt-2">La rutina <strong>{notification.routine_name}</strong> estará disponible hasta el <strong>{formatDate(notification.expires_on)}</strong>.</p>
            <p className="m-0 text-xs text-[#aeb2ba]">Asignada el {formatDate(notification.assigned_at)}</p>
          </div>
        </div>
        {notification.status === "active" && <Link className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#ff6476]" href="/client/routines"><i className="bi bi-arrow-right" />Ver mis rutinas</Link>}
      </article>)}
    </div>
  </DashboardShell>
}
