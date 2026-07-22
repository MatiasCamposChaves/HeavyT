import { Head } from "@inertiajs/react"

import DashboardShell, { card } from "../../dashboard/DashboardShell"
import RoutineForm from "./RoutineForm"

export default function NewRoutine({ user }) {
  return <DashboardShell user={user}>
    <Head title="Nueva rutina" />
    <h1 className="mb-5 text-xl font-extrabold uppercase">Nueva rutina</h1>
    <section className={card}><RoutineForm /></section>
  </DashboardShell>
}
