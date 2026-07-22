import { Head, Link } from "@inertiajs/react"

import DashboardShell, { card } from "../../dashboard/DashboardShell"

const dateText = (value) => new Intl.DateTimeFormat("es-GT", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value))

export default function WorkoutHistory({ user, workouts }) {
  return <DashboardShell user={user}>
    <Head title="Historial de entrenamientos" />
    <Link className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-[#e5253b] no-underline hover:text-[#ff6678]" href="/client/routines"><i aria-hidden="true" className="bi bi-arrow-left" />Mis rutinas</Link>
    <h1 className="mb-5 text-xl font-extrabold uppercase">Mi historial</h1>
    <div className="grid gap-3 lg:grid-cols-2 lg:gap-4">
      {workouts.length === 0 ? <p className={card}>Todavía no has iniciado entrenamientos.</p> : workouts.map((workout) => <Link className={`${card} block no-underline`} href={`/client/workouts/${workout.id}`} key={workout.id}>
        <div className="flex justify-between gap-3"><strong className="text-white">{workout.routine_name}</strong><span className={`text-xs font-bold uppercase ${workout.status === "completed" ? "text-emerald-300" : "text-[#ff8391]"}`}>{workout.status === "completed" ? "Completado" : "En progreso"}</span></div>
        <p className="mb-0 mt-2 text-xs text-[#aeb2ba]">{dateText(workout.started_at)}</p>
      </Link>)}
    </div>
  </DashboardShell>
}
