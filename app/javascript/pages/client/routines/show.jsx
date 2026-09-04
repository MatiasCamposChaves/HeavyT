import { Head, Link } from "@inertiajs/react"

import DashboardShell, { card, primaryButton } from "../../dashboard/DashboardShell"
import LinkifiedText from "../../shared/LinkifiedText"

const dayOptions = [
  { value: 1, label: "Lunes" }, { value: 2, label: "Martes" }, { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" }, { value: 5, label: "Viernes" }, { value: 6, label: "Sábado" },
  { value: 0, label: "Domingo" },
]

function TechniqueBadge({ exercise }) {
  if (!exercise.set_type || exercise.set_type === "standard") return null

  return <div className="mb-3 rounded-md border border-[#3b4049] bg-[#171a20] px-3 py-2 text-xs text-[#c8cbd2]">
    <strong className="mr-2 uppercase text-[#ff6476]">{exercise.set_type_name}</strong>
    {(exercise.set_type === "bi_set" || exercise.set_type === "super_set") && <span>con {exercise.paired_exercise_name}</span>}
    {exercise.set_type === "drop_set" && <span>{exercise.drop_sets_count} bajada{Number(exercise.drop_sets_count) === 1 ? "" : "s"} de peso</span>}
    {exercise.technique_notes && <LinkifiedText className="mb-0 mt-1 leading-5 text-[#c8cbd2]" text={exercise.technique_notes} />}
  </div>
}

export default function ClientRoutineShow({ routine, user }) {
  return <DashboardShell user={user}>
    <Head title={routine.name} />
    <Link className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-[#e5253b] no-underline hover:text-[#ff6678]" href="/client/routines"><i aria-hidden="true" className="bi bi-arrow-left" />Mis rutinas</Link>
    <h1 className="mb-1 text-xl font-extrabold uppercase">{routine.name}</h1>
    <p className="mb-4 text-sm text-[#aeb2ba]">Entrenador: {routine.trainer_name}</p>
    {routine.description && <LinkifiedText className="mb-4 leading-6 text-[#c8cbd2]" text={routine.description} />}
    <div className="grid gap-5">
      {dayOptions.map((day) => {
        const exercises = routine.exercises.filter((exercise) => exercise.day_of_week === day.value)
        if (exercises.length === 0) return null
        return <section className="grid gap-3" key={day.value}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#3b4049] pb-3">
            <h2 className="m-0 text-lg font-extrabold uppercase text-[#ff6476]">{day.label}</h2>
            <Link as="button" className={primaryButton} href={`/client/routines/${routine.id}/workout_sessions?day_of_week=${day.value}`} method="post"><i className="bi bi-play-circle mr-2" />Iniciar {day.label}</Link>
          </div>
          {exercises.map((exercise) => <article className={card} key={exercise.id}>
            <div className="mb-3 flex flex-col items-start justify-between gap-2 min-[360px]:flex-row min-[360px]:gap-3">
              <h3 className="m-0 text-base font-extrabold">{exercise.position}. {exercise.name}</h3>
              <strong className="whitespace-nowrap text-[#e5253b]">{exercise.sets} × {exercise.repetitions}</strong>
            </div>
            <TechniqueBadge exercise={exercise} />
            <div className="grid grid-cols-1 gap-2 text-xs text-[#c8cbd2] min-[360px]:grid-cols-2">
              <span>Descanso: {exercise.rest_seconds ?? 0} seg</span>
              {exercise.suggested_weight_lb && <span>Peso sugerido: {exercise.suggested_weight_lb} lb</span>}
            </div>
            {exercise.notes && <LinkifiedText className="mb-0 mt-3 border-t border-[#3b4049] pt-3 leading-5 text-[#c8cbd2]" text={exercise.notes} />}
          </article>)}
        </section>
      })}
    </div>
  </DashboardShell>
}
