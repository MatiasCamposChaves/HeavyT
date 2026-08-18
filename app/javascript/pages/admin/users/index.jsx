import { Head, Link, useForm } from "@inertiajs/react"

import CustomSelect from "../../dashboard/CustomSelect"
import DashboardShell, { card, primaryButton } from "../../dashboard/DashboardShell"

const inputClass = "h-10 w-full rounded-lg border border-[#3b4049] bg-[#171a20] px-3 text-sm text-white accent-[#e5253b] outline-none focus:border-[#e5253b] focus:ring-2 focus:ring-[#e5253b]/25"
const filterLabelClass = "grid gap-1 text-xs font-bold uppercase text-[#aeb2ba]"

export default function AdminUsers({ filters, user, users }) {
  const { data, get, processing, setData } = useForm(filters)

  function submit(event) {
    event.preventDefault()
    get("/admin/users", { preserveState: true, replace: true })
  }

  return (
    <DashboardShell user={user}>
      <Head title="Gestionar usuarios" />
      <h1 className="mb-4 text-xl font-extrabold uppercase">Gestionar usuarios</h1>

      <form className={`${card} mb-4 grid gap-3 lg:grid-cols-[minmax(220px,2fr)_1fr_1fr_auto] lg:items-end`} noValidate onSubmit={submit}>
        <label className={filterLabelClass}>
          Buscar
          <input className={inputClass} placeholder="Nombre o correo" value={data.q} onChange={(event) => setData("q", event.target.value)} />
        </label>
        <div className="contents">
          <CustomSelect
            buttonClassName={inputClass}
            label="Rol"
            labelClassName={filterLabelClass}
            options={[{ label: "Todos", value: "" }, { label: "Clientes", value: "client" }, { label: "Entrenadores", value: "trainer" }]}
            value={data.role}
            onChange={(value) => setData("role", value)}
          />
          <CustomSelect
            buttonClassName={inputClass}
            label="Estado"
            labelClassName={filterLabelClass}
            options={[{ label: "Todos", value: "" }, { label: "Activos", value: "active" }, { label: "Bloqueados", value: "blocked" }]}
            value={data.status}
            onChange={(value) => setData("status", value)}
          />
        </div>
        <button className={`${primaryButton} w-full border-0 lg:w-auto`} disabled={processing} type="submit">
          <i className="bi bi-search mr-2" />Buscar
        </button>
      </form>

      <p className="mb-3 text-xs font-bold uppercase text-[#aeb2ba]">{users.length} resultado(s)</p>
      <div className="grid gap-3 lg:grid-cols-2 lg:gap-4">
        {users.length === 0 ? <p className={card}>No se encontraron usuarios.</p> : users.map((managedUser) => (
          <Link className={`${card} block no-underline`} href={`/admin/users/${managedUser.id}`} key={managedUser.id}>
            <div className="flex items-start justify-between gap-3">
              <strong className="text-white">{managedUser.full_name}</strong>
              <span className={`rounded-full px-2 py-1 text-[10px] font-extrabold uppercase ${managedUser.blocked ? "bg-[#e5253b]/20 text-[#ff8391]" : "bg-emerald-500/15 text-emerald-300"}`}>
                {managedUser.blocked ? "Bloqueado" : "Activo"}
              </span>
            </div>
            <p className="mb-2 mt-1 break-words text-xs text-[#aeb2ba]">{managedUser.email}</p>
            <span className="text-xs font-bold uppercase text-[#e5253b]">{managedUser.role === "trainer" ? "Entrenador" : "Cliente"}</span>
          </Link>
        ))}
      </div>
    </DashboardShell>
  )
}
