import { Head, Link, useForm } from "@inertiajs/react"

import DashboardShell, { card, primaryButton } from "../../dashboard/DashboardShell"
import ExerciseForm from "./ExerciseForm"

export default function RoutineShow({ clients, routine, user }) {
  const initiallySelected = clients.filter((client) => client.assigned).map((client) => String(client.client_profile_id))
  const { data, errors, post, processing, setData } = useForm({ assignment: { client_profile_ids: initiallySelected } })

  function toggleClient(id) {
    const value = String(id)
    const selected = data.assignment.client_profile_ids
    setData("assignment", {
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
          <h2 className="mb-3 font-extrabold uppercase">Agregar ejercicio</h2>
          <ExerciseForm routineId={routine.id} />
        </section>

        <section className={card}>
          <h2 className="mb-3 font-extrabold uppercase">Ejercicios ({routine.exercises.length})</h2>
          <div className="grid gap-3">
            {routine.exercises.length === 0 ? <p className="m-0 text-[#c8cbd2]">Agrega el primer ejercicio para poder asignar la rutina.</p> : routine.exercises.map((exercise) => (
              <details className="rounded-lg bg-[#171a20] p-3" key={exercise.id}>
                <summary className="cursor-pointer font-extrabold">{exercise.position}. {exercise.name} — {exercise.sets}×{exercise.repetitions}</summary>
                <div className="mt-4"><ExerciseForm exercise={exercise} routineId={routine.id} /></div>
              </details>
            ))}
          </div>
        </section>

        <section className={card}>
          <h2 className="mb-2 font-extrabold uppercase">Asignar clientes</h2>
          <p className="mb-3 text-[#c8cbd2]">Al asignarla, la rutina cambiará automáticamente a activa.</p>
          <form className="grid gap-3" onSubmit={assign}>
            {clients.length === 0 ? <p className="m-0 text-[#c8cbd2]">Primero vincula al menos un cliente.</p> : clients.map((client) => (
              <label className="flex items-center gap-3 rounded-lg bg-[#171a20] p-3" key={client.client_profile_id}>
                <input checked={data.assignment.client_profile_ids.includes(String(client.client_profile_id))} type="checkbox" onChange={() => toggleClient(client.client_profile_id)} />
                <span><strong className="block">{client.full_name}</strong><small className="text-[#aeb2ba]">{client.email}{client.assigned ? " · Ya asignada" : ""}</small></span>
              </label>
            ))}
            {errors.clients && <p className="m-0 text-xs font-bold text-[#ff8391]">{Array.isArray(errors.clients) ? errors.clients.join(", ") : errors.clients}</p>}
            {clients.length > 0 && <button className={`${primaryButton} w-full border-0`} disabled={processing} type="submit">{processing ? "Asignando..." : "Finalizar y asignar"}</button>}
          </form>
        </section>

        <Link className="rounded-md border-0 bg-transparent px-2 py-2 text-center text-sm font-bold text-[#ff8391] transition-colors hover:bg-[#c91f33] hover:text-white" href={`/trainer/routines/${routine.id}`} method="delete" as="button">Eliminar rutina</Link>
      </div>
    </DashboardShell>
  )
}
