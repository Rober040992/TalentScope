# TalentScope – Distributed Job Tracking Platform (Monorepo)

---

### 🧩 Visión de Arquitectura

TalentScope está construido como un **monorepo modular distribuido**, basado en **Microservicios + Shared Package**.  
Los servicios están completamente desacoplados y se comunican únicamente a través de una base de datos común. No existe coupling entre API y pipeline de ingesta.
```
            +-----------------------+
            |   Arbeitnow API       |
            +-----------+-----------+
                        |
                        v
            +-----------------------+
            | Ingestion Microservice |
            |  • fetch + normalize   |
            |  • bulkWrite upsert    |
            |  • dedupe vía índices  |
            +-----------+------------+
                        |
                        v
                MongoDB (Shared)
                        ^
                        |
            +-----------+------------+
            |     GraphQL API        |
            |  • paginación nativa   |
            |  • modelo shared       |
            |  • clean resolvers     |
            +------------------------+
```

### 🧠 Principios aplicados

- **SOLID en todas las capas**
- **Separation of Concerns** estricta  
  - API solo lee  
  - Ingestion solo escribe  
  - Shared solo abstrae infraestructura
- **Idempotencia del pipeline**  
  - Garantizada mediante `bulkWrite` + índices únicos
- **Determinismo en la ingesta**
  - Ninguna operación depende del orden
- **Escalabilidad horizontal**
  - Ingestion puede desplegarse como worker aislado
  - API puede replicarse con cualquier load balancer
- **Observabilidad integrada**
  - Log format uniforme (Winston)
  - Salida dual: consola + archivo

### 🔧 Detalles relevantes para Code Review avanzado

- El ingest worker implementa:
  - Fase de fetch con validación estricta de payload  
  - Fase de mapping controlada  
  - Fase de upsert multi–campo con separación clara entre datos de creación y actualización  
  - Manejo de duplicados sin ruido operativo (códigos 11000)

- El API implementa:
  - Normalización de parámetros (`page`, `limit`)
  - Paginación real (prev/next)
  - Búsqueda ordenada por `created_at`
  - Funciones puras en resolvers

- El Shared Package contiene únicamente:
  - Conexión a MongoDB  
  - Modelo Job con índices  
  - Logger uniforme y listo para distribuirse entre servicios

### 🧬 Preparado para escalar

- Trabajo orientado a contenedores (estructura compatible con Docker)
- Monorepo listo para CI/CD (pipelines por workspace)
- División clara entre runtime del worker y runtime de la API
- Fácil transición a colas (BullMQ / RabbitMQ), Kafka o cron jobs distribuidos

---

## 📖 TalentScope – Job Tracker (Monorepo)

TalentScope es una plataforma backend diseñada para importar, normalizar y exponer ofertas de empleo mediante una arquitectura modular basada en microservicios.  
Construido como un **monorepo profesional**, el proyecto demuestra dominio en **GraphQL**, **Node.js moderno**, **MongoDB**, **data ingestion pipelines**, **logging avanzado** y **principios SOLID** aplicados a un entorno real.

El ecosistema está formado por tres unidades:

- **API GraphQL**: exposición de datos con paginación nativa.
- **Ingestion Microservice**: proceso autónomo encargado de obtener datos desde la API pública de Arbeitnow y almacenarlos en MongoDB.
- **Shared Package**: capa común para modelos, conexión a BD y sistema de logs unificado.

Este enfoque permite escalabilidad, separación de responsabilidades y preparación para desplegar en entornos distribuidos.

---

## 🧠 Tech Stack

- **Node.js 22.x (ESM)**
- **GraphQL (Apollo Server 3)**
- **MongoDB + Mongoose**
- **Node Fetch**
- **Winston Logger**
- **Monorepo con NPM Workspaces**
- **Variables de entorno por microservicio**

---

## 🧩 Arquitectura del Monorepo
```
TALENTSCOPE/
│
├── apps/
│   ├── api/           # Servidor GraphQL
│   └── ingestion/     # Ingestión de ofertas
│
└── packages/
    └── shared/        # Código común: DB, Logger, Modelos
```

---

## ⭐ Características Principales

- Pipeline de ingesta desacoplado  
- API GraphQL con paginación real  
- Logging profesional  
- Monorepo escalable con arquitectura limpia  
- Deduplicación automática mediante índices únicos  
- Upsert masivo con `bulkWrite`  
- Control de errores robusto
- cron automático semanal con node-cron

---

## 🛠 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone <repo>
cd talentscope
npm install
```

### 🔐 Variables de Entorno

El proyecto utiliza tres archivos `.env`:

#### 1. `.env` en la raíz
```ini
MONGO_URI="mongodb://localhost:27017/talentscope"
API_URL="https://arbeitnow.com/api/job-board-api"
PORT=4000
```

#### 2. `.env` en `/apps/api`
```ini
MONGO_URI="mongodb://localhost:27017/talentscope"
PORT=4000
```

#### 3. `.env` en `/apps/ingestion`
```ini
MONGO_URI="mongodb://localhost:27017/talentscope"
API_URL="https://arbeitnow.com/api/job-board-api"
```

---

## 🚀 Scripts del Monorepo
```json
"api:start": "npm --workspace apps/api start",
"api:dev": "npm --workspace apps/api run dev",
"ingestion:start": "npm --workspace apps/ingestion start"
```

## ▶️ Ejecución en local sin Docker

#### Iniciar la API
```bash
npm run api:start
```

#### Modo desarrollo
```bash
npm run api:dev
```

#### Ejecutar ingesta
```bash
npm run ingestion:start
```

---

## 📘 Query GraphQL
```graphql
query {
  jobs(page: 1, limit: 10) {
    total
    results {
      title
      company_name
      location
      url
      tags
      created_at
    }
    page
    limit
    hasPrevPage
    hasNextPage
  }
}
```

## 🐳 Docker Support (Dev y Prod)

TalentScope incluye un entorno Docker completo para ejecutar API, Ingestion y MongoDB sin necesidad de instalar Node ni Mongo en tu máquina.
Los archivos relevantes son:
* `Dockerfile` (construye imagen de API o Ingestion)
* `docker-compose.dev.yml` → entorno local de desarrollo
* `docker-compose.prod.yml` → entorno de producción
* `.dockerignore`

📌 Variables de entorno para Docker
Debes crear un archivo `.env` DENTRO de la raíz del proyecto:
```
MONGO_URI=mongodb://mongodb:27017/talentscope
API_URL=https://arbeitnow.com/api/job-board-api
PORT=4565
```

El host de Mongo cambia de `localhost` a `mongodb` porque Docker crea una red interna.
🛠️ Scripts Docker del Monorepo
Desde el root package.json ya tienes disponibles:
▶️ Desarrollo con Docker
Iniciar todo el entorno:
```
npm run docker:dev
```
Detenerlo:
```
npm run docker:dev:down
```
Reiniciar TODO:
```
npm run docker:restart:all
```
Reiniciar solo API:
```
npm run docker:api:restart
```
Reiniciar solo Ingestion:
```
npm run docker:ingestion:restart
```
▶️ Producción con Docker
Build + ejecutar en modo detach:
```
npm run docker:prod
```
Detener producción:
```
npm run docker:prod:down
```
🚀 Cómo usar TalentScope con Docker
1. Clonar repositorio
```
git clone <repo>
cd talentscope
```
2. Crear `.env` en la raíz
Con esta configuración:
```
MONGO_URI=mongodb://mongodb:27017/talentscope
API_URL=https://arbeitnow.com/api/job-board-api
PORT=4565
```
3. Ejecutar en modo desarrollo
```
npm run docker:dev
```
Esto levantará:
* `api` (GraphQL)
* `ingestion` (microservicio)
* `mongodb` (base de datos)
* red interna entre servicios
4. Acceder a la API
```
http://localhost:4565
```
5. Forzar una ingesta manual dentro de Docker
```
docker compose -f docker-compose.dev.yml exec ingestion node src/index.js
```
(esto usa el mismo script `ingestion:start` que fuera de Docker)

---

## 🎯 Objetivo del Proyecto

TalentScope demuestra:

- Arquitectura modular y desacoplada
- Microservicios con responsabilidades aisladas
- Ingesta robusta y tolerante a fallos
- Paginación real
- Logging estructurado
- Diseño preparado para cloud y escalado horizontal

---

## 📄 License

MIT License © 2025 Roberto Gómez Fábrega