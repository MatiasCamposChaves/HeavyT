import { Head, Link } from "@inertiajs/react"

import { selectionButton } from "../auth/classes"
import Logo from "../auth/Logo"

export default function Dashboard({ user }) {
  return (
    <main className="min-h-dvh bg-[#171a20] px-4 py-8 text-[#f6f7fb] sm:px-6 sm:py-11">
      <Head title="Dashboard" />
      <div className="mx-auto max-w-[780px]">
        <Logo compact />
        <h1 className="mb-2.5 mt-[18px] break-words text-2xl font-bold sm:text-3xl">Bienvenido, {user.full_name}</h1>
        <p className="mb-[22px] max-w-prose text-sm leading-6 text-[#d7d9df] sm:text-base">Tu sesion esta activa y la autenticacion de Heavy T ya esta funcionando.</p>

        <div className="my-[26px] grid gap-2.5 overflow-hidden rounded-lg border border-[#353a42] p-4 text-sm sm:p-[18px] sm:text-base">
          <strong>Cuenta</strong>
          <span className="break-words">{user.email}</span>
          <span className="break-words">{user.phone}</span>
        </div>

        <Link className={selectionButton} href="/logout" method="delete" as="button">
          Cerrar sesion
        </Link>
      </div>
    </main>
  )
}
