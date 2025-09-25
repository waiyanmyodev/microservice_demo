# 🚀 NestJS Microservices Setup Guide

## 📋 Complete Step-by-Step Setup Plan with Git Commits

This guide provides a complete setup plan for a production-ready NestJS microservices architecture with proper Git workflow.

---

## 🗂️ Final Project Structure

```
nestjs-microservices/
├── .github/
│   └── workflows/
│       └── ci.yml
├── shared/
│   ├── src/
│   │   ├── dto/
│   │   ├── interfaces/
│   │   ├── enums/
│   │   ├── constants/
│   │   ├── utils/
│   │   ├── decorators/
│   │   ├── exceptions/
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── services/
│   ├── api-gateway/
│   │   ├── src/
│   │   │   ├── auth/
│   │   │   ├── user/
│   │   │   ├── post/
│   │   │   ├── common/
│   │   │   ├── config/
│   │   │   ├── guards/
│   │   │   ├── interceptors/
│   │   │   ├── filters/
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── Dockerfile
│   │   ├── Dockerfile.dev
│   │   └── package.json
│   ├── auth-service/
│   │   ├── src/
│   │   │   ├── auth/
│   │   │   ├── config/
│   │   │   ├── guards/
│   │   │   ├── strategies/
│   │   │   └── main.ts
│   │   ├── prisma/
│   │   ├── Dockerfile
│   │   └── package.json
│   ├── user-service/
│   │   ├── src/
│   │   │   ├── user/
│   │   │   ├── config/
│   │   │   ├── repository/
│   │   │   └── main.ts
│   │   ├── prisma/
│   │   ├── Dockerfile
│   │   └── package.json
│   └── post-service/
│       ├── src/
│       │   ├── post/
│       │   ├── config/
│       │   ├── repository/
│       │   └── main.ts
│       ├── prisma/
│       ├── Dockerfile
│       └── package.json
├── scripts/
│   ├── setup.sh
│   ├── start-dev.sh
│   └── build-all.sh
├── docker-compose.yml
├── docker-compose.dev.yml
├── docker-compose.prod.yml
├── .env.example
├── .gitignore
├── .eslintrc.js
├── .prettierrc
├── .commitlintrc.json
├── package.json
├── lerna.json
├── tsconfig.json
└── README.md
```

---

## 📝 Step-by-Step Setup Plan

### **Phase 1: Project Initialization**

#### **Step 1: Initialize Git Repository**
```bash
mkdir nestjs-microservices
cd nestjs-microservices
git init
```

**Commit Message:** `feat: initialize git repository for microservices project`

---

#### **Step 2: Add .gitignore**
```bash
# Create comprehensive .gitignore
touch .gitignore
```

**.gitignore Contents:**
```gitignore
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnp/
.pnp.js

# Build outputs
dist/
build/
*.tsbuildinfo
.next/
out/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output/

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache/
.parcel-cache/

# Docker
.docker/
docker-compose.override.yml

# Prisma
prisma/migrations/

# Temporary folders
tmp/
temp/

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```

**Commit Message:** `chore: add comprehensive .gitignore for node.js microservices`

---

#### **Step 3: Create Project Structure**
```bash
# Create directory structure
mkdir -p shared/src/{dto,interfaces,enums,constants,utils,decorators,exceptions}
mkdir -p services/{api-gateway,auth-service,user-service,post-service}
mkdir -p services/api-gateway/src/{auth,user,post,common,config,guards,interceptors,filters}
mkdir -p services/auth-service/src/{auth,config,guards,strategies}
mkdir -p services/user-service/src/{user,config,repository}
mkdir -p services/post-service/src/{post,config,repository}
mkdir -p scripts
mkdir -p .github/workflows

# Create prisma directories
mkdir -p services/auth-service/prisma
mkdir -p services/user-service/prisma
mkdir -p services/post-service/prisma
```

**Commit Message:** `feat: create initial project directory structure for microservices`

---

#### **Step 4: Initialize Package.json and Workspace**
```bash
# Root package.json
npm init -y
```

**Root package.json:**
```json
{
  "name": "nestjs-microservices",
  "version": "1.0.0",
  "description": "Production-ready NestJS microservices architecture",
  "private": true,
  "workspaces": [
    "shared",
    "services/*"
  ],
  "scripts": {
    "build": "lerna run build",
    "build:shared": "cd shared && npm run build",
    "start": "docker-compose up",
    "start:dev": "docker-compose -f docker-compose.yml -f docker-compose.dev.yml up",
    "start:prod": "docker-compose -f docker-compose.yml -f docker-compose.prod.yml up",
    "stop": "docker-compose down",
    "stop:volumes": "docker-compose down -v",
    "test": "lerna run test",
    "test:watch": "lerna run test:watch",
    "test:e2e": "lerna run test:e2e",
    "lint": "lerna run lint",
    "lint:fix": "lerna run lint:fix",
    "format": "prettier --write \"**/*.{ts,js,json,md}\"",
    "prepare": "husky install",
    "db:migrate": "lerna run db:migrate",
    "db:generate": "lerna run db:generate",
    "db:seed": "lerna run db:seed",
    "setup": "npm ci && npm run build:shared && npm run db:generate"
  },
  "devDependencies": {
    "@commitlint/cli": "^18.4.3",
    "@commitlint/config-conventional": "^18.4.3",
    "@typescript-eslint/eslint-plugin": "^6.13.1",
    "@typescript-eslint/parser": "^6.13.1",
    "eslint": "^8.54.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-prettier": "^5.0.1",
    "husky": "^8.0.3",
    "lerna": "^8.0.0",
    "lint-staged": "^15.1.0",
    "prettier": "^3.1.0",
    "typescript": "^5.3.2"
  },
  "lint-staged": {
    "*.{ts,js}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  }
}
```

**Create lerna.json:**
```json
{
  "version": "1.0.0",
  "npmClient": "npm",
  "command": {
    "publish": {
      "conventionalCommits": true
    },
    "version": {
      "allowBranch": ["main", "master"],
      "conventionalCommits": true
    }
  },
  "packages": [
    "shared",
    "services/*"
  ]
}
```

**Commit Message:** `feat: setup monorepo workspace with lerna and npm workspaces`

---

### **Phase 2: Code Quality Setup**

#### **Step 5: Setup TypeScript Configuration**
**Root tsconfig.json:**
```json
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "paths": {
      "@shared/*": ["shared/src/*"]
    },
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false,
    "esModuleInterop": true,
    "resolveJsonModule": true
  },
  "include": [
    "shared/**/*",
    "services/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.spec.ts",
    "**/*.e2e-spec.ts"
  ]
}
```

**Commit Message:** `feat: add typescript configuration with path mapping for monorepo`

---

#### **Step 6: Setup ESLint and Prettier**
**.eslintrc.js:**
```javascript
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    '@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', 'dist/', 'node_modules/'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/prefer-const': 'error',
    '@typescript-eslint/no-var-requires': 'off',
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
  },
};
```

**.prettierrc:**
```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "semi": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

**Commit Message:** `feat: configure eslint and prettier for consistent code style`

---

#### **Step 7: Setup Commit Lint and Husky**
**.commitlintrc.json:**
```json
{
  "extends": ["@commitlint/config-conventional"],
  "rules": {
    "type-enum": [
      2,
      "always",
      [
        "build",
        "chore",
        "ci",
        "docs",
        "feat",
        "fix",
        "perf",
        "refactor",
        "revert",
        "style",
        "test"
      ]
    ],
    "subject-case": [2, "never", ["sentence-case", "start-case", "pascal-case", "upper-case"]],
    "subject-empty": [2, "never"],
    "subject-full-stop": [2, "never", "."],
    "header-max-length": [2, "always", 100]
  }
}
```

```bash
# Setup Husky
npx husky install
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit $1'
npx husky add .husky/pre-commit 'npx lint-staged'
```

**Commit Message:** `feat: setup commitlint with conventional commits and husky hooks`

---

### **Phase 3: Environment and Docker Setup**

#### **Step 8: Create Environment Files**
**.env.example:**
```env
# Database Configuration
AUTH_DATABASE_URL="postgresql://auth_user:auth_password@localhost:5433/auth_db?schema=public"
USER_DATABASE_URL="postgresql://user_user:user_password@localhost:5434/user_db?schema=public"
POST_DATABASE_URL="postgresql://post_user:post_password@localhost:5435/post_db?schema=public"

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-change-this-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# RabbitMQ Configuration
RABBITMQ_URL=amqp://admin:password@localhost:5672
RABBITMQ_DEFAULT_USER=admin
RABBITMQ_DEFAULT_PASS=password

# Service Ports
API_GATEWAY_PORT=3000
AUTH_SERVICE_PORT=3001
USER_SERVICE_PORT=3002
POST_SERVICE_PORT=3003

# Environment
NODE_ENV=development

# Logging
LOG_LEVEL=info
LOG_FORMAT=json
```

**Commit Message:** `feat: add environment configuration template with service-specific variables`

---

#### **Step 9: Create Docker Compose Configuration**
**docker-compose.yml:**
```yaml
services:
  # Auth Service Database
  auth-db:
    image: postgres:15-alpine
    container_name: auth-database
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${AUTH_DB_USER:-auth_user}
      POSTGRES_PASSWORD: ${AUTH_DB_PASSWORD:-auth_password}
      POSTGRES_DB: ${AUTH_DB_NAME:-auth_db}
    volumes:
      - auth_db_data:/var/lib/postgresql/data
    ports:
      - "5433:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${AUTH_DB_USER:-auth_user}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - microservices-network

  # User Service Database
  user-db:
    image: postgres:15-alpine
    container_name: user-database
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${USER_DB_USER:-user_user}
      POSTGRES_PASSWORD: ${USER_DB_PASSWORD:-user_password}
      POSTGRES_DB: ${USER_DB_NAME:-user_db}
    volumes:
      - user_db_data:/var/lib/postgresql/data
    ports:
      - "5434:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${USER_DB_USER:-user_user}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - microservices-network

  # Post Service Database
  post-db:
    image: postgres:15-alpine
    container_name: post-database
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POST_DB_USER:-post_user}
      POSTGRES_PASSWORD: ${POST_DB_PASSWORD:-post_password}
      POSTGRES_DB: ${POST_DB_NAME:-post_db}
    volumes:
      - post_db_data:/var/lib/postgresql/data
    ports:
      - "5435:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POST_DB_USER:-post_user}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - microservices-network

  # Message Broker
  rabbitmq:
    image: rabbitmq:3-management-alpine
    container_name: microservices-rabbitmq
    restart: unless-stopped
    environment:
      RABBITMQ_DEFAULT_USER: ${RABBITMQ_DEFAULT_USER:-admin}
      RABBITMQ_DEFAULT_PASS: ${RABBITMQ_DEFAULT_PASS:-password}
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
    ports:
      - "5672:5672"
      - "15672:15672"
    healthcheck:
      test: ["CMD", "rabbitmq-diagnostics", "ping"]
      interval: 30s
      timeout: 10s
      retries: 5
    networks:
      - microservices-network

  # Redis for caching
  redis:
    image: redis:7-alpine
    container_name: microservices-redis
    restart: unless-stopped
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - microservices-network

  # Auth Service
  auth-service:
    build:
      context: .
      dockerfile: services/auth-service/Dockerfile
    container_name: auth-service
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - AUTH_DATABASE_URL=postgresql://${AUTH_DB_USER:-auth_user}:${AUTH_DB_PASSWORD:-auth_password}@auth-db:5432/${AUTH_DB_NAME:-auth_db}
      - JWT_SECRET=${JWT_SECRET}
      - JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
    ports:
      - "${AUTH_SERVICE_PORT:-3001}:3001"
    depends_on:
      auth-db:
        condition: service_healthy
    networks:
      - microservices-network

  # User Service
  user-service:
    build:
      context: .
      dockerfile: services/user-service/Dockerfile
    container_name: user-service
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - USER_DATABASE_URL=postgresql://${USER_DB_USER:-user_user}:${USER_DB_PASSWORD:-user_password}@user-db:5432/${USER_DB_NAME:-user_db}
    ports:
      - "${USER_SERVICE_PORT:-3002}:3002"
    depends_on:
      user-db:
        condition: service_healthy
    networks:
      - microservices-network

  # Post Service
  post-service:
    build:
      context: .
      dockerfile: services/post-service/Dockerfile
    container_name: post-service
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - POST_DATABASE_URL=postgresql://${POST_DB_USER:-post_user}:${POST_DB_PASSWORD:-post_password}@post-db:5432/${POST_DB_NAME:-post_db}
    ports:
      - "${POST_SERVICE_PORT:-3003}:3003"
    depends_on:
      post-db:
        condition: service_healthy
    networks:
      - microservices-network

  # API Gateway
  api-gateway:
    build:
      context: .
      dockerfile: services/api-gateway/Dockerfile
    container_name: api-gateway
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - JWT_SECRET=${JWT_SECRET}
      - AUTH_SERVICE_HOST=auth-service
      - USER_SERVICE_HOST=user-service
      - POST_SERVICE_HOST=post-service
    ports:
      - "${API_GATEWAY_PORT:-3000}:3000"
    depends_on:
      - auth-service
      - user-service
      - post-service
    networks:
      - microservices-network

volumes:
  auth_db_data:
    driver: local
  user_db_data:
    driver: local
  post_db_data:
    driver: local
  rabbitmq_data:
    driver: local
  redis_data:
    driver: local

networks:
  microservices-network:
    driver: bridge
```

**docker-compose.dev.yml:**
```yaml
services:
  auth-service:
    build:
      target: development
    volumes:
      - ./services/auth-service/src:/app/src
      - ./shared/src:/app/shared/src
      - /app/node_modules
    command: npm run start:dev
    environment:
      - NODE_ENV=development

  user-service:
    build:
      target: development
    volumes:
      - ./services/user-service/src:/app/src
      - ./shared/src:/app/shared/src
      - /app/node_modules
    command: npm run start:dev
    environment:
      - NODE_ENV=development

  post-service:
    build:
      target: development
    volumes:
      - ./services/post-service/src:/app/src
      - ./shared/src:/app/shared/src
      - /app/node_modules
    command: npm run start:dev
    environment:
      - NODE_ENV=development

  api-gateway:
    build:
      target: development
    volumes:
      - ./services/api-gateway/src:/app/src
      - ./shared/src:/app/shared/src
      - /app/node_modules
    command: npm run start:dev
    environment:
      - NODE_ENV=development
```

**Commit Message:** `feat: add docker-compose configuration with separate databases per service`

---

#### **Step 10: Create Dockerfiles**

**Base Dockerfile Template (services/*/Dockerfile):**
```dockerfile
# Multi-stage build for production optimization
FROM node:18-alpine AS base
WORKDIR /app

# Dependencies stage
FROM base AS deps
COPY package*.json ./
COPY shared/package*.json ./shared/
COPY services/SERVICE_NAME/package*.json ./services/SERVICE_NAME/
RUN npm ci --only=production && npm cache clean --force

# Development stage  
FROM base AS development
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE PORT
CMD ["npm", "run", "start:dev"]

# Build stage
FROM base AS builder
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build:shared
RUN cd services/SERVICE_NAME && npm run build

# Production stage
FROM base AS production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
COPY --from=builder --chown=nestjs:nodejs /app/services/SERVICE_NAME/dist ./dist
COPY --from=deps --chown=nestjs:nodejs /app/node_modules ./node_modules
USER nestjs
EXPOSE PORT
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
  CMD node -e "require('http').request('http://localhost:PORT/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).end()"
CMD ["node", "dist/main.js"]
```

**Commit Message:** `feat: add multi-stage dockerfiles with development and production targets`

---

### **Phase 4: Shared Module Development**

#### **Step 11: Create Shared Package**
**shared/package.json:**
```json
{
  "name": "@shared/common",
  "version": "1.0.0",
  "description": "Shared DTOs, interfaces, and utilities for microservices",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "build:watch": "tsc --watch",
    "clean": "rimraf dist",
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix",
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "dependencies": {
    "@nestjs/common": "^10.2.10",
    "@nestjs/microservices": "^10.2.10",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.0",
    "reflect-metadata": "^0.1.13"
  }
}
```

**Commit Message:** `feat: create shared package structure with common dependencies`

---

#### **Step 12: Add Shared DTOs and Interfaces**
Create comprehensive shared modules:
- DTOs for validation
- Interfaces for type safety
- Constants and enums
- Utility functions
- Custom decorators
- Exception classes

**Commit Message:** `feat: implement shared dtos, interfaces, and utilities for microservices`

---

### **Phase 5: Logging Setup**

#### **Step 13: Create Centralized Logging Module**
**shared/src/logging/logger.service.ts:**
```typescript
import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class CustomLogger implements LoggerService {
  private logger: winston.Logger;

  constructor(context?: string) {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
        winston.format.printf(({ timestamp, level, message, context, stack }) => {
          return JSON.stringify({
            timestamp,
            level,
            context,
            message,
            ...(stack && { stack }),
          });
        }),
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
        }),
        new winston.transports.File({
          filename: 'logs/combined.log',
        }),
      ],
    });
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, stack?: string, context?: string) {
    this.logger.error(message, { context, stack });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }
}
```

**Commit Message:** `feat: implement centralized logging service with winston`

---

### **Phase 6: Service Implementation**

#### **Step 14: Implement Auth Service**
- JWT authentication strategies
- User registration and login
- Refresh token mechanism
- Guards and decorators

**Commit Messages:**
- `feat(auth): implement jwt authentication with passport strategies`
- `feat(auth): add user registration and login endpoints`
- `feat(auth): implement refresh token mechanism`
- `feat(auth): add jwt guards and auth decorators`

---

#### **Step 15: Implement User Service**
- User CRUD operations
- Repository pattern implementation
- DTOs and validation
- Database integration

**Commit Messages:**
- `feat(user): implement user repository with crud operations`
- `feat(user): add user service with business logic`
- `feat(user): create user controller with rest endpoints`
- `feat(user): add user dtos and validation rules`

---

#### **Step 16: Implement Post Service**
- Post CRUD operations
- User relationship handling
- Publishing workflow
- Content management

**Commit Messages:**
- `feat(post): implement post repository with user relations`
- `feat(post): add post service with crud and publishing logic`
- `feat(post): create post controller with content management`
- `feat(post): implement post tagging and categorization`

---

#### **Step 17: Implement API Gateway**
- Route aggregation
- Service communication
- Authentication middleware
- Request/response transformation

**Commit Messages:**
- `feat(gateway): implement api gateway with service routing`
- `feat(gateway): add microservice client communication`
- `feat(gateway): integrate authentication middleware`
- `feat(gateway): add request validation and transformation`

---

### **Phase 7: Advanced Features**

#### **Step 18: Add Global Configuration**
- Exception filters
- Interceptors
- Validation pipes
- CORS configuration

**Commit Message:** `feat: add global exception filters, interceptors, and validation`

---

#### **Step 19: Implement Health Checks**
- Service health endpoints
- Database connectivity checks
- External service monitoring

**Commit Message:** `feat: implement health check endpoints for all services`

---

#### **Step 20: Add Swagger Documentation**
- API documentation
- Schema definitions
- Authentication setup

**Commit Message:** `feat: add swagger documentation with authentication schemas`

---

#### **Step 21: Setup Microservice Transport**
- TCP/RabbitMQ communication
- Message patterns
- Event-driven architecture

**Commit Message:** `feat: implement microservice communication with rabbitmq transport`

---

### **Phase 8: Testing and CI/CD**

#### **Step 22: Add Unit Tests**
- Service tests
- Controller tests
- Repository tests

**Commit Message:** `test: add comprehensive unit tests for all services`

---

#### **Step 23: Add Integration Tests**
- End-to-end API tests
- Database integration tests
- Service communication tests

**Commit Message:** `test: implement integration tests for microservice communication`

---

#### **Step 24: Setup CI/CD Pipeline**
**.github/workflows/ci.yml:**
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_PASSWORD: password
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build

  docker:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      - run: docker-compose build
      - run: docker-compose up -d
      - run: docker-compose run --rm api-gateway npm run test:e2e
```

**Commit Message:** `ci: add github actions workflow for testing and deployment`

---

#### **Step 25: Add Setup Scripts**
**scripts/setup.sh:**
```bash
#!/bin/bash
echo "🚀 Setting up NestJS Microservices..."

# Install dependencies
npm install

# Build shared package
npm run build:shared

# Generate Prisma clients
npm run db:generate

# Setup environment
cp .env.example .env

echo "✅ Setup complete! Run 'npm run start:dev' to start development environment."
```

**Commit Message:** `chore: add setup and utility scripts for development workflow`

---

### **Phase 9: Documentation and Deployment**

#### **Step 26: Create Comprehensive Documentation**
- README.md with setup instructions
- API documentation
- Architecture diagrams
- Deployment guide

**Commit Message:** `docs: add comprehensive documentation and setup guides`

---

#### **Step 27: Production Configuration**
- Production environment files
- Security configurations
- Monitoring setup
- Backup strategies

**Commit Message:** `feat: add production configuration and security hardening`

---

#### **Step 28: Performance Optimization**
- Database optimization
- Caching strategies
- Load balancing configuration
- Resource monitoring

**Commit Message:** `perf: implement caching, database optimization, and monitoring`

---

## 🎯 Git Workflow Summary

### **Branch Strategy:**
```bash
main/master          # Production releases
develop             # Integration branch
feature/auth-jwt    # Feature branches
feature/user-crud   # Feature branches
hotfix/security-fix # Critical fixes
```

### **Commit Convention Examples:**
```bash
feat: add new feature
fix: resolve bug in authentication
docs: update api documentation
style: format code with prettier
refactor: restructure user service
test: add unit tests for auth service
chore: update dependencies
ci: configure github actions
perf: optimize database queries
build: update docker configuration
```

### **Release Process:**
```bash
# 1. Feature development
git checkout -b feature/user-authentication
git commit -m "feat(auth): implement jwt authentication"

# 2. Integration
git checkout develop
git merge feature/user-authentication

# 3. Release preparation
git checkout -b release/v1.0.0
git commit -m "chore: bump version to 1.0.0"

# 4. Production deployment
git checkout main
git merge release/v1.0.0
git tag v1.0.0
```

---

## 🚀 Quick Start Commands

```bash
# Clone and setup
git clone <repository>
cd nestjs-microservices
chmod +x scripts/setup.sh
./scripts/setup.sh

# Development
npm run start:dev

# Production
npm run start:prod

# Testing
npm run test
npm run test:e2e

# Database operations
npm run db:migrate
npm run db:seed
```

---

This comprehensive setup plan provides a complete roadmap for building a production-ready NestJS microservices architecture with proper Git workflow, commit conventions, and best practices. Each step builds upon the previous one, ensuring a solid foundation for scalable microservices development.