# Base image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY shared/package*.json ./shared/
COPY services/user-service/package*.json ./services/user-service/

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Build stage
FROM base AS builder
WORKDIR /app

# Copy source code
COPY . .

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Build the application
RUN npm run build:shared
RUN cd services/user-service && npx prisma generate
RUN cd services/user-service && npm run build

# Production stage
FROM base AS runner
WORKDIR /app

# Create app user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy built application
COPY --from=builder --chown=nestjs:nodejs /app/services/user-service/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/services/user-service/package*.json ./
COPY --from=deps --chown=nestjs:nodejs /app/node_modules ./node_modules

# Copy Prisma files
COPY --from=builder --chown=nestjs:nodejs /app/services/user-service/prisma ./prisma

USER nestjs

EXPOSE 3002

CMD ["node", "dist/main.js"]