import { Head, Link } from "@inertiajs/react"
import DashboardShell, { card } from "../../dashboard/DashboardShell"

const dateText = (value) => new Intl.DateTimeFormat("es-GT", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value))

export default function TrainerWorkoutHistory({ user, workouts }) {
  return <DashboardShell user={user}><Head title="Actividad de clientes" /><h1 className="mb-5 text-xl font-extrabold uppercase">Actividad de clientes</h1><div className="grid gap-3 lg:grid-cols-2 lg:gap-4">
    {workouts.length === 0 ? <p className={card}>Tus clientes todavía no han registrado entrenamientos.</p> : workouts.map((workout) => <Link className={`${card} block no-underline`} href={`/trainer/workouts/${workout.id}`} key={workout.id}><div className="flex justify-between gap-3"><strong className="text-white">{workout.client_name}</strong><span className={`text-xs font-bold uppercase ${workout.status === "completed" ? "text-emerald-300" : "text-[#ff8391]"}`}>{workout.status === "completed" ? "Completado" : "En progreso"}</span></div><p className="mb-1 mt-2 text-sm text-[#c8cbd2]">{workout.routine_name}</p><p className="m-0 text-xs text-[#aeb2ba]">{dateText(workout.started_at)}</p></Link>)}
  </div></DashboardShell>
}
