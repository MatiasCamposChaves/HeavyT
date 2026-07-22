import { Head } from "@inertiajs/react"

import DashboardShell, { card } from "../../dashboard/DashboardShell"
import RoutineForm from "./RoutineForm"

export default function EditRoutine({ routine, user }) {
  return <DashboardShell user={user}>
    <Head title="Editar rutina" />
    <h1 className="mb-5 text-xl font-extrabold uppercase">Editar rutina</h1>
    <section className={card}><RoutineForm routine={routine} /></section>
  </DashboardShell>
}
