import { Head, Link, useForm } from "@inertiajs/react"

import DashboardShell, { card, primaryButton } from "../../dashboard/DashboardShell"

const inputClass = "h-10 w-full rounded-lg border border-[#3b4049] bg-[#171a20] px-3 text-sm text-white outline-none focus:border-[#e5253b]"

export default function AdminUsers({ filters, user, users }) {
  const { data, get, processing, setData } = useForm(filters)

  function submit(event) {
    event.preventDefault()
    get("/admin/users", { preserveState: true, replace: true })
  }

  return <DashboardShell user={user}>
    <Head title="Gestionar usuarios" />
    <h1 className="mb-4 text-xl font-extrabold uppercase">Gestionar usuarios</h1>

    <form className={`${card} mb-4 grid gap-3`} onSubmit={submit}>
      <label className="grid gap-1 text-xs font-bold uppercase text-[#aeb2ba]">Buscar<input className={inputClass} placeholder="Nombre o correo" value={data.q} onChange={(event) => setData("q", event.target.value)} /></label>
      <div className="grid grid-cols-1 gap-2 min-[380px]:grid-cols-2">
        <label className="grid gap-1 text-xs font-bold uppercase text-[#aeb2ba]">Rol<select className={inputClass} value={data.role} onChange={(event) => setData("role", event.target.value)}><option value="">Todos</option><option value="client">Clientes</option><option value="trainer">Entrenadores</option></select></label>
        <label className="grid gap-1 text-xs font-bold uppercase text-[#aeb2ba]">Estado<select className={inputClass} value={data.status} onChange={(event) => setData("status", event.target.value)}><option value="">Todos</option><option value="active">Activos</option><option value="blocked">Bloqueados</option></select></label>
      </div>
      <button className={`${primaryButton} w-full border-0`} disabled={processing} type="submit"><i className="bi bi-search mr-2" />Buscar</button>
    </form>

    <p className="mb-3 text-xs font-bold uppercase text-[#aeb2ba]">{users.length} resultado(s)</p>
    <div className="grid gap-3">
      {users.length === 0 ? <p className={card}>No se encontraron usuarios.</p> : users.map((managedUser) => (
        <Link className={`${card} block no-underline`} href={`/admin/users/${managedUser.id}`} key={managedUser.id}>
          <div className="flex items-start justify-between gap-3"><strong className="text-white">{managedUser.full_name}</strong><span className={`rounded-full px-2 py-1 text-[10px] font-extrabold uppercase ${managedUser.blocked ? "bg-[#e5253b]/20 text-[#ff8391]" : "bg-emerald-500/15 text-emerald-300"}`}>{managedUser.blocked ? "Bloqueado" : "Activo"}</span></div>
          <p className="mb-2 mt-1 break-words text-xs text-[#aeb2ba]">{managedUser.email}</p>
          <span className="text-xs font-bold uppercase text-[#e5253b]">{managedUser.role === "trainer" ? "Entrenador" : "Cliente"}</span>
        </Link>
      ))}
    </div>
  </DashboardShell>
}
