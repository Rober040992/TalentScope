# -------------------------
# STAGE 1: deps
# -------------------------
FROM node:22-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/
COPY apps/ingestion/package.json apps/ingestion/
COPY packages/shared/package.json packages/shared/

RUN npm install --production=false

# -------------------------
# STAGE 2: build final image
# -------------------------
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copiamos node_modules ya instalados
COPY --from=deps /app/node_modules ./node_modules

# Copiamos TODO el código
COPY . .

# Evitar problemas con permisos
RUN chmod -R 755 /app

# CMD se sobrescribe en docker-compose
CMD ["node", "apps/api/src/index.js"]
