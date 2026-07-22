import { Head, Link } from "@inertiajs/react"

import DashboardShell, { card, primaryButton } from "../../dashboard/DashboardShell"

export default function RoutinesIndex({ routines, user }) {
  return (
    <DashboardShell user={user}>
      <Head title="Mis rutinas" />
      <div className="mb-5 flex items-center justify-between gap-3">
        <h1 className="m-0 text-xl font-extrabold uppercase">Mis rutinas</h1>
        <Link className={primaryButton} href="/trainer/routines/new">Nueva</Link>
      </div>
      <div className="grid gap-3 lg:grid-cols-2 lg:gap-4">
        {routines.length === 0 ? <p className={card}>Todavía no has creado rutinas.</p> : routines.map((routine) => (
          <Link className={`${card} block no-underline`} href={`/trainer/routines/${routine.id}`} key={routine.id}>
            <div className="mb-2 flex justify-between gap-3">
              <strong className="text-base text-white">{routine.name}</strong>
              <span className="text-xs font-bold uppercase text-[#e5253b]">{routine.status === "active" ? "Activa" : "Borrador"}</span>
            </div>
            {routine.goal && <p className="mb-2 text-[#c8cbd2]">{routine.goal}</p>}
            <p className="m-0 text-xs text-[#aeb2ba]">{routine.exercises_count} ejercicios · {routine.assignments_count} clientes</p>
          </Link>
        ))}
      </div>
    </DashboardShell>
  )
}
