import { Head, Link } from "@inertiajs/react"

import DashboardShell from "../../dashboard/DashboardShell"
import ProgressReport from "../../shared/ProgressReport"

export default function ClientProgress({ report, user }) {
  return <DashboardShell user={user}>
    <Head title="Mi progreso" />
    <Link className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-[#e5253b] no-underline hover:text-[#ff6678]" href="/client/routines"><i className="bi bi-arrow-left" />Mis rutinas</Link>
    <h1 className="mb-5 text-2xl font-extrabold uppercase">Mi progreso</h1>
    <ProgressReport report={report} />
  </DashboardShell>
}
