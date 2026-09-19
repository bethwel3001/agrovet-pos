FROM node:20-alpine AS base
RUN npm install -g pnpm

# Install canvas native dependencies
RUN apk add --no-cache \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    librsvg-dev \
    python3 \
    make \
    g++

WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY packages/db/package.json ./packages/db/package.json
COPY apps/api/package.json ./apps/api/package.json
RUN pnpm install --frozen-lockfile

# Build
FROM deps AS builder
COPY . .
RUN pnpm --filter @agrovet/db db:generate
RUN pnpm --filter @agrovet/api build

# Production image
FROM node:20-alpine AS runner
RUN apk add --no-cache cairo jpeg pango giflib librsvg
WORKDIR /app
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/db/src/generated ./packages/db/src/generated

EXPOSE 3000
CMD ["node", "dist/index.js"]
