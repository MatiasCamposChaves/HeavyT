import { card } from "../dashboard/DashboardShell"

const numberText = (value) => new Intl.NumberFormat("es-GT", { maximumFractionDigits: 1 }).format(value || 0)
const dateText = (value) => value ? new Intl.DateTimeFormat("es-GT", { dateStyle: "medium" }).format(new Date(value)) : "Sin registros"

function LineChart({ points }) {
  if (points.length === 0) return <p className="m-0 text-sm text-[#aeb2ba]">Aún no hay pesos registrados.</p>

  const weights = points.map((point) => Number(point.weight_lb))
  const min = Math.min(...weights)
  const max = Math.max(...weights)
  const range = Math.max(max - min, 1)
  const coordinates = points.map((point, index) => {
    const x = points.length === 1 ? 50 : 5 + (index / (points.length - 1)) * 90
    const y = 85 - ((Number(point.weight_lb) - min) / range) * 65
    return { ...point, x, y }
  })

  return <div>
    <svg aria-label="Evolución del peso" className="h-40 w-full overflow-visible" role="img" viewBox="0 0 100 100" preserveAspectRatio="none">
      <line stroke="#3b4049" strokeWidth="0.7" x1="5" x2="95" y1="85" y2="85" />
      {coordinates.length > 1 && <polyline fill="none" points={coordinates.map((point) => `${point.x},${point.y}`).join(" ")} stroke="#e5253b" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" vectorEffect="non-scaling-stroke" />}
      {coordinates.map((point, index) => <circle cx={point.x} cy={point.y} fill="#e5253b" key={`${point.date}-${index}`} r="2.2" vectorEffect="non-scaling-stroke" />)}
    </svg>
    <div className="mt-1 flex justify-between text-xs text-[#aeb2ba]"><span>{points[0].date}</span><strong className="text-white">{numberText(weights[weights.length - 1])} lb</strong><span>{points[points.length - 1].date}</span></div>
  </div>
}

function WeeklyChart({ data }) {
  const max = Math.max(...data.map((item) => item.value), 1)
  return <div className="grid gap-2">
    <div className="flex h-36 items-end gap-2 border-b border-[#3b4049] pb-1">
      {data.map((item) => <div className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1" key={item.label} title={`${item.label} ${item.short_label}`}>
        <span className="h-4 text-xs font-bold text-white">{item.value || ""}</span>
        <div
          className={`w-full max-w-10 rounded-t ${item.value ? "bg-[#e5253b]" : "bg-[#3b4049]"}`}
          style={{ height: `${item.value ? Math.max((item.value / max) * 90, 8) : 2}px`, opacity: item.value ? 1 : 0.6 }}
        />
        <span className="text-[10px] font-bold uppercase text-[#aeb2ba]">{item.label.slice(0, 3)}</span>
        <span className="hidden text-[10px] text-[#aeb2ba] sm:block">{item.short_label}</span>
      </div>)}
    </div>
    <p className="m-0 text-xs text-[#aeb2ba]">Muestra únicamente la semana actual, de lunes a domingo.</p>
  </div>
}

export default function ProgressReport({ report }) {
  const summary = report.summary
  return <div className="grid gap-5">
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:gap-4">
      <div className={card}><p className="mb-2 text-xs font-bold uppercase text-[#aeb2ba]">Entrenamientos totales</p><strong className="text-3xl text-[#e5253b]">{summary.completed_workouts}</strong></div>
      <div className={card}><p className="mb-2 text-xs font-bold uppercase text-[#aeb2ba]">Peso máximo</p><strong className="text-2xl text-white">{numberText(summary.max_weight_lb)}</strong><span className="ml-1 text-xs text-[#aeb2ba]">lb</span></div>
      <div className={card}><p className="mb-2 text-xs font-bold uppercase text-[#aeb2ba]">Última sesión</p><strong className="text-sm text-white">{dateText(summary.last_workout_at)}</strong></div>
    </section>

    <section className={card}><h2 className="mb-4 text-lg font-extrabold uppercase">Actividad semanal</h2><WeeklyChart data={report.weekly_activity} /></section>

    <section><h2 className="mb-4 text-lg font-extrabold uppercase">Progreso por ejercicio</h2><div className="grid gap-4 lg:grid-cols-2">
      {report.exercise_progress.length === 0 ? <p className={card}>Completa entrenamientos registrando peso para ver tu evolución.</p> : report.exercise_progress.map((exercise) => <article className={card} key={exercise.name}><h3 className="mb-3 text-base font-extrabold">{exercise.name}</h3><LineChart points={exercise.points} /></article>)}
    </div></section>
  </div>
}
