# J4TechnologyIsNow — Plataforma de Transformación Digital

Landing page completa y production-ready para J4TechnologyIsNow, empresa dominicana de transformación digital.

## Stack tecnológico

**Frontend**: React 18 · Vite · TailwindCSS · Framer Motion · i18next (ES/EN/FR/PT)  
**Backend**: Node.js 20 · Express · PostgreSQL · Prisma ORM · Socket.io · Claude AI

## Estructura del proyecto

```
j4technologyisnow/
├── pnpm-workspace.yaml
├── package.json
├── frontend/          ← React 18 + Vite
└── backend/           ← Express + Prisma + Claude AI
```

## Requisitos previos

- Node.js >= 20.0.0
- pnpm >= 9.0.0
- PostgreSQL >= 14

## Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/JoseMartinezDEVWEB/mi_web.git
cd mi_web

# 2. Instalar todas las dependencias
pnpm install

# 3. Configurar variables de entorno del backend
cp backend/.env.example backend/.env
# Editar backend/.env con tus credenciales

# 4. Configurar la base de datos
cd backend
npx prisma generate --schema=src/prisma/schema.prisma
npx prisma db push --schema=src/prisma/schema.prisma

# 5. Poblar datos iniciales (servicios y admin)
node src/prisma/seed.js
```

## Variables de entorno (backend/.env)

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | URL de conexión a PostgreSQL |
| `ANTHROPIC_API_KEY` | Clave de API de Claude (Anthropic) |
| `TWILIO_ACCOUNT_SID` | SID de cuenta Twilio (WhatsApp) |
| `TWILIO_AUTH_TOKEN` | Token de autenticación Twilio |
| `TWILIO_WHATSAPP_FROM` | Número WhatsApp de Twilio |
| `OWNER_WHATSAPP` | Tu número WhatsApp (notificaciones) |
| `TELEGRAM_BOT_TOKEN` | Token del bot de Telegram |
| `OWNER_TELEGRAM_CHAT_ID` | Tu Chat ID de Telegram |
| `JWT_SECRET` | Clave secreta JWT (mínimo 32 chars) |
| `FRONTEND_URL` | URL del frontend (para CORS) |
| `PORT` | Puerto del servidor backend (default: 4000) |

> Si Twilio o Telegram no están configurados, los datos de las citas se muestran en la consola del servidor como fallback.

## Iniciar en desarrollo

```bash
# Iniciar frontend y backend en paralelo
pnpm dev

# O por separado:
pnpm --filter frontend dev   # Frontend en http://localhost:5173
pnpm --filter backend dev    # Backend en http://localhost:4000
```

## Build para producción

```bash
pnpm build    # Genera dist/ en el frontend
pnpm start    # Inicia el backend en producción
```

## Credenciales por defecto del admin

- **URL**: http://localhost:5173/admin
- **Email**: admin@j4technologyisnow.com
- **Contraseña**: admin123

> ⚠️ Cambia la contraseña en producción con `bcrypt.hash('nueva_contraseña', 12)`

## Funcionalidades principales

- 🌐 **Multiidioma**: ES 🇩🇴 · EN 🇺🇸 · FR 🇫🇷 · PT 🇧🇷
- 🤖 **Agente IA**: Chat con Claude AI que agenda citas automáticamente
- 🎮 **Demos interactivas**: 6 demos funcionales sin registro
- 📱 **Mobile-first**: Diseño 100% responsive
- 🔔 **Notificaciones**: WhatsApp + Telegram al agendar citas
- 🎨 **Animaciones**: Framer Motion en todos los componentes

## Rutas disponibles

| Ruta | Descripción |
|---|---|
| `/` | Landing page completa |
| `/servicios` | Catálogo de servicios con demos |
| `/blog` | Listado de artículos |
| `/blog/:id` | Artículo individual |
| `/admin` | Panel de administración (JWT) |
| `GET /api/health` | Verificación del servidor |
| `POST /api/chat/message` | Chat principal con Claude AI |
| `POST /api/chat/demo` | Chat del sandbox de demos |
| `GET /api/appointments` | Listar citas (admin) |
| `GET /api/services/catalog` | Catálogo de servicios |
| `POST /api/services/estimate` | Solicitar estimación |
| `POST /api/newsletter` | Suscribir al newsletter |
| `POST /api/auth/login` | Login del admin |

## Despliegue

**Frontend**: Vercel, Netlify, o cualquier CDN estático  
**Backend**: Railway, Render, o VPS con Node.js 20  
**Base de datos**: Supabase, Railway PostgreSQL, o Neon

---

Hecho con ❤️ en República Dominicana 🇩🇴 por J4TechnologyIsNow
