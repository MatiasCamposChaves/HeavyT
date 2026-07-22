import { Head, Link, useForm } from "@inertiajs/react"
import { useState } from "react"

import DashboardShell, { card, primaryButton } from "../../dashboard/DashboardShell"

function expirationText(value) {
  if (!value) return ""

  return new Intl.DateTimeFormat("es-GT", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value))
}

export default function TrainerDashboard({ clients, invite, user }) {
  const { post, processing } = useForm()
  const [copied, setCopied] = useState(false)

  function generateCode() {
    post("/trainer/invite", { preserveScroll: true })
  }

  async function copyCode() {
    if (!invite) return

    await navigator.clipboard.writeText(invite.code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <DashboardShell user={user}>
      <Head title="Panel del entrenador" />
      <h1 className="mb-2 text-xl font-extrabold uppercase">Panel del entrenador</h1>
      <p className="mb-5 text-sm leading-6 text-[#c8cbd2]">Comparte tu código para vincular clientes a tu cuenta.</p>

      <div className="grid gap-4">
        <Link className={`${primaryButton} w-full lg:w-[240px]`} href="/trainer/routines">Administrar rutinas</Link>
        <Link className="inline-flex min-h-10 w-full items-center justify-center rounded-lg border border-[#e5253b] px-4 text-sm font-extrabold text-white no-underline transition hover:bg-[#c91f33] lg:w-[240px]" href="/trainer/workouts"><i className="bi bi-activity mr-2" />Actividad de clientes</Link>
        <Link className="inline-flex min-h-10 w-full items-center justify-center rounded-lg border border-[#e5253b] px-4 text-sm font-extrabold text-white no-underline transition hover:bg-[#c91f33] lg:w-[240px]" href="/trainer/progress"><i className="bi bi-graph-up-arrow mr-2" />Progreso de clientes</Link>
        <section className={card}>
          <p className="mb-1 text-xs font-bold uppercase text-[#aeb2ba]">Clientes vinculados</p>
          <strong className="text-3xl">{clients.length}</strong>
        </section>

        <section className={card}>
          <h2 className="mb-3 font-extrabold uppercase">Código de entrenador</h2>
          {invite ? (
            <>
              <button
                className="mb-2 w-full rounded-lg border border-dashed border-[#e5253b] bg-[#171a20] px-4 py-3 text-center font-mono text-2xl font-black tracking-[0.28em] text-white transition-colors hover:border-[#c91f33] hover:bg-[#c91f33]"
                type="button"
                onClick={copyCode}
              >
                {invite.code}
              </button>
              <p className="mb-4 text-xs text-[#b9bdc5]">Válido hasta {expirationText(invite.expires_at)}. {copied && <strong className="text-emerald-300">Copiado.</strong>}</p>
            </>
          ) : (
            <p className="mb-4 leading-6 text-[#c8cbd2]">Todavía no tienes un código activo.</p>
          )}
          <button className={`${primaryButton} w-full border-0 lg:w-[240px]`} type="button" disabled={processing} onClick={generateCode}>
            {processing ? "Generando..." : invite ? "Regenerar código" : "Generar código"}
          </button>
          {invite && <p className="mb-0 mt-3 text-xs text-[#9da2ab]">Regenerarlo desactivará inmediatamente el código anterior.</p>}
        </section>

        <section className={card}>
          <h2 className="mb-3 font-extrabold uppercase">Mis clientes</h2>
          {clients.length === 0 ? (
            <p className="m-0 leading-6 text-[#c8cbd2]">Los clientes aparecerán aquí después de ingresar tu código.</p>
          ) : (
            <ul className="m-0 grid list-none gap-2 p-0">
              {clients.map((client) => (
                <li className="rounded-lg bg-[#171a20] px-3 py-2" key={client.id}>
                  <strong className="block">{client.full_name}</strong>
                  <span className="text-xs text-[#aeb2ba]">{client.email}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </DashboardShell>
  )
}
