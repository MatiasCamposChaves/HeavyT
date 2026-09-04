import { Head, Link, useForm } from "@inertiajs/react"
import { useState } from "react"

import DashboardShell, { card, primaryButton } from "../../dashboard/DashboardShell"

const inputClass = "h-10 w-full rounded-lg border border-[#3b4049] bg-[#171a20] px-3 text-white outline-none focus:border-[#e5253b] focus:outline-none focus:ring-2 focus:ring-[#e5253b]/30 focus:ring-offset-0"

function nonNegativeInteger(value) {
  return value.replace(/\D/g, "")
}

function nonNegativeDecimal(value) {
  const clean = value.replace(/[^\d.]/g, "")
  const [integer, ...decimals] = clean.split(".")
  return decimals.length > 0 ? `${integer}.${decimals.join("")}` : integer
}

function normalizeDropSetResults(result) {
  const count = Number(result.exercise.drop_sets_count || 0)
  const saved = Array.isArray(result.drop_set_results) ? result.drop_set_results : []

  return Array.from({ length: count }, (_, index) => ({
    repetitions: saved[index]?.repetitions ?? "",
    weight_lb: saved[index]?.weight_lb ?? "",
  }))
}

function TechniqueBadge({ exercise }) {
  if (!exercise.set_type || exercise.set_type === "standard") return null

  return <div className="rounded-md border border-[#3b4049] bg-[#171a20] px-3 py-2 text-xs text-[#c8cbd2]">
    <strong className="mr-2 uppercase text-[#ff6476]">{exercise.set_type_name}</strong>
    {(exercise.set_type === "bi_set" || exercise.set_type === "super_set") && <span>con {exercise.paired_exercise_name}</span>}
    {exercise.set_type === "drop_set" && <span>{exercise.drop_sets_count} bajada{Number(exercise.drop_sets_count) === 1 ? "" : "s"} de peso</span>}
    {exercise.technique_notes && <p className="mb-0 mt-1 leading-5">{exercise.technique_notes}</p>}
  </div>
}

function ResultForm({ locked, result, workoutId }) {
  const [expanded, setExpanded] = useState(false)
  const { data, patch, processing, setData } = useForm({
    exercise_result: {
      completed_sets: result.completed_sets,
      actual_repetitions: result.actual_repetitions,
      actual_weight_lb: result.actual_weight_lb ?? "",
      paired_actual_repetitions: result.paired_actual_repetitions ?? 0,
      paired_actual_weight_lb: result.paired_actual_weight_lb ?? "",
      drop_set_results: normalizeDropSetResults(result),
      completed: result.completed,
      notes: result.notes ?? "",
    },
  })
  const isPairedSet = result.exercise.set_type === "bi_set" || result.exercise.set_type === "super_set"
  const isDropSet = result.exercise.set_type === "drop_set"

  function update(field, value) {
    setData("exercise_result", { ...data.exercise_result, [field]: value })
  }

  function updateDropSet(index, field, value) {
    const dropSetResults = data.exercise_result.drop_set_results.map((dropSet, currentIndex) => (
      currentIndex === index ? { ...dropSet, [field]: value } : dropSet
    ))

    update("drop_set_results", dropSetResults)
  }

  function submit(event) {
    event.preventDefault()
    patch(`/client/workouts/${workoutId}/exercise_results/${result.id}`, { preserveScroll: true })
  }

  if (result.completed && !expanded) {
    return <article className={`${card} border border-emerald-500/40`}>
      <div className="flex items-start justify-between gap-3">
        <div><span className="inline-flex items-center gap-2 text-xs font-bold text-[#e5253b]">EJERCICIO {result.exercise.position}<button aria-label={`Abrir ${result.exercise.name}`} className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#e5253b] bg-transparent text-white transition hover:bg-[#c91f33]" onClick={() => setExpanded(true)} type="button"><i className="bi bi-chevron-down" /></button></span><h2 className="m-0 mt-2 text-base font-extrabold">{result.exercise.name}</h2></div>
        <i aria-label="Completado" className="bi bi-check-circle-fill text-xl text-emerald-400" />
      </div>
    </article>
  }

  return <form className={`${card} grid gap-3 ${result.completed ? "border border-emerald-500/40" : ""}`} noValidate onSubmit={submit}>
    <div className="flex items-start justify-between gap-3">
      <div><span className="inline-flex items-center gap-2 text-xs font-bold text-[#e5253b]">EJERCICIO {result.exercise.position}{result.completed && <button aria-label={`Cerrar ${result.exercise.name}`} className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#e5253b] bg-transparent text-white transition hover:bg-[#c91f33]" onClick={() => setExpanded(false)} type="button"><i className="bi bi-chevron-up" /></button>}</span><h2 className="m-0 mt-1 text-base font-extrabold">{result.exercise.name}</h2></div>
      {result.completed && <i aria-label="Completado" className="bi bi-check-circle-fill text-xl text-emerald-400" />}
    </div>
    <p className="m-0 text-xs text-[#aeb2ba]">Objetivo: {result.exercise.sets} series × {result.exercise.repetitions} repeticiones{result.exercise.suggested_weight_lb ? ` · ${result.exercise.suggested_weight_lb} lb` : ""}</p>
    <TechniqueBadge exercise={result.exercise} />
    <label className="grid gap-1 text-xs font-bold uppercase text-[#aeb2ba]">Series realizadas<input className={inputClass} disabled={locked} inputMode="numeric" min="0" step="1" type="number" value={data.exercise_result.completed_sets} onChange={(event) => update("completed_sets", nonNegativeInteger(event.target.value))} /></label>
    <div className="grid gap-3 rounded-lg border border-[#3b4049] bg-[#171a20]/60 p-3">
      <h3 className="m-0 text-sm font-extrabold uppercase text-white">{result.exercise.name}</h3>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <label className="grid gap-1 text-xs font-bold uppercase text-[#aeb2ba]">Repeticiones<input className={inputClass} disabled={locked} inputMode="numeric" min="0" step="1" type="number" value={data.exercise_result.actual_repetitions} onChange={(event) => update("actual_repetitions", nonNegativeInteger(event.target.value))} /></label>
        <label className="grid gap-1 text-xs font-bold uppercase text-[#aeb2ba]">Peso utilizado (lb)<input className={inputClass} disabled={locked} inputMode="decimal" min="0" step="0.5" type="number" value={data.exercise_result.actual_weight_lb} onChange={(event) => update("actual_weight_lb", nonNegativeDecimal(event.target.value))} /></label>
      </div>
    </div>
    {isPairedSet && (
      <div className="grid gap-3 rounded-lg border border-[#3b4049] bg-[#171a20]/60 p-3">
        <h3 className="m-0 text-sm font-extrabold uppercase text-white">{result.exercise.paired_exercise_name}</h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <label className="grid gap-1 text-xs font-bold uppercase text-[#aeb2ba]">Repeticiones<input className={inputClass} disabled={locked} inputMode="numeric" min="0" step="1" type="number" value={data.exercise_result.paired_actual_repetitions} onChange={(event) => update("paired_actual_repetitions", nonNegativeInteger(event.target.value))} /></label>
          <label className="grid gap-1 text-xs font-bold uppercase text-[#aeb2ba]">Peso utilizado (lb)<input className={inputClass} disabled={locked} inputMode="decimal" min="0" step="0.5" type="number" value={data.exercise_result.paired_actual_weight_lb} onChange={(event) => update("paired_actual_weight_lb", nonNegativeDecimal(event.target.value))} /></label>
        </div>
      </div>
    )}
    {isDropSet && (
      <div className="grid gap-3 rounded-lg border border-[#3b4049] bg-[#171a20]/60 p-3">
        <h3 className="m-0 text-sm font-extrabold uppercase text-white">Bajadas del drop set</h3>
        {data.exercise_result.drop_set_results.map((dropSet, index) => (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-[auto_1fr_1fr]" key={index}>
            <span className="self-end rounded-md bg-[#25282e] px-3 py-2 text-xs font-extrabold uppercase text-[#ff6476]">Bajada {index + 1}</span>
            <label className="grid gap-1 text-xs font-bold uppercase text-[#aeb2ba]">Repeticiones<input className={inputClass} disabled={locked} inputMode="numeric" min="0" step="1" type="number" value={dropSet.repetitions} onChange={(event) => updateDropSet(index, "repetitions", nonNegativeInteger(event.target.value))} /></label>
            <label className="grid gap-1 text-xs font-bold uppercase text-[#aeb2ba]">Peso utilizado (lb)<input className={inputClass} disabled={locked} inputMode="decimal" min="0" step="0.5" type="number" value={dropSet.weight_lb} onChange={(event) => updateDropSet(index, "weight_lb", nonNegativeDecimal(event.target.value))} /></label>
          </div>
        ))}
      </div>
    )}
    <label className="grid gap-1 text-xs font-bold uppercase text-[#aeb2ba]">Notas<textarea className={`${inputClass} min-h-20 py-2`} disabled={locked} maxLength="500" value={data.exercise_result.notes} onChange={(event) => update("notes", event.target.value)} /></label>
    {!locked && (
      <label className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm font-extrabold transition ${data.exercise_result.completed ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300" : "border-[#3b4049] bg-[#171a20] text-white hover:border-[#e5253b] hover:bg-[#25282e]"}`}>
        <span className="inline-flex items-center gap-3">
          <span className={`inline-flex h-6 w-6 items-center justify-center rounded-md border transition ${data.exercise_result.completed ? "border-emerald-400 bg-emerald-400 text-[#171a20]" : "border-[#5a606b] bg-[#25282e] text-transparent"}`}>
            <i className="bi bi-check-lg text-sm" />
          </span>
          Marcar como completado
        </span>
        <input checked={data.exercise_result.completed} className="sr-only" type="checkbox" onChange={(event) => update("completed", event.target.checked)} />
      </label>
    )}
    {!locked && data.exercise_result.completed && <button className={`${primaryButton} w-full border-0`} disabled={processing} type="submit">{processing ? (result.completed ? "Actualizando..." : "Guardando...") : (result.completed ? "Actualizar ejercicio" : "Guardar ejercicio")}</button>}
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
