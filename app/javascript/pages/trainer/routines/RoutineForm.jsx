import { Link, useForm } from "@inertiajs/react"

import { primaryButton } from "../../dashboard/DashboardShell"

const fieldClass = "grid gap-2"
const labelClass = "text-xs font-bold uppercase text-[#aeb2ba]"
const inputClass = "w-full rounded-lg border border-[#3b4049] bg-[#171a20] px-3 py-2.5 text-white outline-none focus:border-[#e5253b] focus:ring-2 focus:ring-[#e5253b]/20"

function errorText(value) {
  return Array.isArray(value) ? value.join(", ") : value
}

export default function RoutineForm({ routine }) {
  const editing = Boolean(routine)
  const { data, errors, patch, post, processing, setData } = useForm({
    routine: {
      name: routine?.name || "",
      description: routine?.description || "",
      goal: routine?.goal || "",
      status: routine?.status || "draft",
    },
  })

  function update(field, value) {
    setData("routine", { ...data.routine, [field]: value })
  }

  function submit(event) {
    event.preventDefault()
    if (editing) patch(`/trainer/routines/${routine.id}`)
    else post("/trainer/routines")
  }

  return (
    <form className="grid gap-4" onSubmit={submit}>
      <label className={fieldClass}>
        <span className={labelClass}>Nombre de la rutina</span>
        <input className={inputClass} required value={data.routine.name} onChange={(event) => update("name", event.target.value)} />
        {errors.name && <span className="text-xs font-bold text-[#ff8391]">{errorText(errors.name)}</span>}
      </label>
      <label className={fieldClass}>
        <span className={labelClass}>Objetivo</span>
        <input className={inputClass} placeholder="Hipertrofia, fuerza, resistencia..." value={data.routine.goal} onChange={(event) => update("goal", event.target.value)} />
      </label>
      <label className={fieldClass}>
        <span className={labelClass}>Descripción</span>
        <textarea className={`${inputClass} min-h-24 resize-y`} value={data.routine.description} onChange={(event) => update("description", event.target.value)} />
      </label>
      {editing && (
        <label className={fieldClass}>
          <span className={labelClass}>Estado</span>
          <select className={inputClass} value={data.routine.status} onChange={(event) => update("status", event.target.value)}>
            <option value="draft">Borrador</option>
            <option value="active">Activa</option>
          </select>
        </label>
      )}
      <button className={`${primaryButton} w-full border-0`} disabled={processing} type="submit">
        {processing ? "Guardando..." : editing ? "Guardar cambios" : "Crear rutina"}
      </button>
      <Link className="text-center text-sm font-bold text-[#c8cbd2]" href={editing ? `/trainer/routines/${routine.id}` : "/trainer/routines"}>Cancelar</Link>
    </form>
  )
}
