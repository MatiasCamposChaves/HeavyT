import { Head, Link, useForm } from "@inertiajs/react"

import DashboardShell, { card, primaryButton } from "../../dashboard/DashboardShell"

const inputClass = "h-11 w-full rounded-lg border border-[#3b4049] bg-[#171a20] px-3 text-white outline-none focus:border-[#e5253b]"

export default function AdminUserEdit({ managed_user: managedUser, user }) {
  const { data, errors, patch, processing, setData } = useForm({ user: { full_name: managedUser.full_name, phone: managedUser.phone } })
  const update = (field, value) => setData("user", { ...data.user, [field]: value })
  const submit = (event) => { event.preventDefault(); patch(`/admin/users/${managedUser.id}`) }

  return <DashboardShell user={user}>
    <Head title="Editar usuario" />
    <h1 className="mb-5 text-xl font-extrabold uppercase">Editar usuario</h1>
    <form className={`${card} grid gap-4`} noValidate onSubmit={submit}>
      <label className="grid gap-2 text-xs font-bold uppercase text-[#aeb2ba]">Nombre completo<input className={inputClass} required value={data.user.full_name} onChange={(event) => update("full_name", event.target.value)} />{errors.full_name && <span className="text-[#ff8391]">{errors.full_name}</span>}</label>
      <label className="grid gap-2 text-xs font-bold uppercase text-[#aeb2ba]">Teléfono<input className={inputClass} required value={data.user.phone} onChange={(event) => update("phone", event.target.value)} />{errors.phone && <span className="text-[#ff8391]">{errors.phone}</span>}</label>
      <label className="grid gap-2 text-xs font-bold uppercase text-[#aeb2ba]">Correo<input className={`${inputClass} opacity-70`} disabled value={managedUser.email} /></label>
      <button className={`${primaryButton} w-full border-0`} disabled={processing} type="submit">{processing ? "Guardando..." : "Guardar cambios"}</button>
      <Link className="text-center text-sm font-bold text-[#c8cbd2]" href={`/admin/users/${managedUser.id}`}>Cancelar</Link>
    </form>
  </DashboardShell>
}
