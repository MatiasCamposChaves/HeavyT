import { Head, Link, useForm } from "@inertiajs/react"

import Logo from "./Logo"
import cs from "./auth.module.css"

function errorText(value) {
  return Array.isArray(value) ? value.join(", ") : value
}

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
    session: {
      email: "",
      password: "",
    },
  })

  function submit(event) {
    event.preventDefault()
    post("/login")
  }

  return (
    <main className={cs.page}>
      <Head title="Login" />
      <section>
        <div className={cs.formPanel}>
          <div className={cs.logoWrap}>
            <Logo compact />
          </div>
          <h1 className={cs.title}>Iniciar sesión</h1>

          <form className={cs.form} onSubmit={submit}>
            <label className={cs.field}>
              <span className={cs.label}>Correo electronico</span>
              <input
                className={cs.input}
                type="email"
                autoComplete="email"
                value={data.session.email}
                onChange={(event) => setData("session", { ...data.session, email: event.target.value })}
              />
              {errors.email && <p className={cs.error}>{errorText(errors.email)}</p>}
            </label>

            <label className={cs.field}>
              <span className={cs.label}>Contraseña</span>
              <input
                className={cs.input}
                type="password"
                autoComplete="current-password"
                value={data.session.password}
                onChange={(event) => setData("session", { ...data.session, password: event.target.value })}
              />
              {errors.password && <p className={cs.error}>{errorText(errors.password)}</p>}
            </label>

            <button className={`${cs.selectionButton} ${cs.submit}`} type="submit" disabled={processing}>
              {processing ? "Ingresando..." : "Iniciar sesión"}
            </button>
          </form>

          <div className={cs.links}>
            <a className={cs.textLink} href="mailto:soporte@heavyt.local">Olvide mi contraseña</a>
            <Link className={cs.textLink} href="/register">¿No tienes cuenta? Registrate</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
