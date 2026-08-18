import { Head, Link, useForm } from "@inertiajs/react"
import { useState } from "react"

import CustomSelect from "../../dashboard/CustomSelect"
import DashboardShell, { card, primaryButton } from "../../dashboard/DashboardShell"

const inputClass = "box-border h-11 w-full rounded-lg border border-[#3b4049] bg-[#171a20] px-3 text-white accent-[#e5253b] outline-none focus:border-[#e5253b] focus:ring-2 focus:ring-[#e5253b]/25"
const labelClass = "grid gap-2 text-xs font-bold uppercase text-[#aeb2ba]"

function errorText(value) {
  return Array.isArray(value) ? value.join(", ") : value
}

function TemplateForm({ errors = {}, muscleGroups = [], template, onCancel }) {
  const editing = Boolean(template)
  const { data, patch, post, processing, reset, setData } = useForm({
    exercise_template: {
      name: template?.name || "",
      muscle_group: template?.muscle_group || "",
      equipment: template?.equipment || "",
      notes: template?.notes || "",
    },
  })

  function update(field, value) {
    setData("exercise_template", { ...data.exercise_template, [field]: value })
  }

  function submit(event) {
    event.preventDefault()
    const options = editing ? { onSuccess: onCancel } : { onSuccess: () => reset() }
    if (editing) patch(`/trainer/exercise_templates/${template.id}`, options)
    else post("/trainer/exercise_templates", options)
  }

  return (
    <form className="grid gap-4" noValidate onSubmit={submit}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className={labelClass}>
          Nombre
          <input className={inputClass} required value={data.exercise_template.name} onChange={(event) => update("name", event.target.value)} />
          {errors.name && <span className="text-xs font-bold text-[#ff8391]">{errorText(errors.name)}</span>}
        </label>
        <div>
          <CustomSelect
            buttonClassName={inputClass}
            label="Grupo muscular"
            labelClassName={labelClass}
            options={muscleGroups.map((group) => ({ label: group, value: group }))}
            placeholder="Selecciona un grupo"
            value={data.exercise_template.muscle_group}
            onChange={(value) => update("muscle_group", value)}
          />
          {errors.muscle_group && <span className="text-xs font-bold text-[#ff8391]">{errorText(errors.muscle_group)}</span>}
        </div>
      </div>

      <label className={labelClass}>
        Equipo
        <input className={inputClass} placeholder="Mancuernas, barra, maquina..." value={data.exercise_template.equipment} onChange={(event) => update("equipment", event.target.value)} />
      </label>

      <label className={labelClass}>
        Notas
        <textarea className={`${inputClass} h-auto min-h-24 resize-y py-3`} value={data.exercise_template.notes} onChange={(event) => update("notes", event.target.value)} />
      </label>

      <div className="grid gap-2 sm:grid-cols-2">
        <button className={`${primaryButton} border-0`} disabled={processing} type="submit">
          {processing ? "Guardando..." : editing ? "Guardar cambios" : "Crear ejercicio"}
        </button>
        {editing && <button className="rounded-lg border border-[#3b4049] px-4 py-2 text-sm font-extrabold text-white transition hover:border-[#e5253b] hover:bg-[#c91f33]" type="button" onClick={onCancel}>Cancelar</button>}
      </div>
    </form>
  )
}

function TemplateCard({ muscleGroups = [], template }) {
  const [editing, setEditing] = useState(false)

  if (editing) {
    return (
      <article className="rounded-lg border border-[#e5253b]/40 bg-[#171a20] p-4">
        <TemplateForm muscleGroups={muscleGroups} template={template} onCancel={() => setEditing(false)} />
      </article>
    )
  }

  return (
    <article className="rounded-lg bg-[#171a20] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="m-0 break-words text-base font-extrabold">{template.name}</h3>
          <p className="mb-0 mt-1 text-sm font-bold text-[#ff6476]">{template.muscle_group}</p>
        </div>
        <div className="flex gap-3">
          <button className="cursor-pointer border-0 bg-transparent p-0 text-sm font-extrabold text-white hover:text-[#ff6476]" type="button" onClick={() => setEditing(true)}>Editar</button>
          <Link className="text-sm font-extrabold text-[#ff6476] no-underline hover:text-white" href={`/trainer/exercise_templates/${template.id}`} method="delete" as="button">Eliminar</Link>
        </div>
      </div>

      {template.equipment && <p className="mb-0 mt-3 text-sm text-[#c8cbd2]">Equipo: {template.equipment}</p>}
      {template.notes && <p className="mb-0 mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-[#aeb2ba]">{template.notes}</p>}
    </article>
  )
}

export default function ExerciseTemplateIndex({ exercise_templates = [], errors = {}, muscle_groups = [], user }) {
  return (
    <DashboardShell user={user}>
      <Head title="Banco de ejercicios" />

      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="m-0 text-xl font-extrabold uppercase">Banco de ejercicios</h1>
          <p className="mb-0 mt-2 text-sm leading-6 text-[#c8cbd2]">Crea ejercicios una vez, modificalos y reutilizalos al armar rutinas.</p>
        </div>
        <Link className="text-sm font-bold text-[#e5253b]" href="/trainer/routines">Volver a rutinas</Link>
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(320px,420px)_1fr]">
        <section className={`${card} xl:sticky xl:top-0 xl:max-h-[calc(100dvh-9rem)] xl:overflow-y-auto`}>
          <h2 className="mb-3 font-extrabold uppercase">Nuevo ejercicio</h2>
          <TemplateForm errors={errors} muscleGroups={muscle_groups} />
        </section>

        <section className={card}>
          <h2 className="mb-1 font-extrabold uppercase">Inventario</h2>
          <p className="mb-3 mt-0 text-sm text-[#aeb2ba]">{exercise_templates.length} ejercicios guardados</p>
          {exercise_templates.length > 0 ? (
            <div className="grid gap-3">
              {exercise_templates.map((template) => <TemplateCard key={template.id} muscleGroups={muscle_groups} template={template} />)}
            </div>
          ) : (
            <p className="m-0 rounded-lg border border-dashed border-[#3b4049] p-5 text-center text-[#c8cbd2]">Todavia no hay ejercicios en el banco.</p>
          )}
        </section>
      </div>
    </DashboardShell>
  )
}
