import { Head, Link } from "@inertiajs/react"

import DashboardShell, { card, primaryButton } from "../../dashboard/DashboardShell"

export default function AdminUserShow({ managed_user: managedUser, user }) {
  const blocked = managedUser.blocked

  return <DashboardShell user={user}>
    <Head title={managedUser.full_name} />
    <Link className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-[#e5253b] no-underline hover:text-[#ff6678]" href="/admin/users"><i aria-hidden="true" className="bi bi-arrow-left" />Usuarios</Link>
    <div className="mb-5 flex items-start justify-between gap-3"><h1 className="m-0 break-words text-xl font-extrabold uppercase">{managedUser.full_name}</h1><span className={`rounded-full px-2 py-1 text-[10px] font-extrabold uppercase ${blocked ? "bg-[#e5253b]/20 text-[#ff8391]" : "bg-emerald-500/15 text-emerald-300"}`}>{blocked ? "Bloqueado" : "Activo"}</span></div>
    <section className={`${card} mb-4`}>
      <dl className="m-0 grid gap-3 text-sm">
        <div><dt className="font-bold text-[#aeb2ba]">Correo</dt><dd className="m-0 break-words">{managedUser.email}</dd></div>
        <div><dt className="font-bold text-[#aeb2ba]">Teléfono</dt><dd className="m-0">{managedUser.phone}</dd></div>
        <div><dt className="font-bold text-[#aeb2ba]">Rol</dt><dd className="m-0">{managedUser.role === "trainer" ? "Entrenador" : "Cliente"}</dd></div>
        <div><dt className="font-bold text-[#aeb2ba]">{managedUser.role === "trainer" ? "Clientes vinculados" : "Rutinas asignadas"}</dt><dd className="m-0">{managedUser.related_count}</dd></div>
        {managedUser.trainer && <div><dt className="font-bold text-[#aeb2ba]">Entrenador</dt><dd className="m-0">{managedUser.trainer.full_name}</dd></div>}
      </dl>
    </section>

    <div className="grid gap-3">
      <Link className={`${primaryButton} w-full`} href={`/admin/users/${managedUser.id}/edit`}><i className="bi bi-pencil mr-2" />Editar usuario</Link>
      <Link className={`inline-flex h-11 w-full items-center justify-center rounded-lg border border-[#e5253b] text-sm font-extrabold text-white transition-colors hover:bg-[#c91f33]`} href={`/admin/users/${managedUser.id}/${blocked ? "unblock" : "block"}`} method="patch" as="button" preserveState={false}><i className={`bi ${blocked ? "bi-unlock" : "bi-lock"} mr-2`} />{blocked ? "Reactivar usuario" : "Bloquear usuario"}</Link>
    </div>
  </DashboardShell>
}
