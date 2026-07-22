import { Head, Link, useForm } from "@inertiajs/react"

import DashboardShell, { card, primaryButton } from "../../dashboard/DashboardShell"

function Notification({ notification }) {
  const { data, patch, processing, setData } = useForm({ weeks: 1 })
  const expired = notification.type === "expired"

  function extend(event) {
    event.preventDefault()
    patch(`/trainer/notifications/${notification.id}/extend_assignment`, { preserveScroll: true })
  }

  return <article className={`${card} border-l-4 ${expired ? "border-[#e5253b]" : "border-[#f0a126]"}`}>
    <div className="flex items-start gap-3">
      <i className={`bi ${expired ? "bi-exclamation-circle" : "bi-clock"} mt-0.5 text-lg ${expired ? "text-[#ff6476]" : "text-[#f0a126]"}`} />
      <div className="min-w-0 flex-1">
        <h2 className="m-0 text-base font-extrabold uppercase">{expired ? "La rutina venció" : "La rutina está por vencer"}</h2>
        <p className="mb-1 mt-2 text-[#e7e8ec]"><strong>{notification.routine_name}</strong> · {notification.client_name}</p>
        <p className="m-0 text-xs text-[#aeb2ba]">Vencimiento: {notification.expires_on}</p>
      </div>
    </div>
    <div className="mt-4 flex flex-wrap items-end gap-2">
      <form className="flex flex-wrap items-end gap-2" onSubmit={extend}>
        <label className="grid gap-1 text-xs font-bold uppercase text-[#aeb2ba]">Extender semanas
          <input className="h-10 w-24 rounded-lg border border-[#3b4049] bg-[#171a20] px-3 text-white outline-none focus:border-[#e5253b]" min="1" max="52" type="number" value={data.weeks} onChange={(event) => setData("weeks", event.target.value)} />
        </label>
        <button className={`${primaryButton} border-0`} disabled={processing} type="submit">Extender</button>
      </form>
      <Link as="button" className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#e5253b] bg-transparent px-4 text-sm font-extrabold text-white transition hover:bg-[#c91f33]" href={`/trainer/notifications/${notification.id}/archive_assignment`} method="patch" preserveScroll>Retirar rutina</Link>
    </div>
  </article>
}

export default function NotificationsIndex({ notifications, user }) {
  return <DashboardShell user={user}>
    <Head title="Notificaciones" />
    <div className="mb-5 flex items-center gap-3"><i className="bi bi-bell text-xl text-[#e5253b]" /><h1 className="m-0 text-xl font-extrabold uppercase">Notificaciones</h1></div>
    <div className="grid gap-3">
      {notifications.length === 0 ? <p className={card}>No tienes rutinas próximas a vencer.</p> : notifications.map((notification) => <Notification key={notification.id} notification={notification} />)}
    </div>
  </DashboardShell>
}
