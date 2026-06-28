import { Head, Link } from "@inertiajs/react"

import Logo from "../auth/Logo"
import cs from "../auth/auth.module.css"

export default function Dashboard({ user }) {
  return (
    <main className={cs.dashboard}>
      <Head title="Dashboard" />
      <div className={cs.dashboardInner}>
        <Logo compact />
        <h1 className={cs.dashboardTitle}>Bienvenido, {user.full_name}</h1>
        <p className={cs.dashboardText}>Tu sesión está activa y la autenticación de Heavy T ya está funcionando.</p>

        <div className={cs.accountBox}>
          <strong>Cuenta</strong>
          <span>{user.email}</span>
          <span>{user.phone}</span>
        </div>

        <Link className={cs.outlineButton} href="/logout" method="delete" as="button">
          Cerrar sesión
        </Link>
      </div>
    </main>
  )
}
