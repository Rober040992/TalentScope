# TalentScope - Job Tracker

TalentScope is a lightweight backend project designed to track and store job listings from the **Arbeitnow API** into a **MongoDB** database.  
Built with a **modular architecture** and following **SOLID principles**, this project aims to showcase clean code practices and solid backend design for recruitment-oriented portfolio projects.


> [!IMPORTANT]
## WIP 
- project still in progress


## 🧠 Tech Stack

- **Node.js 22.x**
- **GraphQL**
- **MongoDB**
- **Fetch API**
- **Environment variables** (.env)
- **Winston logger**
- **Jest** para testing

## ⚙️ Features

- Fetches job offers from the [Arbeitnow API](https://arbeitnow.com/api/job-board-api)
- Stores and updates listings in MongoDB
- Clean separation of concerns (service, repository, schema)
- Ready for integration with a frontend dashboard

## 📋 Requisitos

- Node.js 22.x
- MongoDB en local o remoto

## 🔧 Instalación

```bash
git clone <repo>
cd talentscope
npm install
# si usarás el modo dev:
npm i -D nodemon
```

## 🔐 Variables de entorno

Crea un archivo `.env` en la raíz:

```bash
API_URL="https://arbeitnow.com/api/job-board-api"
MONGODB_URI="mongodb://yourlocalhostHere/talentscope"
```

## 🚀 Scripts

```json
"scripts": {
  "start": "node src/index.js",
  "dev": "node --watch src/index.js",
  "ingest:once": "node src/ingestion/index.js"
}
```

## 💻 Uso

**Producción local:**
```bash
npm run start
```

**Desarrollo con recarga:**
```bash
npm run dev
```

**Actualizar ofertas desde la API y persistir en MongoDB:**
```bash
npm run update:jobs
```

## 📁 Estructura

```
src/
  config/         # carga .env y conexión a MongoDB
  graphql/        # esquema y resolvers
  repositories/   # acceso a datos
  services/       # ArbeitnowService y lógica de negocio
  scripts/        # updateJobs.js
  index.js        # bootstrap del servidor GraphQL
```

## 📄 License

MIT License © 2025 Roberto