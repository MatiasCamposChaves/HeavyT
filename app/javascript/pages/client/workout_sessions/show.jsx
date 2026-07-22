import { Head, Link, useForm } from "@inertiajs/react"

import DashboardShell, { card, primaryButton } from "../../dashboard/DashboardShell"

const inputClass = "h-10 w-full rounded-lg border border-[#3b4049] bg-[#171a20] px-3 text-white outline-none focus:border-[#e5253b]"

function ResultForm({ locked, result, workoutId }) {
  const { data, patch, processing, setData } = useForm({
    exercise_result: {
      completed_sets: result.completed_sets,
      actual_repetitions: result.actual_repetitions,
      actual_weight_lb: result.actual_weight_lb ?? "",
      completed: result.completed,
      notes: result.notes ?? "",
    },
  })

  function update(field, value) {
    setData("exercise_result", { ...data.exercise_result, [field]: value })
  }

  function submit(event) {
    event.preventDefault()
    patch(`/client/workouts/${workoutId}/exercise_results/${result.id}`, { preserveScroll: true })
  }

  return <form className={`${card} grid gap-3 ${result.completed ? "border border-emerald-500/40" : ""}`} noValidate onSubmit={submit}>
    <div className="flex items-start justify-between gap-3">
      <div><span className="text-xs font-bold text-[#e5253b]">EJERCICIO {result.exercise.position}</span><h2 className="m-0 mt-1 text-base font-extrabold">{result.exercise.name}</h2></div>
      {result.completed && <i aria-label="Completado" className="bi bi-check-circle-fill text-xl text-emerald-400" />}
    </div>
    <p className="m-0 text-xs text-[#aeb2ba]">Objetivo: {result.exercise.sets} series × {result.exercise.repetitions} repeticiones{result.exercise.suggested_weight_lb ? ` · ${result.exercise.suggested_weight_lb} lb` : ""}</p>
    <div className="grid grid-cols-2 gap-2">
      <label className="grid gap-1 text-xs font-bold uppercase text-[#aeb2ba]">Series realizadas<input className={inputClass} disabled={locked} min="0" type="number" value={data.exercise_result.completed_sets} onChange={(event) => update("completed_sets", event.target.value)} /></label>
      <label className="grid gap-1 text-xs font-bold uppercase text-[#aeb2ba]">Repeticiones<input className={inputClass} disabled={locked} min="0" type="number" value={data.exercise_result.actual_repetitions} onChange={(event) => update("actual_repetitions", event.target.value)} /></label>
    </div>
    <label className="grid gap-1 text-xs font-bold uppercase text-[#aeb2ba]">Peso utilizado (lb)<input className={inputClass} disabled={locked} min="0" step="0.5" type="number" value={data.exercise_result.actual_weight_lb} onChange={(event) => update("actual_weight_lb", event.target.value)} /></label>
    <label className="grid gap-1 text-xs font-bold uppercase text-[#aeb2ba]">Notas<textarea className={`${inputClass} min-h-20 py-2`} disabled={locked} maxLength="500" value={data.exercise_result.notes} onChange={(event) => update("notes", event.target.value)} /></label>
    {!locked && <label className="flex items-center gap-2 text-sm font-bold"><input checked={data.exercise_result.completed} className="h-5 w-5 accent-[#e5253b]" type="checkbox" onChange={(event) => update("completed", event.target.checked)} /> Marcar como completado</label>}
    {!locked && <button className={`${primaryButton} w-full border-0`} disabled={processing} type="submit">{processing ? "Guardando..." : "Guardar ejercicio"}</button>}
  </form>
}

export default function WorkoutShow({ user, workout }) {
  const locked = workout.status === "completed"
  const completedCount = workout.results.filter((result) => result.completed).length

  return <DashboardShell user={user}>
    <Head title={workout.routine_name} />
    <Link className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-[#e5253b] no-underline hover:text-[#ff6678]" href="/client/workouts"><i aria-hidden="true" className="bi bi-arrow-left" />Historial</Link>
    <h1 className="mb-1 text-xl font-extrabold uppercase">{workout.routine_name}</h1>
    {workout.day_name && <p className="mb-1 text-sm font-extrabold uppercase text-[#e5253b]">{workout.day_name}</p>}
    <p className="mb-4 text-sm text-[#aeb2ba]">{locked ? "Entrenamiento finalizado" : `${completedCount} de ${workout.results.length} ejercicios completados`}</p>
    <div className="grid gap-3">{workout.results.map((result) => <ResultForm key={result.id} locked={locked} result={result} workoutId={workout.id} />)}</div>
    {!locked && <Link as="button" className={`${primaryButton} mt-4 w-full`} href={`/client/workouts/${workout.id}/complete`} method="patch">Finalizar entrenamiento</Link>}
  </DashboardShell>
}
