import { Link, useForm } from "@inertiajs/react"

import { primaryButton } from "../../dashboard/DashboardShell"

const inputClass = "w-full rounded-lg border border-[#3b4049] bg-[#171a20] px-3 py-2 text-white outline-none focus:border-[#e5253b]"

export default function ExerciseForm({ exercise, routineId }) {
  const editing = Boolean(exercise)
  const { data, errors, patch, post, processing, reset, setData } = useForm({
    exercise: {
      name: exercise?.name || "",
      sets: exercise?.sets || 3,
      repetitions: exercise?.repetitions || 10,
      rest_seconds: exercise?.rest_seconds ?? 60,
      suggested_weight_lb: exercise?.suggested_weight_lb || "",
      notes: exercise?.notes || "",
      position: exercise?.position || "",
    },
  })

  function update(field, value) {
    setData("exercise", { ...data.exercise, [field]: value })
  }

  function submit(event) {
    event.preventDefault()
    const options = editing ? {} : { onSuccess: () => reset() }
    if (editing) patch(`/trainer/routines/${routineId}/exercises/${exercise.id}`, options)
    else post(`/trainer/routines/${routineId}/exercises`, options)
  }

  return (
    <form className="grid gap-3" onSubmit={submit}>
      <input className={inputClass} placeholder="Nombre del ejercicio" required value={data.exercise.name} onChange={(event) => update("name", event.target.value)} />
      <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-3">
        <label className="grid gap-1 text-xs font-bold text-[#aeb2ba]">Series<input className={inputClass} min="1" type="number" value={data.exercise.sets} onChange={(event) => update("sets", event.target.value)} /></label>
        <label className="grid gap-1 text-xs font-bold text-[#aeb2ba]">Repeticiones<input className={inputClass} min="1" type="number" value={data.exercise.repetitions} onChange={(event) => update("repetitions", event.target.value)} /></label>
        <label className="grid gap-1 text-xs font-bold text-[#aeb2ba]">Descanso (seg)<input className={inputClass} min="0" type="number" value={data.exercise.rest_seconds} onChange={(event) => update("rest_seconds", event.target.value)} /></label>
      </div>
      <div className="grid grid-cols-1 gap-2 min-[360px]:grid-cols-2">
        <label className="grid gap-1 text-xs font-bold text-[#aeb2ba]">Peso sugerido (lb)<input className={inputClass} min="0" step="0.5" type="number" value={data.exercise.suggested_weight_lb} onChange={(event) => update("suggested_weight_lb", event.target.value)} /></label>
        <label className="grid gap-1 text-xs font-bold text-[#aeb2ba]">Orden<input className={inputClass} min="1" type="number" value={data.exercise.position} onChange={(event) => update("position", event.target.value)} /></label>
      </div>
      <textarea className={`${inputClass} min-h-20`} placeholder="Notas o instrucciones" value={data.exercise.notes} onChange={(event) => update("notes", event.target.value)} />
      {Object.keys(errors).length > 0 && <p className="m-0 text-xs font-bold text-[#ff8391]">Revisa los valores del ejercicio.</p>}
      <button className={`${primaryButton} w-full border-0`} disabled={processing} type="submit">{processing ? "Guardando..." : editing ? "Actualizar ejercicio" : "Agregar ejercicio"}</button>
      {editing && <Link className="rounded-md border-0 bg-transparent px-2 py-2 text-center text-xs font-bold text-[#ff8391] transition-colors hover:bg-[#c91f33] hover:text-white" href={`/trainer/routines/${routineId}/exercises/${exercise.id}`} method="delete" as="button">Eliminar ejercicio</Link>}
    </form>
  )
}
