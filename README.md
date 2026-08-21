# HeavyT

HeavyT es una aplicación web para entrenadores personales que centraliza la gestión de clientes, rutinas semanales y seguimiento de entrenamientos. Fue desarrollada como proyecto del curso de Ruby on Rails y React impartido por Universidad CENFOTEC y OfficeSpace Software.

## Funcionalidades implementadas

### Autenticación y perfiles

- Registro e inicio de sesión para entrenadores y clientes.
- Recuperación de contraseña mediante código de un solo uso enviado por correo.
- Redirección y autorización según el rol del usuario.
- Edición de perfil y cambio de contraseña.
- Bloqueo de usuarios y restricción de acceso desde el panel administrativo.

### Entrenador

- Generación y renovación de un código para vincular clientes.
- Visualización de clientes vinculados.
- CRUD de rutinas y ejercicios.
- Banco reutilizable de ejercicios.
- Organización de ejercicios por día de la semana y cambio de orden.
- Asignación de rutinas por semanas con fecha de vencimiento.
- Historial de entrenamientos de cada cliente.
- Seguimiento del progreso de los clientes.
- Notificaciones de rutinas próximas a vencer o vencidas.
- Extensión o finalización de asignaciones.

### Cliente

- Vinculación con un entrenador mediante código.
- Consulta de rutinas organizadas por día.
- Registro de series, repeticiones, peso y notas de cada ejercicio.
- Historial de entrenamientos y reporte de progreso.
- Notificaciones de nuevas rutinas y fechas de vigencia.

### Administrador

- Panel con estadísticas generales.
- Búsqueda y filtrado de usuarios.
- Consulta y edición de usuarios.
- Bloqueo y desbloqueo de cuentas.

## Tecnologías

- Ruby 4.0 y Ruby on Rails 8.1
- React 19 e Inertia.js
- Vite y Tailwind CSS
- PostgreSQL
- Minitest
- GitHub Actions
- Brakeman, Bundler Audit y npm audit

## Requisitos

- Ruby 4.0.3
- PostgreSQL
- Node.js 24 y npm
- Bundler

## Instalación local

1. Clona el repositorio e ingresa a la carpeta:

   ```bash
   git clone https://github.com/MatiasCamposChaves/HeavyT.git
   cd HeavyT
   ```

2. Instala las dependencias:

   ```bash
   bundle install
   npm ci
   ```

3. Copia `.env.example` como `.env` y configura las credenciales locales de PostgreSQL. Las variables de correo son opcionales durante el desarrollo.

4. Prepara la base de datos:

   ```bash
   bin/rails db:prepare
   bin/rails db:seed
   ```

5. Inicia Rails y Vite:

   ```bash
   bin/dev
   ```

6. Abre `http://127.0.0.1:3000`.

## Usuarios de demostración

Los usuarios creados por `bin/rails db:seed` utilizan la contraseña `password123`.

| Rol | Correo |
| --- | --- |
| Administrador | `admin@heavyt.local` |
| Entrenador | `entrenador@heavyt.local` |
| Cliente | `cliente@heavyt.local` |

Estas credenciales son exclusivamente para desarrollo y demostración; no deben utilizarse en producción.

## Calidad y seguridad

Ejecuta las verificaciones locales con:

```bash
bin/rails test
bin/rubocop
bin/brakeman --no-pager
bin/bundler-audit
npm audit --audit-level=high
npm exec vite build
```

GitHub Actions ejecuta estas verificaciones automáticamente en cada pull request y en cada cambio enviado a `main`.

## Arquitectura

Rails gestiona el dominio, la persistencia, la autenticación y la autorización. React renderiza las interfaces mediante Inertia.js, lo que permite mantener rutas y controladores del lado de Rails sin crear una API separada. PostgreSQL almacena usuarios, perfiles, rutinas, asignaciones y resultados de entrenamiento.

## Próximos pasos

- Despliegue público de la aplicación.
- Suscripciones para entrenadores y pagos con Stripe.
- Ampliación de pruebas de sistema de extremo a extremo.
- Mejoras de accesibilidad y experiencia de usuario.

## Estado del proyecto

Proyecto académico en desarrollo activo. Las funciones principales de administración, gestión de rutinas y seguimiento de entrenamientos están implementadas; pagos y despliegue todavía no forman parte de la versión actual.
