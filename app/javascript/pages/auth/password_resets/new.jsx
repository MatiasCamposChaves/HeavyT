import { Head, Link, useForm } from "@inertiajs/react"

import Logo from "../Logo"
import {
  authPage,
  authPanel,
  authShell,
  error,
  field,
  form,
  input,
  label,
  links,
  logoWrap,
  selectionButton,
  textLink,
  title,
} from "../classes"

function errorText(value) {
  return Array.isArray(value) ? value.join(", ") : value
}

export default function NewPasswordReset() {
  const { data, errors, post, processing, setData } = useForm({
    password_reset: {
      email: "",
    },
  })

  function submit(event) {
    event.preventDefault()
    post("/password/forgot")
  }

  return (
    <main className={authPage}>
      <Head title="Recuperar contraseña" />
      <section className={authShell}>
        <div className={authPanel}>
          <div className={logoWrap}>
            <Logo compact />
          </div>
          <h1 className={title}>Recuperar contraseña</h1>

          <form className={form} noValidate onSubmit={submit}>
            <label className={field}>
              <span className={label}>Correo electrónico</span>
              <input
                className={input}
                type="email"
                autoComplete="email"
                value={data.password_reset.email}
                onChange={(event) => setData("password_reset", { email: event.target.value })}
              />
              {errors.email && <p className={error}>{errorText(errors.email)}</p>}
            </label>

            <p className="m-0 text-sm leading-5 text-[#b9bec7]">
              Te enviaremos un enlace temporal para crear una nueva contraseña.
            </p>

            <button className={`${selectionButton} mt-4`} type="submit" disabled={processing}>
              {processing ? "Enviando..." : "Enviar enlace"}
            </button>
          </form>

          <div className={links}>
            <Link className={textLink} href="/login">Volver a iniciar sesión</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
