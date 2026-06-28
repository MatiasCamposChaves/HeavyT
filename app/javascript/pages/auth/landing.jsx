import { Head, Link } from "@inertiajs/react"

import Logo from "./Logo"
import cs from "./auth.module.css"

export default function Landing() {
  return (
    <main className={cs.page}>
      <Head title="Heavy T" />
      <div className={cs.selector}>
        <div className={cs.landingStack}>
          <section className={`${cs.panel} ${cs.landingPanel}`}>
            <div className={cs.logoWrap}>
              <Logo />
            </div>
            <div className={cs.actions}>
              <Link className={cs.selectionButton} href="/login">Iniciar sesion</Link>
              <Link className={cs.selectionButton} href="/register">Registrarse</Link>
            </div>
          </section>
          <div className={cs.brandFooter}>
            <strong>HEAVY T</strong>
            <span>Sistema de entrenamiento</span>
          </div>
        </div>
      </div>
    </main>
  )
}
