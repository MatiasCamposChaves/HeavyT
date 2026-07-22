import { Head, useForm, usePage } from "@inertiajs/react"
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
  const { flash } = usePage().props
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

      {flash?.notice && <p className="mb-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm font-bold text-emerald-300">{flash.notice}</p>}

      <div className="grid gap-4">
        <section className={card}>
          <p className="mb-1 text-xs font-bold uppercase text-[#aeb2ba]">Clientes vinculados</p>
          <strong className="text-3xl">{clients.length}</strong>
        </section>

        <section className={card}>
          <h2 className="mb-3 font-extrabold uppercase">Código de entrenador</h2>
          {invite ? (
            <>
              <button
                className="mb-2 w-full rounded-lg border border-dashed border-[#e5253b] bg-[#171a20] px-4 py-3 text-center font-mono text-2xl font-black tracking-[0.28em] text-white"
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
          <button className={`${primaryButton} w-full border-0`} type="button" disabled={processing} onClick={generateCode}>
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
