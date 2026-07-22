import { Head, Link } from "@inertiajs/react"

import DashboardShell from "../../dashboard/DashboardShell"
import ProgressReport from "../../shared/ProgressReport"

export default function TrainerProgressShow({ client, report, user }) {
  return <DashboardShell user={user}>
    <Head title={`Progreso de ${client.full_name}`} />
    <Link className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-[#e5253b] no-underline hover:text-[#ff6678]" href="/trainer/progress"><i className="bi bi-arrow-left" />Clientes</Link>
    <h1 className="mb-1 text-2xl font-extrabold uppercase">{client.full_name}</h1>
    <p className="mb-5 text-sm text-[#aeb2ba]">Progreso y actividad acumulada</p>
    <ProgressReport report={report} />
  </DashboardShell>
}
