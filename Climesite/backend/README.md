# Backend (TypeORM + Express)

Instrucciones rápidas:

- Copia `.env.example` a `.env` y ajusta valores si es necesario.
- Instala dependencias: `npm install` (en la carpeta `backend`).
- Levanta la base de datos: desde la carpeta `src` ejecuta `docker compose up -d`.
- Inicia backend en modo desarrollo: `npm run dev`.
- Alternativa: levantar todo (db + adminer + backend) con Docker Compose desde `src`:
  - Crea `backend/.env` (basado en `.env.example`) y pegá tus secrets (no lo subas al repo).
  - Ejecuta desde `src`:

```powershell
docker compose up -d --build
```

Esto construirá la imagen del backend y levantará los contenedores (backend en el puerto 3001).

Endpoints principales:

- POST /api/register { nombre, ciudad, estado, correo, clave }
- POST /api/login { correo, clave } -> devuelve { token }

- GET /api/weather?place=Ciudad -> proxy a la API de clima (configurar WEATHER_API_KEY en `.env`)

Notas:

- TypeORM está en `synchronize: true` para desarrollo. En producción usa migrations.
