import { Link, useForm } from "@inertiajs/react"

import CustomSelect from "../../dashboard/CustomSelect"
import { primaryButton } from "../../dashboard/DashboardShell"

const inputClass = "w-full rounded-lg border border-[#3b4049] bg-[#171a20] px-3 py-2 text-white accent-[#e5253b] outline-none focus:border-[#e5253b] focus:ring-2 focus:ring-[#e5253b]/25"
export const dayOptions = [
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miercoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sabado" },
  { value: 0, label: "Domingo" },
]

export default function ExerciseForm({ defaultDay = 1, exercise, exerciseTemplates = [], routineId }) {
  const editing = Boolean(exercise)
  const firstTemplate = editing ? null : exerciseTemplates[0]
  const { data, errors, patch, post, processing, reset, setData } = useForm({
    exercise: {
      exercise_template_id: firstTemplate?.id ? String(firstTemplate.id) : "",
      name: exercise?.name || firstTemplate?.name || "",
      sets: exercise?.sets || 3,
      repetitions: exercise?.repetitions || 10,
      rest_seconds: exercise?.rest_seconds ?? 60,
      suggested_weight_lb: exercise?.suggested_weight_lb || "",
      notes: exercise?.notes || firstTemplate?.notes || "",
      day_of_week: exercise?.day_of_week ?? defaultDay,
    },
  })

  function update(field, value) {
    setData("exercise", { ...data.exercise, [field]: value })
  }

  function applyTemplate(templateId) {
    const template = exerciseTemplates.find((item) => String(item.id) === String(templateId))
    if (!template) return

    setData("exercise", {
      ...data.exercise,
      exercise_template_id: String(template.id),
      name: template.name || data.exercise.name,
      notes: template.notes || "",
    })
  }

  function submit(event) {
    event.preventDefault()
    if (!editing && exerciseTemplates.length === 0) return

    const options = editing ? {} : { onSuccess: () => reset("sets", "repetitions", "rest_seconds", "suggested_weight_lb", "notes") }
    if (editing) patch(`/trainer/routines/${routineId}/exercises/${exercise.id}`, options)
    else post(`/trainer/routines/${routineId}/exercises`, options)
  }

  if (!editing && exerciseTemplates.length === 0) {
    return (
      <div className="grid gap-3 rounded-lg border border-[#3b4049] bg-[#171a20] p-4">
        <p className="m-0 text-sm font-bold text-[#f6f7fb]">Todavía no tienes ejercicios en el banco.</p>
        <p className="m-0 text-sm text-[#aeb2ba]">Crea ejercicios reutilizables primero y luego agrégalos a tus rutinas.</p>
        <Link className={`${primaryButton} w-full border-0`} href="/trainer/exercise-bank">Crear ejercicios en el banco</Link>
      </div>
    )
  }

  return (
    <form className="grid gap-3" noValidate onSubmit={submit}>
      {!editing && (
        <CustomSelect
          buttonClassName={inputClass}
          label="Ejercicio del banco"
          labelClassName="grid gap-1 text-xs font-bold uppercase text-[#aeb2ba]"
          options={exerciseTemplates.map((template) => ({ label: template.name, value: template.id }))}
          value={data.exercise.exercise_template_id}
          onChange={(value) => applyTemplate(value)}
        />
      )}
      {editing && (
        <CustomSelect
          buttonClassName={inputClass}
          label="Dia de entrenamiento"
          labelClassName="grid gap-1 text-xs font-bold uppercase text-[#aeb2ba]"
          options={dayOptions}
          value={data.exercise.day_of_week}
          onChange={(value) => update("day_of_week", Number(value))}
        />
      )}
      <input className={`${inputClass} ${editing ? "" : "cursor-not-allowed opacity-75"}`} placeholder="Nombre del ejercicio" readOnly={!editing} required value={data.exercise.name} onChange={(event) => update("name", event.target.value)} />
      <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-3">
        <label className="grid gap-1 text-xs font-bold text-[#aeb2ba]">Series<input className={inputClass} min="1" type="number" value={data.exercise.sets} onChange={(event) => update("sets", event.target.value)} /></label>
        <label className="grid gap-1 text-xs font-bold text-[#aeb2ba]">Repeticiones<input className={inputClass} min="1" type="number" value={data.exercise.repetitions} onChange={(event) => update("repetitions", event.target.value)} /></label>
        <label className="grid gap-1 text-xs font-bold text-[#aeb2ba]">Descanso (seg)<input className={inputClass} min="0" type="number" value={data.exercise.rest_seconds} onChange={(event) => update("rest_seconds", event.target.value)} /></label>
      </div>
      <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-3">
        <label className="grid gap-1 text-xs font-bold text-[#aeb2ba]">Peso sugerido (lb)<input className={inputClass} min="0" step="0.5" type="number" value={data.exercise.suggested_weight_lb} onChange={(event) => update("suggested_weight_lb", event.target.value)} /></label>
      </div>
      <textarea className={`${inputClass} min-h-20`} placeholder="Notas o instrucciones" value={data.exercise.notes} onChange={(event) => update("notes", event.target.value)} />
      {Object.keys(errors).length > 0 && <p className="m-0 text-xs font-bold text-[#ff8391]">Revisa los valores del ejercicio.</p>}
      <button className={`${primaryButton} w-full border-0`} disabled={processing} type="submit">{processing ? "Guardando..." : editing ? "Actualizar ejercicio" : "Agregar ejercicio"}</button>
      {editing && <Link className="rounded-md border-0 bg-transparent px-2 py-2 text-center text-xs font-bold text-[#ff8391] transition-colors hover:bg-[#c91f33] hover:text-white" href={`/trainer/routines/${routineId}/exercises/${exercise.id}`} method="delete" as="button">Eliminar ejercicio</Link>}
    </form>
  )
}
