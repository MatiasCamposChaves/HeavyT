import { Head, Link } from "@inertiajs/react"

import DashboardShell, { card, primaryButton } from "../../dashboard/DashboardShell"

export default function AdminDashboard({ stats, user }) {
  return (
    <DashboardShell user={user}>
      <Head title="Administración" />
      <h1 className="mb-5 text-xl font-extrabold uppercase">Panel administrativo</h1>

      <div className="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2">
        <section className={card}>
          <p className="mb-2 text-xs font-bold uppercase text-[#aeb2ba]">Clientes activos</p>
          <strong className="text-3xl text-[#e5253b]">{stats.clients}</strong>
        </section>
        <section className={card}>
          <p className="mb-2 text-xs font-bold uppercase text-[#aeb2ba]">Entrenadores activos</p>
          <strong className="text-3xl text-[#e5253b]">{stats.trainers}</strong>
        </section>
      </div>

      <section className={`${card} mt-4`}>
        <h2 className="mb-3 font-extrabold uppercase">Gestionar usuarios</h2>
        <Link className={`${primaryButton} w-full`} href="/admin/users">Abrir usuarios</Link>
      </section>
    </DashboardShell>
  )
}
