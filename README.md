# HeavyT

## Definición del Proyecto MicroSaaS

HeavyT es una aplicación web tipo MicroSaaS enfocada en entrenadores personales que necesitan gestionar clientes, crear rutinas de entrenamiento y asignarlas de manera organizada.

La plataforma permite que entrenadores creen una cuenta, generen un código único para vincular clientes y administren rutinas personalizadas. Los clientes pueden registrarse, ingresar el código de su entrenador, consultar sus rutinas asignadas y contactar al entrenador si tienen dudas.

---

# Problema que resuelve

Muchos entrenadores personales manejan sus rutinas mediante mensajes de WhatsApp, notas o archivos PDF, lo que provoca desorden, pérdida de información y dificultad para administrar clientes.

HeavyT centraliza la relación entre entrenador y cliente en una sola plataforma, permitiendo administrar rutinas, clientes y suscripciones de manera profesional.

---

# Objetivo del proyecto

Desarrollar una aplicación web funcional utilizando Ruby on Rails, React, Vite e Inertia.js, aplicando conceptos reales de:

- Arquitectura MVC
- Autenticación y autorización
- Base de datos relacional
- CRUD
- Testing automatizado
- Stripe
- Deploy en producción

---

# Usuarios del sistema

## Administrador

El administrador posee una cuenta creada directamente desde el sistema.

Funciones:
- Iniciar sesión
- Gestionar entrenadores
- Gestionar clientes
- Editar usuarios
- Bloquear usuarios
- Ver estadísticas básicas

---

## Entrenador

El entrenador puede registrarse e iniciar sesión.

Funciones:
- Generar un código único de entrenador
- Crear rutinas
- Editar rutinas
- Asignar rutinas a clientes
- Ver lista de clientes
- Administrar su perfil
- Administrar su suscripción

---

## Cliente

El cliente puede registrarse e iniciar sesión.

Funciones:
- Ingresar código de entrenador
- Ver rutinas asignadas
- Ver información de HeavyT
- Contactar a su entrenador
- Administrar su perfil

---

# Modelo de negocio

HeavyT funciona como una plataforma SaaS para entrenadores personales.

Los entrenadores pagan una suscripción mensual para utilizar las funciones premium de la plataforma.

## Plan Free
- Máximo 3 clientes
- Máximo 2 rutinas activas

## Plan Pro
- Clientes ilimitados
- Rutinas ilimitadas
- Acceso completo a la plataforma

Los pagos serán gestionados mediante Stripe.

---

# Tecnologías principales

## Backend
- Ruby on Rails

## Frontend
- React
- Vite
- Inertia.js
- TailwindCSS

## Base de datos
- PostgreSQL

## Infraestructura
- Docker
- GitHub
- Render / Railway / Fly.io

## Testing
- RSpec o Minitest

## Pagos
- Stripe

---

# Modelos principales

El sistema contará con los siguientes modelos principales:

1. User  
   Maneja autenticación y roles.

2. TrainerProfile  
   Información específica del entrenador.

3. ClientProfile  
   Información específica del cliente.

4. Routine  
   Rutinas creadas por entrenadores.

5. Exercise  
   Ejercicios pertenecientes a una rutina.

6. RoutineAssignment  
   Relación entre rutinas y clientes.

7. Subscription  
   Manejo de planes y pagos.

---

# Relaciones principales

- Un entrenador tiene muchos clientes.
- Un entrenador puede crear muchas rutinas.
- Una rutina tiene muchos ejercicios.
- Un cliente puede tener varias rutinas asignadas.
- Un usuario tiene un rol específico.

---

# Casos de uso principales

1. Registro e inicio de sesión de usuarios.
2. Redirección automática según rol.
3. Generación automática de código de entrenador.
4. Vinculación de cliente con entrenador mediante código.
5. Creación de rutinas por parte del entrenador.
6. Asignación de rutinas a clientes.
7. Visualización de rutinas por parte del cliente.
8. Gestión de usuarios por parte del administrador.
9. Restricción de funciones según suscripción.
10. Cobro de suscripción mediante Stripe.
11. Contacto entre cliente y entrenador.

---

# CRUD principales

El sistema tendrá CRUD para:

- Usuarios
- Entrenadores
- Clientes
- Rutinas
- Ejercicios
- Asignaciones de rutinas
- Suscripciones

---

# Validaciones del sistema

## Usuarios
- Email único
- Contraseña mínima de 8 caracteres
- Confirmación de contraseña

## Entrenadores
- Código de entrenador único
- Nombre obligatorio

## Clientes
- No pueden ingresar códigos inválidos
- Solo pueden vincularse a un entrenador

## Rutinas
- Nombre obligatorio
- Debe tener al menos un ejercicio

## Ejercicios
- Series mayores a 0
- Repeticiones mayores a 0

## Suscripciones
- Solo entrenadores con suscripción activa pueden acceder a funciones premium

---

# Flujo general de la aplicación

## Inicio
1. El usuario entra a HeavyT.
2. Puede iniciar sesión o registrarse.
3. Según su rol, el sistema lo redirige a su panel correspondiente.

---

## Flujo Administrador
1. Inicia sesión.
2. Accede al panel administrativo.
3. Gestiona entrenadores y clientes.
4. Puede editar o bloquear usuarios.

---

## Flujo Entrenador
1. Se registra o inicia sesión.
2. Accede a su panel principal.
3. Genera su código de entrenador.
4. Crea rutinas.
5. Asigna rutinas a clientes.

---

## Flujo Cliente
1. Se registra o inicia sesión.
2. Ingresa código de entrenador.
3. Accede a sus rutinas asignadas.
4. Puede contactar a su entrenador.

---

# MVP del proyecto

La primera versión funcional del proyecto incluirá:

- Autenticación completa
- Roles de usuario
- CRUD de rutinas
- CRUD de ejercicios
- Generación de código de entrenador
- Vinculación cliente-entrenador
- Asignación de rutinas
- Panel administrativo básico
- Stripe para suscripciones
- Validaciones
- Testing automatizado
- Deploy en producción

---

# Funciones fuera del MVP

Las siguientes funciones quedan fuera de la primera versión:

- Chat en tiempo real
- Aplicación móvil
- Inteligencia artificial para rutinas
- Seguimiento corporal avanzado
- Integración con relojes inteligentes
- Sistema nutricional
- Videollamadas

---

# Arquitectura general

## Backend
- Ruby on Rails
- Arquitectura MVC
- PostgreSQL

## Frontend
- React + Inertia.js
- TailwindCSS

## Infraestructura
- Docker
- GitHub Actions
- Deploy en Render o Railway

---