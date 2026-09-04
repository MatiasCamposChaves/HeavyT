import { useState } from "react"

const helpByPath = [
  {
    match: /^\/admin\/users/,
    title: "Gestión de usuarios",
    items: [
      "Busca usuarios por nombre o correo y filtra por rol o estado.",
      "Abre una cuenta para consultar sus relaciones y editar sus datos.",
      "Bloquear impide inmediatamente que el usuario vuelva a utilizar HeavyT.",
      "Reactivar devuelve el acceso sin modificar sus datos o asignaciones.",
    ],
  },
  {
    match: /^\/(client|trainer|admin)\/profile$/,
    title: "Administrar perfil",
    items: [
      "Puedes actualizar tu nombre completo y teléfono.",
      "El correo identifica tu cuenta y por ahora no puede modificarse.",
      "Para cambiar la contraseña, completa ambos campos de contraseña.",
      "El botón de cerrar sesión también está disponible en la parte superior.",
    ],
  },
  {
    match: /^\/trainer\/exercise-bank/,
    title: "Banco de ejercicios",
    items: [
      "Crea cada ejercicio una sola vez para reutilizarlo al armar rutinas.",
      "Selecciona un grupo muscular predeterminado para mantener el banco ordenado.",
      "Equipo y notas ayudan a diferenciar ejercicios con nombres parecidos.",
      "El inventario se organiza por grupo muscular para encontrar ejercicios más rápido.",
    ],
  },
  {
    match: /^\/trainer\/routines\/new$/,
    title: "Crear una rutina",
    items: [
      "Nombre: identifica la rutina para ti y tus clientes.",
      "Objetivo: indica si está enfocada en fuerza, hipertrofia o resistencia.",
      "Descripción: agrega información general o recomendaciones.",
      "La rutina se crea como borrador hasta que tenga ejercicios y sea asignada.",
    ],
  },
  {
    match: /^\/trainer\/routines\/\d+\/edit$/,
    title: "Editar la rutina",
    items: [
      "Puedes cambiar el nombre, objetivo y descripción.",
      "Borrador oculta la rutina a los clientes; Activa permite que la consulten.",
      "Los ejercicios y clientes asignados se administran desde el detalle de la rutina.",
    ],
  },
  {
    match: /^\/trainer\/routines\/\d+$/,
    title: "Ejercicios y asignación",
    items: [
      "Primero selecciona el grupo muscular y luego el ejercicio guardado en el banco.",
      "Series: cantidad de bloques que debe completar el cliente.",
      "Repeticiones: movimientos que se realizan en cada serie.",
      "Descanso (seg): tiempo de recuperación entre series, expresado en segundos.",
      "Peso sugerido (lb): carga recomendada, expresada en libras.",
      "Tipo de serie permite indicar serie normal, biserie, superserie o drop set.",
      "En biseries y superseries selecciona el ejercicio combinado desde el banco.",
      "En drop set indica cuántas bajadas de peso debe registrar el cliente.",
      "Finalizar y asignar activa la rutina para los clientes seleccionados.",
    ],
  },
  {
    match: /^\/trainer\/routines/,
    title: "Administrar rutinas",
    items: [
      "Nueva crea una rutina desde cero.",
      "Borrador indica que aún está en preparación.",
      "Activa indica que puede ser consultada por clientes asignados.",
      "Abre una rutina para agregar ejercicios, técnicas avanzadas y clientes.",
    ],
  },
  {
    match: /^\/trainer\/dashboard/,
    title: "Panel del entrenador",
    items: [
      "Genera un código y compártelo solamente con tus clientes.",
      "El código vence después de 24 horas.",
      "Regenerar el código desactiva inmediatamente el anterior.",
      "Los clientes vinculados aparecerán en la lista inferior.",
    ],
  },
  {
    match: /^\/trainer\/workouts\/\d+$/,
    title: "Detalle de actividad",
    items: [
      "Aquí revisas lo que registró el cliente durante un entrenamiento.",
      "Las biseries y superseries muestran datos del ejercicio principal y del combinado.",
      "Los drop sets muestran cada bajada con sus repeticiones y peso.",
      "Eliminar del historial borra esa sesión registrada.",
    ],
  },
  {
    match: /^\/trainer\/workouts/,
    title: "Actividad de clientes",
    items: [
      "Consulta los entrenamientos iniciados o completados por tus clientes.",
      "Abre una actividad para revisar series, repeticiones, pesos y notas.",
      "Los ejercicios completados aparecen marcados con estado finalizado.",
    ],
  },
  {
    match: /^\/trainer\/progress\/\d+/,
    title: "Progreso del cliente",
    items: [
      "Revisa el progreso histórico del cliente según entrenamientos completados.",
      "El volumen total se calcula con series, repeticiones y peso registrado.",
      "La gráfica por ejercicio ayuda a ver cambios de carga con el tiempo.",
    ],
  },
  {
    match: /^\/trainer\/progress/,
    title: "Progreso de clientes",
    items: [
      "Selecciona un cliente para ver sus métricas de entrenamiento.",
      "Los reportes usan solo entrenamientos completados.",
      "Si un cliente aún no registra pesos, su progreso aparecerá limitado.",
    ],
  },
  {
    match: /^\/trainer\/notifications/,
    title: "Notificaciones",
    items: [
      "Aquí aparecen avisos importantes relacionados con tus clientes.",
      "Revisa nuevas asignaciones, actividad o eventos pendientes.",
      "Las notificaciones ayudan a dar seguimiento sin revisar cada pantalla manualmente.",
    ],
  },
  {
    match: /^\/client\/workouts\/\d+$/,
    title: "Registrar entrenamiento",
    items: [
      "Completa series, repeticiones y peso utilizado para cada ejercicio.",
      "En biseries y superseries registra el ejercicio principal y el combinado.",
      "En drop set completa cada bajada de peso que indicó tu entrenador.",
      "Marca el ejercicio como completado para poder guardar el avance.",
      "Cuando todos los ejercicios estén completados, finaliza el entrenamiento.",
    ],
  },
  {
    match: /^\/client\/workouts/,
    title: "Historial",
    items: [
      "Aquí ves tus entrenamientos anteriores y sesiones en progreso.",
      "Completado indica que finalizaste toda la rutina de ese día.",
      "En progreso indica que todavía puedes seguir registrando ejercicios.",
    ],
  },
  {
    match: /^\/client\/routines\/\d+$/,
    title: "Detalle de la rutina",
    items: [
      "Completa los ejercicios en el orden mostrado.",
      "Las series y repeticiones aparecen junto al nombre del ejercicio.",
      "El descanso está expresado en segundos y el peso sugerido en libras.",
      "Las técnicas avanzadas aparecen debajo del ejercicio cuando aplican.",
      "Lee las notas de tu entrenador antes de comenzar cada ejercicio.",
    ],
  },
  {
    match: /^\/client\/routines/,
    title: "Mis rutinas",
    items: [
      "Aquí aparecen únicamente las rutinas activas que te asignó tu entrenador.",
      "Selecciona una tarjeta para consultar ejercicios e instrucciones.",
      "Si no aparece ninguna rutina, tu entrenador todavía no te ha asignado una.",
    ],
  },
  {
    match: /^\/client\/dashboard/,
    title: "Panel del cliente",
    items: [
      "Usa el código de seis caracteres que te compartió tu entrenador.",
      "Los códigos vencen después de 24 horas.",
      "Una vez vinculado, podrás consultar los datos de contacto y tus rutinas.",
      "Cada cliente puede estar vinculado con un solo entrenador.",
    ],
  },
  {
    match: /^\/client\/progress/,
    title: "Mi progreso",
    items: [
      "Consulta tus entrenamientos completados y el volumen registrado.",
      "El peso máximo usa los ejercicios donde registraste carga.",
      "El progreso por ejercicio se actualiza conforme guardas entrenamientos.",
    ],
  },
  {
    match: /^\/client\/notifications/,
    title: "Notificaciones",
    items: [
      "Aquí aparecen avisos de rutinas asignadas y cambios importantes.",
      "Usa las notificaciones para entrar rápido a tus rutinas pendientes.",
      "Si no hay avisos, no tienes acciones nuevas por revisar.",
    ],
  },
  {
    match: /^\/admin\/dashboard/,
    title: "Panel administrativo",
    items: [
      "Clientes activos muestra las cuentas registradas como cliente.",
      "Entrenadores activos muestra las cuentas registradas como entrenador.",
      "La gestión completa de usuarios será habilitada en una siguiente etapa.",
    ],
  },
]

function currentHelp() {
  const path = window.location.pathname
  return helpByPath.find((entry) => entry.match.test(path)) || {
    title: "Ayuda de HeavyT",
    items: [
      "Usa el menú lateral para moverte entre inicio, rutinas, progreso, notificaciones y perfil.",
      "En pantallas pequeñas, la navegación principal aparece en la parte inferior.",
      "El botón de cerrar sesión está disponible en la parte superior.",
    ],
  }
}

export default function HelpPopover() {
  const [open, setOpen] = useState(false)
  const help = currentHelp()

  return (
    <>
      <button
        aria-label="Abrir instrucciones"
        className="mt-3 inline-flex h-8 w-8 items-center justify-center self-end rounded-full border border-[#e5253b] bg-[#25282e] text-sm font-black text-white shadow-md transition-colors hover:border-[#c91f33] hover:bg-[#c91f33]"
        type="button"
        onClick={() => setOpen(true)}
      >
        !
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5" role="presentation" onMouseDown={() => setOpen(false)}>
          <section
            aria-labelledby="help-title"
            aria-modal="true"
            className="max-h-[80dvh] w-full max-w-[360px] overflow-y-auto rounded-xl border border-[#3b4049] bg-[#1c1f25] p-5 text-left shadow-2xl"
            role="dialog"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <h2 className="m-0 text-lg font-extrabold uppercase" id="help-title">{help.title}</h2>
              <button aria-label="Cerrar instrucciones" className="h-8 w-8 rounded-full border border-[#4b5059] bg-transparent text-lg font-bold text-white transition-colors hover:border-[#c91f33] hover:bg-[#c91f33]" type="button" onClick={() => setOpen(false)}>×</button>
            </div>
            <ul className="m-0 grid gap-3 pl-5 text-sm leading-6 text-[#d5d8de]">
              {help.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <button className="mt-5 h-10 w-full rounded-lg border-0 bg-[#e5253b] text-sm font-extrabold text-white transition-colors hover:bg-[#c91f33]" type="button" onClick={() => setOpen(false)}>Entendido</button>
          </section>
        </div>
      )}
    </>
  )
}
