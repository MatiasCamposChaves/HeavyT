import { Head, Link, useForm } from "@inertiajs/react"
import { useState } from "react"

import Logo from "./Logo"
import PasswordVisibilityButton from "./PasswordVisibilityButton"
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
} from "./classes"

function errorText(value) {
  return Array.isArray(value) ? value.join(", ") : value
}

export default function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const { data, setData, post, processing, errors } = useForm({
    user: {
      full_name: "",
      email: "",
      phone: "",
      password: "",
      role: "client",
    },
  })

  function updateUser(fieldName, value) {
    setData("user", { ...data.user, [fieldName]: value })
  }

  function submit(event) {
    event.preventDefault()
    post("/register")
  }

  return (
    <main className={authPage}>
      <Head title="Registrar usuario" />
      <section className={authShell}>
        <div className={authPanel}>
          <div className={logoWrap}>
            <Logo compact />
          </div>
          <h1 className={title}>Registrarse</h1>

          <form className={form} onSubmit={submit}>
            <label className={field}>
              <span className={label}>Tipo de cuenta</span>
              <select
                className={input}
                value={data.user.role}
                onChange={(event) => updateUser("role", event.target.value)}
              >
                <option value="client">Cliente</option>
                <option value="trainer">Entrenador personal</option>
              </select>
              {errors.role && <p className={error}>{errorText(errors.role)}</p>}
            </label>

            <label className={field}>
              <span className={label}>Nombre completo</span>
              <input
                className={input}
                autoComplete="name"
                value={data.user.full_name}
                onChange={(event) => updateUser("full_name", event.target.value)}
              />
              {errors.full_name && <p className={error}>{errorText(errors.full_name)}</p>}
            </label>

            <label className={field}>
              <span className={label}>Correo electronico</span>
              <input
                className={input}
                type="email"
                autoComplete="email"
                value={data.user.email}
                onChange={(event) => updateUser("email", event.target.value)}
              />
              {errors.email && <p className={error}>{errorText(errors.email)}</p>}
            </label>

            <label className={field}>
              <span className={label}>Telefono</span>
              <input
                className={input}
                autoComplete="tel"
                value={data.user.phone}
                onChange={(event) => updateUser("phone", event.target.value)}
              />
              {errors.phone && <p className={error}>{errorText(errors.phone)}</p>}
            </label>

            <label className={field}>
              <span className={label}>Contrasena</span>
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

            <button className={`${selectionButton} mt-2.5`} type="submit" disabled={processing}>
              {processing ? "Creando cuenta..." : "Registrarse"}
            </button>
          </form>

          <div className={links}>
            <Link className={textLink} href="/login">Ya tienes cuenta? Iniciar sesion</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
