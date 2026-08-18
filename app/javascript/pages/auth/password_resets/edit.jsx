import { Head, Link, useForm } from "@inertiajs/react"
import { useState } from "react"

import Logo from "../Logo"
import PasswordVisibilityButton from "../PasswordVisibilityButton"
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

export default function EditPasswordReset({ token }) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const { data, errors, patch, processing, setData } = useForm({
    user: {
      password: "",
      password_confirmation: "",
    },
  })

  function updateUser(fieldName, value) {
    setData("user", { ...data.user, [fieldName]: value })
  }

  function submit(event) {
    event.preventDefault()
    patch(`/password/reset/${token}`)
  }

  return (
    <main className={authPage}>
      <Head title="Nueva contraseña" />
      <section className={authShell}>
        <div className={authPanel}>
          <div className={logoWrap}>
            <Logo compact />
          </div>
          <h1 className={title}>Nueva contraseña</h1>

          <form className={form} noValidate onSubmit={submit}>
            <label className={field}>
              <span className={label}>Contraseña</span>
              <div className="relative">
                <input
                  className={`${input} pr-12`}
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={data.user.password}
                  onChange={(event) => updateUser("password", event.target.value)}
                />
                <PasswordVisibilityButton visible={showPassword} onToggle={() => setShowPassword((visible) => !visible)} />
              </div>
              {errors.password && <p className={error}>{errorText(errors.password)}</p>}
            </label>

            <label className={field}>
              <span className={label}>Confirmar contraseña</span>
              <div className="relative">
                <input
                  className={`${input} pr-12`}
                  type={showConfirmation ? "text" : "password"}
                  autoComplete="new-password"
                  value={data.user.password_confirmation}
                  onChange={(event) => updateUser("password_confirmation", event.target.value)}
                />
                <PasswordVisibilityButton visible={showConfirmation} onToggle={() => setShowConfirmation((visible) => !visible)} />
              </div>
              {errors.password_confirmation && <p className={error}>{errorText(errors.password_confirmation)}</p>}
            </label>

            <p className="m-0 text-xs leading-5 text-[#aeb2ba]">
              La contraseña debe tener al menos 8 caracteres.
            </p>

            <button className={`${selectionButton} mt-4`} type="submit" disabled={processing}>
              {processing ? "Guardando..." : "Actualizar contraseña"}
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
