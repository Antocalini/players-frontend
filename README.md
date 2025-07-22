# PlayerHub - Frontend

Plataforma web para la gestión de jugadores deportivos. Permite explorar, registrar, editar y administrar jugadores de manera intuitiva, conectándose a una API backend para persistencia y autenticación.

## 🚀 Descripción

PlayerHub es una aplicación Angular moderna que facilita la gestión de plantillas deportivas. Incluye autenticación de usuarios, roles de administrador, y un sistema CRUD para jugadores. Utiliza TailwindCSS para estilos y se conecta a un backend Node.js/Express mediante una API REST.

## 🛠️ Tecnologías principales

- [Angular 20+](https://angular.dev/)
- [TailwindCSS 4+](https://tailwindcss.com/)
- [RxJS](https://rxjs.dev/)
- [PostCSS](https://postcss.org/)
- [JWT Decode](https://github.com/auth0/jwt-decode)

## ⚙️ Instalación y configuración

1. **Clona el repositorio:**

   ```bash
   git clone <url-del-repo>
   cd players-frontend
   ```

2. **Instala las dependencias:**

   ```bash
   npm install
   # o
   yarn install
   ```

3. **Configura TailwindCSS y PostCSS:**

   - TailwindCSS ya está integrado vía PostCSS. La configuración principal está en `src/styles.scss` y `.postcssrc.json`.
   - Si necesitas personalizar Tailwind, crea un archivo `tailwind.config.js` y ajústalo según tus necesidades.

4. **Inicia el servidor de desarrollo:**
   ```bash
   ng serve
   ```
   Accede a [http://localhost:4200](http://localhost:4200) en tu navegador.

## 🔑 Autenticación y conexión con backend

- El frontend se conecta a la API: `https://api-players-ekie.onrender.com/api`
- El sistema de autenticación utiliza JWT. El token se almacena en `localStorage` y se envía en las cabeceras de las peticiones protegidas.
- Hay roles de usuario y administrador. Solo los administradores pueden crear, editar o eliminar jugadores.

## 📦 Scripts útiles

- `ng serve` — Inicia el servidor de desarrollo
- `ng build` — Compila la aplicación para producción
- `ng test` — Ejecuta los tests unitarios

## 🧩 Estructura principal del proyecto

```
players-frontend/
├── src/
│   ├── app/
│   │   ├── auth/         # Autenticación y registro
│   │   ├── players/      # Gestión de jugadores
│   │   ├── shared/       # Componentes y guards reutilizables
│   │   └── core/         # Layout y header
│   ├── styles.scss       # Estilos globales y Tailwind
│   └── main.ts           # Bootstrap Angular
├── .postcssrc.json       # Configuración PostCSS + Tailwind
├── angular.json          # Configuración Angular
└── package.json          # Dependencias y scripts
```

## ✨ Funcionalidades principales

- Registro e inicio de sesión de usuarios
- Gestión de jugadores (listar, crear, editar, eliminar)
- Roles: usuario y administrador
- Interfaz moderna y responsiva con TailwindCSS
- Manejo de errores y validaciones

## 📝 Notas
