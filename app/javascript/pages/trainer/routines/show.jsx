import { Head, Link, useForm } from "@inertiajs/react"
import { useState } from "react"

import DashboardShell, { card, primaryButton } from "../../dashboard/DashboardShell"
import ExerciseForm, { dayOptions } from "./ExerciseForm"

function ExerciseRow({ exercise, exercises, index, routineId }) {
  return <div className="flex items-start gap-2 rounded-lg bg-[#171a20] p-3">
    <details className="min-w-0 flex-1">
      <summary className="cursor-pointer font-extrabold">{exercise.position}. {exercise.name} - {exercise.sets}x{exercise.repetitions}</summary>
      <div className="mt-4"><ExerciseForm exercise={exercise} routineId={routineId} /></div>
    </details>
    <div className="flex shrink-0 gap-1">
      {index > 0 ? <Link aria-label={`Mover ${exercise.name} hacia arriba`} as="button" className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#3b4049] bg-[#25282e] text-white transition hover:border-[#e5253b] hover:bg-[#c91f33]" href={`/trainer/routines/${routineId}/exercises/${exercise.id}/move?direction=up`} method="patch" preserveScroll><i className="bi bi-arrow-up" /></Link> : <button aria-label="Ya es el primer ejercicio del dia" className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#3b4049] bg-[#25282e] text-[#60656e]" disabled type="button"><i className="bi bi-arrow-up" /></button>}
      {index < exercises.length - 1 ? <Link aria-label={`Mover ${exercise.name} hacia abajo`} as="button" className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#3b4049] bg-[#25282e] text-white transition hover:border-[#e5253b] hover:bg-[#c91f33]" href={`/trainer/routines/${routineId}/exercises/${exercise.id}/move?direction=down`} method="patch" preserveScroll><i className="bi bi-arrow-down" /></Link> : <button aria-label="Ya es el ultimo ejercicio del dia" className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#3b4049] bg-[#25282e] text-[#60656e]" disabled type="button"><i className="bi bi-arrow-down" /></button>}
    </div>
  </div>
}

export default function RoutineShow({ clients, exercise_templates = [], routine, user }) {
  const [selectedDay, setSelectedDay] = useState(1)
  const initiallySelected = clients.filter((client) => client.assigned).map((client) => String(client.client_profile_id))
  const { data, errors, post, processing, setData } = useForm({
    assignment: {
      client_profile_ids: initiallySelected,
      duration_weeks: 4,
    },
  })

  function toggleClient(id) {
    const value = String(id)
    const selected = data.assignment.client_profile_ids
    setData("assignment", { ...data.assignment,
      client_profile_ids: selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value],
    })
  }

  function assign(event) {
    event.preventDefault()
    post(`/trainer/routines/${routine.id}/assignments`, {
      preserveScroll: true,
      preserveState: false,
    })
  }

  return (
    <DashboardShell user={user}>
      <Head title={routine.name} />
      <div className="mb-4 flex flex-col items-start justify-between gap-2 min-[360px]:flex-row min-[360px]:gap-3">
        <div><h1 className="m-0 text-xl font-extrabold uppercase">{routine.name}</h1>{routine.goal && <p className="mb-0 mt-1 text-sm text-[#c8cbd2]">{routine.goal}</p>}</div>
        <Link className="text-sm font-bold text-[#e5253b]" href={`/trainer/routines/${routine.id}/edit`}>Editar</Link>
      </div>
      {routine.description && <p className="mb-4 text-sm leading-6 text-[#c8cbd2]">{routine.description}</p>}
      <div className="grid gap-4">
        <section className={card}>
          <div className="mb-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <h2 className="m-0 font-extrabold uppercase">Agregar ejercicio por dia</h2>
            <Link className="text-sm font-bold text-[#e5253b]" href="/trainer/exercise-bank">Administrar banco</Link>
          </div>
          <div className="mb-4 flex flex-wrap gap-2">
            {dayOptions.map((day) => <button className={`rounded-lg px-3 py-2 text-xs font-extrabold transition ${selectedDay === day.value ? "bg-[#e5253b] text-white" : "bg-[#171a20] text-[#c8cbd2] hover:bg-[#343840] hover:text-white"}`} key={day.value} onClick={() => setSelectedDay(day.value)} type="button">{day.label}</button>)}
          </div>
          <ExerciseForm defaultDay={selectedDay} exerciseTemplates={exercise_templates} key={`new-${selectedDay}`} routineId={routine.id} />
        </section>

        <section className={card}>
          <h2 className="mb-3 font-extrabold uppercase">Ejercicios ({routine.exercises.length})</h2>
          {routine.exercises.length === 0 ? <p className="m-0 text-[#c8cbd2]">Agrega el primer ejercicio para poder asignar la rutina.</p> : <div className="grid gap-5">
            {dayOptions.map((day) => {
              const exercises = routine.exercises.filter((exercise) => exercise.day_of_week === day.value)
              if (exercises.length === 0) return null
              return <section className="grid gap-2" key={day.value}>
                <h3 className="m-0 border-b border-[#3b4049] pb-2 text-base font-extrabold uppercase text-[#ff6476]">{day.label}</h3>
                {exercises.map((exercise, index) => <ExerciseRow exercise={exercise} exercises={exercises} index={index} key={exercise.id} routineId={routine.id} />)}
              </section>
            })}
          </div>}
        </section>

        <section className={card}>
          <h2 className="mb-2 font-extrabold uppercase">Asignar clientes</h2>
          <p className="mb-3 text-[#c8cbd2]">Al asignarla, la rutina cambiara automaticamente a activa.</p>
          <form className="grid gap-3" noValidate onSubmit={assign}>
            <div className="grid gap-3 sm:max-w-sm">
              <label className="grid gap-2 text-xs font-bold uppercase text-[#aeb2ba]">
                Vigencia (semanas)
                <input className="h-11 rounded-lg border border-[#3b4049] bg-[#171a20] px-3 text-sm text-white outline-none focus:border-[#e5253b]" min="1" max="52" type="number" value={data.assignment.duration_weeks} onChange={(event) => setData("assignment", { ...data.assignment, duration_weeks: event.target.value })} />
              </label>
            </div>
            {clients.length === 0 ? <p className="m-0 text-[#c8cbd2]">Primero vincula al menos un cliente.</p> : clients.map((client) => (
              <label className="flex items-center gap-3 rounded-lg bg-[#171a20] p-3" key={client.client_profile_id}>
                <input checked={data.assignment.client_profile_ids.includes(String(client.client_profile_id))} type="checkbox" onChange={() => toggleClient(client.client_profile_id)} />
                <span><strong className="block">{client.full_name}</strong><small className="text-[#aeb2ba]">{client.email}{client.assigned ? ` - Ya asignada${client.expires_on ? ` - vence ${client.expires_on}` : ""}` : ""}</small></span>
              </label>
            ))}
            {errors.clients && <p className="m-0 text-xs font-bold text-[#ff8391]">{Array.isArray(errors.clients) ? errors.clients.join(", ") : errors.clients}</p>}
            {errors.schedule && <p className="m-0 text-xs font-bold text-[#ff8391]">{Array.isArray(errors.schedule) ? errors.schedule.join(", ") : errors.schedule}</p>}
            {clients.length > 0 && <button className={`${primaryButton} w-full border-0`} disabled={processing} type="submit">{processing ? "Asignando..." : "Finalizar y asignar"}</button>}
          </form>
        </section>

        <Link className="rounded-md border-0 bg-transparent px-2 py-2 text-center text-sm font-bold text-[#ff8391] transition-colors hover:bg-[#c91f33] hover:text-white" href={`/trainer/routines/${routine.id}`} method="delete" as="button">Eliminar rutina</Link>
      </div>
    </DashboardShell>
  )
}
