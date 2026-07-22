import { Head, Link } from "@inertiajs/react"

import DashboardShell, { card } from "../../dashboard/DashboardShell"

export default function ClientRoutines({ routines, user }) {
  return <DashboardShell user={user}>
    <Head title="Mis rutinas" />
    <h1 className="mb-5 text-xl font-extrabold uppercase">Mis rutinas</h1>
    <div className="mb-4 flex flex-wrap gap-4"><Link className="inline-flex items-center gap-2 text-sm font-bold text-[#e5253b]" href="/client/workouts"><i className="bi bi-clock-history" /> Ver historial</Link><Link className="inline-flex items-center gap-2 text-sm font-bold text-[#e5253b]" href="/client/progress"><i className="bi bi-graph-up" /> Ver progreso</Link></div>
    <div className="grid gap-3 lg:grid-cols-2 lg:gap-4">
      {routines.length === 0 ? <p className={card}>Tu entrenador todavía no te ha asignado rutinas.</p> : routines.map((routine) => (
        <Link className={`${card} block no-underline`} href={`/client/routines/${routine.id}`} key={routine.id}>
          <strong className="mb-2 block text-base text-white">{routine.name}</strong>
          {routine.goal && <p className="mb-2 text-[#c8cbd2]">{routine.goal}</p>}
          <span className="text-xs text-[#aeb2ba]">{routine.exercises_count} ejercicios{routine.expires_on ? ` · válida hasta ${routine.expires_on}` : ""}</span>
        </Link>
      ))}
    </div>
  </DashboardShell>
}
