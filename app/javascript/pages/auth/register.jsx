import { Head, Link, useForm } from "@inertiajs/react"

import Logo from "./Logo"
import cs from "./auth.module.css"

function errorText(value) {
  return Array.isArray(value) ? value.join(", ") : value
}

export default function Register() {
  const { data, setData, post, processing, errors } = useForm({
    user: {
      full_name: "",
      email: "",
      phone: "",
      password: "",
    },
  })

  function updateUser(field, value) {
    setData("user", { ...data.user, [field]: value })
  }

  function submit(event) {
    event.preventDefault()
    post("/register")
  }

  return (
    <main className={cs.page}>
      <Head title="Registrar usuario" />
      <section>
        <div className={cs.formPanel}>
          <div className={cs.logoWrap}>
            <Logo compact />
          </div>
          <h1 className={cs.title}>Registrarse</h1>

          <form className={cs.form} onSubmit={submit}>
            <label className={cs.field}>
              <span className={cs.label}>Nombre completo</span>
              <input
                className={cs.input}
                autoComplete="name"
                value={data.user.full_name}
                onChange={(event) => updateUser("full_name", event.target.value)}
              />
              {errors.full_name && <p className={cs.error}>{errorText(errors.full_name)}</p>}
            </label>

            <label className={cs.field}>
              <span className={cs.label}>Correo electronico</span>
              <input
                className={cs.input}
                type="email"
                autoComplete="email"
                value={data.user.email}
                onChange={(event) => updateUser("email", event.target.value)}
              />
              {errors.email && <p className={cs.error}>{errorText(errors.email)}</p>}
            </label>

            <label className={cs.field}>
              <span className={cs.label}>Telefono</span>
              <input
                className={cs.input}
                autoComplete="tel"
                value={data.user.phone}
                onChange={(event) => updateUser("phone", event.target.value)}
              />
              {errors.phone && <p className={cs.error}>{errorText(errors.phone)}</p>}
            </label>

            <label className={cs.field}>
              <span className={cs.label}>Contraseña</span>
              <input
                className={cs.input}
                type="password"
                autoComplete="new-password"
                value={data.user.password}
                onChange={(event) => updateUser("password", event.target.value)}
              />
              {errors.password && <p className={cs.error}>{errorText(errors.password)}</p>}
            </label>

            <button className={`${cs.selectionButton} ${cs.registerSubmit}`} type="submit" disabled={processing}>
              {processing ? "Creando cuenta..." : "Registrarse"}
            </button>
          </form>

          <div className={cs.links}>
            <Link className={cs.textLink} href="/login">¿Ya tienes cuenta? Iniciar sesión</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
