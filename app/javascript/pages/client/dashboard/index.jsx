import { Head, useForm, usePage } from "@inertiajs/react"

import DashboardShell, { card, primaryButton } from "../../dashboard/DashboardShell"

function errorText(value) {
  return Array.isArray(value) ? value.join(", ") : value
}

export default function ClientDashboard({ trainer, user }) {
  const { flash } = usePage().props
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
      <h1 className="mb-5 text-xl font-extrabold uppercase">Bienvenido, {user.full_name.split(" ")[0]}</h1>

      {flash?.notice && <p className="mb-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm font-bold text-emerald-300">{flash.notice}</p>}

      {trainer ? (
        <section className={card}>
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
      ) : (
        <section className={card}>
          <h2 className="mb-2 font-extrabold uppercase">Vincular entrenador</h2>
          <p className="mb-4 leading-6 text-[#c8cbd2]">Ingresa el código de seis caracteres que te compartió tu entrenador. El código vence después de 24 horas.</p>

          <form className="grid gap-3" onSubmit={submit}>
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
