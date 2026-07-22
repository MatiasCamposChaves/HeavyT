import { Head, Link, useForm } from "@inertiajs/react"
import { useState } from "react"

import Logo from "./Logo"
import PasswordVisibilityButton from "./PasswordVisibilityButton"
import FlashToast from "../dashboard/FlashToast"
import {
  authPage,
  authPanel,
  authShell,
  error,
  field,
  form,
  formAlert,
  input,
  label,
  links,
  logoWrap,
  selectionButton,
  textLink,
  title,
} from "./classes"

function errorText(value) {
  return Array.isArray(value) ? value.join(", ") : value
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
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

  const loginError = errors.auth || errors.email

  return (
    <main className={authPage}>
      <Head title="Login" />
      <section className={authShell}>
        <div className={`${authPanel} relative`}>
          <FlashToast />
          <div className={logoWrap}>
            <Logo compact />
          </div>
          <h1 className={title}>Iniciar sesion</h1>

          <form className={form} onSubmit={submit}>
            <label className={field}>
              <span className={label}>Correo electronico</span>
              <input
                className={input}
                type="email"
                autoComplete="email"
                required
                value={data.session.email}
                onChange={(event) => setData("session", { ...data.session, email: event.target.value })}
              />
            </label>

            <label className={field}>
              <span className={label}>Contrasena</span>
              <div className="relative">
                <input
                  className={`${input} pr-12`}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={data.session.password}
                  onChange={(event) => setData("session", { ...data.session, password: event.target.value })}
                />
                <PasswordVisibilityButton visible={showPassword} onToggle={() => setShowPassword((visible) => !visible)} />
              </div>
              {errors.password && <p className={error}>{errorText(errors.password)}</p>}
            </label>

            {loginError && (
              <p className={formAlert} role="alert">
                {errorText(loginError)}
              </p>
            )}

            <button className={`${selectionButton} mt-6 sm:mt-[26px]`} type="submit" disabled={processing}>
              {processing ? "Ingresando..." : "Iniciar sesion"}
            </button>
          </form>

          <div className={links}>
            <a className={textLink} href="mailto:soporte@heavyt.local">Olvide mi contrasena</a>
            <Link className={textLink} href="/register">No tienes cuenta? Registrate</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
