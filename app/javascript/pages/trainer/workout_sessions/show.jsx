import { Head, Link, useForm } from "@inertiajs/react"
import { useEffect, useState } from "react"

import DashboardShell, { card } from "../../dashboard/DashboardShell"

function TechniqueBadge({ result }) {
  if (!result.exercise_set_type || result.exercise_set_type === "standard") return null

  return <div className="mt-3 rounded-md border border-[#3b4049] bg-[#171a20] px-3 py-2 text-xs text-[#c8cbd2]">
    <strong className="mr-2 uppercase text-[#ff6476]">{result.exercise_set_type_name}</strong>
    {(result.exercise_set_type === "bi_set" || result.exercise_set_type === "super_set") && <span>con {result.paired_exercise_name}</span>}
    {result.exercise_set_type === "drop_set" && <span>{result.drop_sets_count} bajada{Number(result.drop_sets_count) === 1 ? "" : "s"} de peso</span>}
    {result.technique_notes && <p className="mb-0 mt-1 leading-5">{result.technique_notes}</p>}
  </div>
}

function ResultDetails({ result }) {
  const isPairedSet = result.exercise_set_type === "bi_set" || result.exercise_set_type === "super_set"
  const isDropSet = result.exercise_set_type === "drop_set"
  const dropSetResults = Array.isArray(result.drop_set_results) ? result.drop_set_results : []

  return <div className="mt-3 grid gap-3">
    <div className="rounded-lg border border-[#3b4049] bg-[#171a20]/60 p-3">
      <h3 className="m-0 mb-2 text-sm font-extrabold uppercase text-white">{result.exercise_name}</h3>
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div><strong className="block text-lg text-white">{result.completed_sets}</strong>Series</div>
        <div><strong className="block text-lg text-white">{result.actual_repetitions}</strong>Reps</div>
        <div><strong className="block text-lg text-white">{result.actual_weight_lb ?? 0}</strong>lb</div>
      </div>
    </div>
    {isPairedSet && (
      <div className="rounded-lg border border-[#3b4049] bg-[#171a20]/60 p-3">
        <h3 className="m-0 mb-2 text-sm font-extrabold uppercase text-white">{result.paired_exercise_name}</h3>
        <div className="grid grid-cols-2 gap-2 text-center text-xs">
          <div><strong className="block text-lg text-white">{result.paired_actual_repetitions}</strong>Reps</div>
          <div><strong className="block text-lg text-white">{result.paired_actual_weight_lb ?? 0}</strong>lb</div>
        </div>
      </div>
    )}
    {isDropSet && dropSetResults.length > 0 && (
      <div className="rounded-lg border border-[#3b4049] bg-[#171a20]/60 p-3">
        <h3 className="m-0 mb-2 text-sm font-extrabold uppercase text-white">Bajadas del drop set</h3>
        <div className="grid gap-2">
          {dropSetResults.map((dropSet, index) => (
            <div className="grid grid-cols-3 gap-2 rounded-md bg-[#25282e] p-2 text-center text-xs" key={index}>
              <strong className="text-[#ff6476]">Bajada {index + 1}</strong>
              <span><strong className="text-white">{dropSet.repetitions || 0}</strong> reps</span>
              <span><strong className="text-white">{dropSet.weight_lb || 0}</strong> lb</span>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
}

export default function TrainerWorkoutShow({ user, workout }) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const { delete: destroy, processing } = useForm()

  useEffect(() => {
    if (!deleteOpen) return undefined

    function closeWithEscape(event) {
      if (event.key === "Escape" && !processing) setDeleteOpen(false)
    }

    document.addEventListener("keydown", closeWithEscape)
    return () => document.removeEventListener("keydown", closeWithEscape)
  }, [deleteOpen, processing])

  function deleteWorkout() {
    destroy(`/trainer/workouts/${workout.id}`, { onSuccess: () => setDeleteOpen(false) })
  }

  return <DashboardShell user={user}>
    <Head title={workout.client_name} />
    <Link className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-[#e5253b] no-underline hover:text-[#ff6678]" href="/trainer/workouts"><i aria-hidden="true" className="bi bi-arrow-left" />Actividad</Link>
    <h1 className="mb-1 text-xl font-extrabold uppercase">{workout.client_name}</h1>
    <p className="mb-5 text-sm text-[#aeb2ba]">{workout.routine_name}</p>
    <div className="grid gap-3">
      {workout.results.map((result) => <article className={card} key={result.id}>
        <div className="flex justify-between gap-3"><strong>{result.exercise_name}</strong><i className={`bi ${result.completed ? "bi-check-circle-fill text-emerald-400" : "bi-circle text-[#aeb2ba]"}`} /></div>
        <TechniqueBadge result={result} />
        <ResultDetails result={result} />
        {result.notes && <p className="mb-0 mt-3 border-t border-[#3b4049] pt-3 text-sm text-[#c8cbd2]">{result.notes}</p>}
      </article>)}
    </div>

    <button className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-lg border border-[#e5253b] bg-transparent text-sm font-extrabold text-white transition hover:bg-[#c91f33]" onClick={() => setDeleteOpen(true)} type="button">
      <i className="bi bi-trash mr-2" />Eliminar del historial
    </button>

    {deleteOpen && <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 px-4" onMouseDown={(event) => { if (event.target === event.currentTarget && !processing) setDeleteOpen(false) }}>
      <section aria-labelledby="delete-workout-title" aria-modal="true" className="w-full max-w-sm rounded-xl border border-[#3b4049] bg-[#25282e] p-5 text-white shadow-2xl" role="dialog">
        <div className="mb-4 flex items-start gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e5253b]/15 text-xl text-[#ff6678]"><i className="bi bi-exclamation-triangle-fill" /></span>
          <div>
            <h2 className="m-0 text-lg font-extrabold uppercase" id="delete-workout-title">Eliminar entrenamiento</h2>
            <p className="mb-0 mt-2 text-sm leading-6 text-[#c8cbd2]">Se eliminará la actividad de <strong className="text-white">{workout.client_name}</strong> en la rutina <strong className="text-white">{workout.routine_name}</strong>. Esta acción no se puede deshacer.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button className="h-11 rounded-lg border border-[#555b66] bg-transparent text-sm font-extrabold text-white transition hover:bg-[#343840]" disabled={processing} onClick={() => setDeleteOpen(false)} type="button">Cancelar</button>
          <button className="h-11 rounded-lg border-0 bg-[#e5253b] text-sm font-extrabold text-white transition hover:bg-[#c91f33] disabled:opacity-60" disabled={processing} onClick={deleteWorkout} type="button">{processing ? "Eliminando..." : "Sí, eliminar"}</button>
        </div>
      </section>
    </div>}
  </DashboardShell>
}
