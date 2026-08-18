import { Head, useForm } from "@inertiajs/react"
import { useState } from "react"

import PasswordVisibilityButton from "../auth/PasswordVisibilityButton"
import DashboardShell, { card, primaryButton } from "../dashboard/DashboardShell"

const inputClass = "h-11 w-full rounded-lg border border-[#3b4049] bg-[#171a20] px-3 text-white accent-[#e5253b] outline-none focus:border-[#e5253b] focus:ring-2 focus:ring-[#e5253b]/25"

function errorText(value) {
  return Array.isArray(value) ? value.join(", ") : value
}

export default function ProfilePage({ user }) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const { data, errors, patch, processing, setData } = useForm({
    user: {
      full_name: user.full_name,
      phone: user.phone,
      password: "",
      password_confirmation: "",
    },
  })

  function update(field, value) {
    setData("user", { ...data.user, [field]: value })
  }

  function submit(event) {
    event.preventDefault()
    patch(`/${user.role}/profile`, { preserveScroll: true })
  }

  return (
    <DashboardShell user={user}>
      <Head title="Mi perfil" />
      <h1 className="mb-5 text-xl font-extrabold uppercase">Mi perfil</h1>
      <form className="grid gap-4" noValidate onSubmit={submit}>
        <section className={`${card} grid gap-4`}>
          <label className="grid gap-2 text-xs font-bold uppercase text-[#aeb2ba]">
            Nombre completo
            <input className={inputClass} required value={data.user.full_name} onChange={(event) => update("full_name", event.target.value)} />
            {errors.full_name && <span className="text-[#ff8391]">{errorText(errors.full_name)}</span>}
          </label>
          <label className="grid gap-2 text-xs font-bold uppercase text-[#aeb2ba]">
            Correo electrónico
            <input className={`${inputClass} cursor-not-allowed opacity-70`} disabled value={user.email} />
          </label>
          <label className="grid gap-2 text-xs font-bold uppercase text-[#aeb2ba]">
            Teléfono
            <input className={inputClass} required value={data.user.phone} onChange={(event) => update("phone", event.target.value)} />
            {errors.phone && <span className="text-[#ff8391]">{errorText(errors.phone)}</span>}
          </label>
        </section>

        <section className={`${card} grid gap-4`}>
          <div>
            <h2 className="m-0 font-extrabold uppercase">Cambiar contraseña</h2>
            <p className="mb-0 mt-1 text-xs text-[#aeb2ba]">Déjala vacía para conservar la contraseña actual.</p>
          </div>
          <label className="grid gap-2 text-xs font-bold uppercase text-[#aeb2ba]">
            Nueva contraseña
            <div className="relative">
              <input
                autoComplete="new-password"
                className={`${inputClass} pr-12`}
                minLength="8"
                type={showPassword ? "text" : "password"}
                value={data.user.password}
                onChange={(event) => update("password", event.target.value)}
              />
              <PasswordVisibilityButton visible={showPassword} onToggle={() => setShowPassword((value) => !value)} />
            </div>
            {errors.password && <span className="text-[#ff8391]">{errorText(errors.password)}</span>}
          </label>
          <label className="grid gap-2 text-xs font-bold uppercase text-[#aeb2ba]">
            Confirmar contraseña
            <div className="relative">
              <input
                autoComplete="new-password"
                className={`${inputClass} pr-12`}
                minLength="8"
                type={showConfirmation ? "text" : "password"}
                value={data.user.password_confirmation}
                onChange={(event) => update("password_confirmation", event.target.value)}
              />
              <PasswordVisibilityButton visible={showConfirmation} onToggle={() => setShowConfirmation((value) => !value)} />
            </div>
            {errors.password_confirmation && <span className="text-[#ff8391]">{errorText(errors.password_confirmation)}</span>}
          </label>
        </section>

        <button className={`${primaryButton} w-full border-0`} disabled={processing} type="submit">
          {processing ? "Guardando..." : "Guardar perfil"}
        </button>
      </form>
    </DashboardShell>
  )
}
