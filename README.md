# HeavyT

## Definición del Proyecto MicroSaaS

HeavyT es una aplicación web tipo MicroSaaS dirigida a entrenadores personales que necesitan gestionar clientes, crear rutinas de entrenamiento y asignarlas de forma organizada.

La plataforma permite que entrenadores creen una cuenta, generen un código único para vincular clientes y administren rutinas personalizadas. Los clientes pueden registrarse, ingresar el código de su entrenador, consultar sus rutinas asignadas y contactar al entrenador si tienen dudas.

---

## Problema que resuelve

Muchos entrenadores personales manejan sus rutinas por WhatsApp, notas, archivos PDF o mensajes sueltos. Esto puede provocar desorden, pérdida de información y poca claridad para los clientes.

HeavyT centraliza la relación entre entrenador y cliente, permitiendo administrar rutinas, clientes y comunicación básica desde una sola plataforma.

---

## Usuarios del sistema

### Administrador
- Inicia sesión con una cuenta creada previamente por el sistema.
- Puede gestionar entrenadores.
- Puede gestionar clientes.
- Puede revisar usuarios registrados.

### Entrenador
- Puede registrarse e iniciar sesión.
- Puede generar un código único de entrenador.
- Puede crear rutinas.
- Puede asignar rutinas a sus clientes.
- Puede ver y editar su perfil.

### Cliente
- Puede registrarse e iniciar sesión.
- Puede ingresar el código de su entrenador.
- Puede ver información sobre HeavyT.
- Puede ver sus rutinas asignadas.
- Puede contactar a su entrenador.
- Puede ver y editar su perfil.

---

## Objetivo del proyecto

Desarrollar una aplicación web funcional usando Ruby on Rails, React, Vite e Inertia, aplicando autenticación, autorización por roles, CRUD, base de datos relacional, validaciones, testing, pagos y despliegue en producción.

---

## Tecnologías principales

- Ruby on Rails
- React
- Vite
- Inertia.js
- PostgreSQL
- Tailwind CSS
- Devise o autenticación personalizada
- RSpec o Minitest
- Stripe
- GitHub
- Render / Fly.io / Railway

---

## Modelos principales

El sistema contará con al menos los siguientes modelos:

1. User  
   Representa a los usuarios del sistema: administrador, entrenador y cliente.

2. TrainerProfile  
   Información específica del entrenador, incluyendo su código único.

3. ClientProfile  
   Información específica del cliente y su relación con un entrenador.

4. Routine  
   Rutinas creadas por los entrenadores.

5. Exercise  
   Ejercicios que forman parte de una rutina.

6. RoutineAssignment  
   Relación entre rutinas y clientes.

7. Subscription  
   Manejo de planes de pago del entrenador.

---

## Casos de uso principales

1. Registro e inicio de sesión de usuarios.
2. Redirección según rol del usuario.
3. Generación de código único para entrenadores.
4. Vinculación de cliente con entrenador mediante código.
5. Creación de rutinas por parte del entrenador.
6. Asignación de rutinas a clientes.
7. Visualización de rutinas por parte del cliente.
8. Gestión de usuarios por parte del administrador.
9. Edición de perfil de usuario.
10. Contacto básico entre cliente y entrenador.
11. Gestión de suscripción del entrenador mediante Stripe.

---

## CRUD principales

El sistema tendrá CRUD para:

- Usuarios
- Entrenadores
- Clientes
- Rutinas
- Ejercicios
- Asignaciones de rutinas

---

## Flujo general de la aplicación

1. El usuario entra a HeavyT.
2. Puede iniciar sesión o registrarse.
3. Según su rol, el sistema lo redirige a su panel correspondiente.

### Administrador
- Inicia sesión.
- Accede a su panel principal.
- Gestiona entrenadores y clientes.

### Entrenador
- Se registra o inicia sesión.
- Accede a su panel principal.
- Genera su código de entrenador.
- Crea rutinas.
- Asigna rutinas a clientes.

### Cliente
- Se registra o inicia sesión.
- Accede a su pantalla principal.
- Ingresa el código de su entrenador.
- Accede a sus rutinas asignadas.
- Puede contactar a su entrenador.
