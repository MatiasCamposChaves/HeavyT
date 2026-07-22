import { Head, Link } from "@inertiajs/react"

import DashboardShell, { card } from "../../dashboard/DashboardShell"

export default function ClientRoutines({ routines, user }) {
  return <DashboardShell user={user}>
    <Head title="Mis rutinas" />
    <h1 className="mb-5 text-xl font-extrabold uppercase">Mis rutinas</h1>
    <div className="grid gap-3">
      {routines.length === 0 ? <p className={card}>Tu entrenador todavía no te ha asignado rutinas.</p> : routines.map((routine) => (
        <Link className={`${card} block no-underline`} href={`/client/routines/${routine.id}`} key={routine.id}>
          <strong className="mb-2 block text-base text-white">{routine.name}</strong>
          {routine.goal && <p className="mb-2 text-[#c8cbd2]">{routine.goal}</p>}
          <span className="text-xs text-[#aeb2ba]">{routine.exercises_count} ejercicios</span>
        </Link>
      ))}
    </div>
  </DashboardShell>
}
