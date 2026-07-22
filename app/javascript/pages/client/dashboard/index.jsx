import { Head, Link, useForm } from "@inertiajs/react"

import DashboardShell, { card, primaryButton } from "../../dashboard/DashboardShell"

function errorText(value) {
  return Array.isArray(value) ? value.join(", ") : value
}

function TodayWorkout({ workout }) {
  const completed = workout.workout_status === "completed"
  const inProgress = workout.workout_status === "in_progress"
  const href = inProgress || completed ? `/client/workouts/${workout.workout_id}` : `/client/routines/${workout.routine_id}/workout_sessions?day_of_week=${workout.day_of_week}`

  return <article className={`${card} ${completed ? "border border-emerald-500/40" : ""}`}>
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p className="mb-1 text-xs font-extrabold uppercase text-[#e5253b]">{workout.day_name}</p>
        <h3 className="m-0 text-lg font-extrabold">{workout.routine_name}</h3>
        <p className="mb-0 mt-2 text-xs text-[#aeb2ba]">{workout.exercises_count} ejercicios</p>
      </div>
      {completed && <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300"><i className="bi bi-check-circle-fill" />Completado</span>}
    </div>
    <Link as="button" className={`${primaryButton} mt-4 w-full sm:w-auto`} href={href} method={inProgress || completed ? "get" : "post"}>
      <i className={`bi ${completed ? "bi-eye" : inProgress ? "bi-play-circle" : "bi-play-fill"} mr-2`} />
      {completed ? "Ver entrenamiento" : inProgress ? "Continuar entrenamiento" : "Comenzar entrenamiento"}
    </Link>
  </article>
}

export default function ClientDashboard({ today_workouts = [], trainer, user }) {
  const { data, errors, post, processing, setData } = useForm({
    trainer_link: { code: "" },
  })

  function submit(event) {
    event.preventDefault()
    post("/client/trainer-link", { preserveScroll: true })
  }

  return (
    <DashboardShell user={user}>
      <Head title="Inicio del cliente" />
      <h1 className="mb-5 text-xl font-extrabold uppercase lg:text-right">Bienvenido, {user.full_name.split(" ")[0]}</h1>

      {trainer ? (
        <div className="grid gap-4">
        <section>
          <div className="mb-3 flex items-center justify-between gap-3"><h2 className="m-0 text-lg font-extrabold uppercase">Entrenamiento de hoy</h2><Link className="text-sm font-bold text-[#ff6476]" href="/client/notifications"><i className="bi bi-bell mr-2" />Notificaciones</Link></div>
          <div className="grid gap-3 lg:max-w-2xl">
            {today_workouts.length === 0 ? <div className={card}><i className="bi bi-cup-hot mb-3 block text-2xl text-[#ff6476]" /><h3 className="m-0 text-base font-extrabold">Día de descanso</h3><p className="mb-0 mt-2 text-[#c8cbd2]">No tienes ejercicios programados para hoy.</p></div> : today_workouts.map((workout) => <TodayWorkout key={workout.routine_id} workout={workout} />)}
          </div>
        </section>
        <section className={`${card} lg:max-w-2xl`}>
          <p className="mb-1 text-xs font-bold uppercase text-[#e5253b]">Tu entrenador</p>
          <h2 className="mb-4 text-lg font-extrabold">{trainer.full_name}</h2>
          <dl className="m-0 grid gap-3 text-sm">
            <div>
              <dt className="font-bold text-[#aeb2ba]">Correo electrónico</dt>
              <dd className="m-0 break-words">{trainer.email}</dd>
            </div>
            <div>
              <dt className="font-bold text-[#aeb2ba]">Teléfono</dt>
              <dd className="m-0">{trainer.phone}</dd>
            </div>
          </dl>
        </section>
        <Link className={`${primaryButton} w-full`} href="/client/routines">Ver mis rutinas</Link>
        </div>
      ) : (
        <section className={card}>
          <h2 className="mb-2 font-extrabold uppercase">Vincular entrenador</h2>
          <p className="mb-4 leading-6 text-[#c8cbd2]">Ingresa el código de seis caracteres que te compartió tu entrenador. El código vence después de 24 horas.</p>

          <form className="grid gap-3" noValidate onSubmit={submit}>
            <label className="grid gap-2">
              <span className="text-xs font-bold uppercase text-[#aeb2ba]">Código del entrenador</span>
              <input
                className="h-12 rounded-lg border border-[#3b4049] bg-[#171a20] px-3 text-center font-mono text-xl font-black uppercase tracking-[0.22em] text-white outline-none focus:border-[#e5253b] focus:ring-2 focus:ring-[#e5253b]/20"
                maxLength={6}
                required
                value={data.trainer_link.code}
                onChange={(event) => setData("trainer_link", { code: event.target.value.toUpperCase().replace(/\s/g, "") })}
              />
            </label>
            {errors.code && <p className="m-0 text-xs font-bold text-[#ff8391]">{errorText(errors.code)}</p>}
            <button className={`${primaryButton} w-full border-0`} type="submit" disabled={processing || data.trainer_link.code.length !== 6}>
              {processing ? "Vinculando..." : "Confirmar código"}
            </button>
          </form>
        </section>
      )}
    </DashboardShell>
  )
}
