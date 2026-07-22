import { Head, Link } from "@inertiajs/react"

import DashboardShell, { card } from "../../dashboard/DashboardShell"

const dateText = (value) => value ? new Intl.DateTimeFormat("es-GT", { dateStyle: "medium" }).format(new Date(value)) : "Sin entrenamientos"

export default function TrainerProgressIndex({ clients, user }) {
  return <DashboardShell user={user}>
    <Head title="Progreso de clientes" />
    <h1 className="mb-5 text-2xl font-extrabold uppercase">Progreso de clientes</h1>
    <div className="grid gap-4 lg:grid-cols-2">
      {clients.length === 0 ? <p className={card}>Todavía no tienes clientes vinculados.</p> : clients.map((client) => <Link className={`${card} block no-underline transition hover:ring-1 hover:ring-[#e5253b]`} href={`/trainer/progress/${client.id}`} key={client.id}>
        <div className="flex items-start justify-between gap-3"><div><strong className="text-base text-white">{client.full_name}</strong><p className="mb-0 mt-1 text-xs text-[#aeb2ba]">{client.email}</p></div><i className="bi bi-graph-up-arrow text-xl text-[#e5253b]" /></div>
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-[#3b4049] pt-3 text-xs"><div><strong className="block text-lg text-white">{client.completed_workouts}</strong>Sesiones</div><div><strong className="block text-lg text-white">{client.total_volume_lb}</strong>Volumen lb</div><div><strong className="block text-sm text-white">{dateText(client.last_workout_at)}</strong>Última</div></div>
      </Link>)}
    </div>
  </DashboardShell>
}
