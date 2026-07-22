import { Head, Link } from "@inertiajs/react"

import DashboardShell, { card } from "../../dashboard/DashboardShell"
import LinkifiedText from "../../shared/LinkifiedText"

export default function ClientRoutineShow({ routine, user }) {
  return <DashboardShell user={user}>
    <Head title={routine.name} />
    <Link className="mb-3 inline-block text-sm font-bold text-[#e5253b]" href="/client/routines">← Mis rutinas</Link>
    <h1 className="mb-1 text-xl font-extrabold uppercase">{routine.name}</h1>
    <p className="mb-4 text-sm text-[#aeb2ba]">Entrenador: {routine.trainer_name}</p>
    {routine.description && <LinkifiedText className="mb-4 leading-6 text-[#c8cbd2]" text={routine.description} />}
    <div className="grid gap-3">
      {routine.exercises.map((exercise) => (
        <article className={card} key={exercise.id}>
          <div className="mb-3 flex flex-col items-start justify-between gap-2 min-[360px]:flex-row min-[360px]:gap-3">
            <h2 className="m-0 text-base font-extrabold">{exercise.position}. {exercise.name}</h2>
            <strong className="whitespace-nowrap text-[#e5253b]">{exercise.sets} × {exercise.repetitions}</strong>
          </div>
          <div className="grid grid-cols-1 gap-2 text-xs text-[#c8cbd2] min-[360px]:grid-cols-2">
            <span>Descanso: {exercise.rest_seconds ?? 0} seg</span>
            {exercise.suggested_weight_lb && <span>Peso sugerido: {exercise.suggested_weight_lb} lb</span>}
          </div>
          {exercise.notes && <LinkifiedText className="mb-0 mt-3 border-t border-[#3b4049] pt-3 leading-5 text-[#c8cbd2]" text={exercise.notes} />}
        </article>
      ))}
    </div>
  </DashboardShell>
}
