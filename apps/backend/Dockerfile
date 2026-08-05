FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build the app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Generate Prisma Client (nếu có schema)
RUN npx prisma generate || true
RUN npm run build
# Prune dev dependencies to reduce size (keeps Prisma generated client)
RUN npm prune --omit=dev

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json ./

USER node

EXPOSE 3000

CMD ["node", "dist/main.js"]
