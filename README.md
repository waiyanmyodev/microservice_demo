# NestJS Microservices Architecture

A production-ready microservices architecture built with NestJS, featuring authentication, user management, and post management services with a unified API Gateway.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌───────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway     │    │   Microservices │
│   (React/Vue)   ├────►   (Port 3000)     ├────►                 │
│                 │    │   - REST API      │    │                 │
└─────────────────┘    │   - Authentication│    │                 │
                       │   - Rate Limiting │    │                 │
                       │   - Documentation │    │                 │
                       └───────────────────┘    │                 │
                                               ├─────────────────┤
                                               │  Auth Service   │
                                               │   (Port 3001)   │
                                               │   - JWT Auth    │
                                               │   - Registration│
                                               ├─────────────────┤
                                               │  User Service   │
                                               │   (Port 3002)   │
                                               │   - User CRUD   │
                                               │   - Profiles    │
                                               ├─────────────────┤
                                               │  Post Service   │
                                               │   (Port 3003)   │
                                               │   - Post CRUD   │
                                               │   - Publishing  │
                                               └─────────────────┘
                                                       │
┌─────────────────┐    ┌───────────────────┐         │
│   PostgreSQL    │    │   RabbitMQ        │         │
│   (Port 5432)   ├────┤   (Port 5672)     ├─────────┘
│   - Database    │    │   - Message Queue │
└─────────────────┘    └───────────────────┘
```

## 🚀 Features

### Core Services
- **API Gateway**: Unified REST API with authentication, rate limiting, and Swagger documentation
- **Auth Service**: JWT-based authentication with refresh tokens, registration, and login
- **User Service**: Complete user management with CRUD operations and profiles
- **Post Service**: Blog post management with publishing, tags, and author relations

### Technical Features
- **🔐 Security**: JWT authentication, password hashing, CORS protection, helmet security headers
- **📚 Documentation**: Auto-generated Swagger/OpenAPI documentation
- **🐳 Containerization**: Docker containers for all services with docker-compose orchestration
- **🧪 Validation**: Request/response validation with class-validator and DTOs
- **📊 Logging**: Centralized logging with Winston across all services
- **🔄 Error Handling**: Global exception filters and standardized error responses
- **⚡ Performance**: Connection pooling, pagination, and efficient database queries
- **💾 Database**: PostgreSQL with Prisma ORM and automatic migrations
- **🏥 Health Checks**: Built-in health check endpoints for monitoring

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **Docker** and Docker Compose
- **Git** (optional, for version control)

## 🛠️ Quick Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository (if from git)
git clone <repository-url>
cd microservice_example

# Install dependencies for all services
npm install

# Build shared package
npm run build:shared

# Generate Prisma client
npm run db:generate
```

### 2. Environment Configuration

Create a `.env` file in the root directory (copy from `.env.example`):

```env
# Database Configuration
DATABASE_URL="postgresql://postgres:password@localhost:5432/microservices_db?schema=public"
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=microservices_db

# JWT Configuration - CHANGE THESE IN PRODUCTION
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-change-this-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# RabbitMQ Configuration
RABBITMQ_DEFAULT_USER=admin
RABBITMQ_DEFAULT_PASS=password

# Service Ports
API_GATEWAY_PORT=3000
AUTH_SERVICE_PORT=3001
USER_SERVICE_PORT=3002
POST_SERVICE_PORT=3003

# Environment
NODE_ENV=development
```

### 3. Start Services with Docker

```bash
# Start all services (production mode)
npm start

# Or start in development mode with hot reload
npm run start:dev

# Stop all services
npm run stop

# Stop services and remove volumes
npm run stop:volumes
```

### 4. Database Setup

After starting the services:

```bash
# Run database migrations
npm run db:migrate

# Seed the database with sample data
npm run db:seed

# (Optional) Open Prisma Studio to view data
npm run db:studio
```

## 📖 API Documentation

Once the services are running, access the Swagger documentation at:

**http://localhost:3000/api/docs**

## 🔗 Service Endpoints

### API Gateway (Port 3000)
- **Base URL**: http://localhost:3000/api/v1
- **Documentation**: http://localhost:3000/api/docs
- **Health Check**: http://localhost:3000/api/v1/health

### Authentication Endpoints
```http
POST /api/v1/auth/register    # User registration
POST /api/v1/auth/login       # User login
POST /api/v1/auth/refresh     # Refresh access token
POST /api/v1/auth/logout      # User logout
GET  /api/v1/auth/profile     # Get current user profile
```

### User Endpoints
```http
GET    /api/v1/users          # Get all users (paginated)
GET    /api/v1/users/me       # Get current user profile
GET    /api/v1/users/:id      # Get user by ID
PATCH  /api/v1/users/me       # Update current user profile
PATCH  /api/v1/users/:id      # Update user by ID
DELETE /api/v1/users/:id      # Delete user
```

### Post Endpoints
```http
GET    /api/v1/posts          # Get all posts (paginated, public)
GET    /api/v1/posts/my-posts # Get current user's posts
GET    /api/v1/posts/:id      # Get post by ID (public)
POST   /api/v1/posts          # Create new post (authenticated)
PATCH  /api/v1/posts/:id      # Update post (authenticated)
DELETE /api/v1/posts/:id      # Delete post (authenticated)
PATCH  /api/v1/posts/:id/publish   # Publish post
PATCH  /api/v1/posts/:id/unpublish # Unpublish post
```

## 🧪 Testing the API

### 1. Register a New User
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Create a Post (using JWT token from login)
```bash
curl -X POST http://localhost:3000/api/v1/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "My First Post",
    "content": "This is the content of my first post using the microservices API.",
    "published": true,
    "tags": ["tutorial", "nestjs"]
  }'
```

## 🏗️ Development

### Running Individual Services Locally

```bash
# Start database and message broker
docker-compose up postgres rabbitmq redis -d

# Run services individually in development mode
cd services/auth-service && npm run start:dev
cd services/user-service && npm run start:dev
cd services/post-service && npm run start:dev
cd services/api-gateway && npm run start:dev
```

### Code Quality

```bash
# Lint all services
npm run lint

# Fix lint issues
npm run lint:fix

# Format code
npm run format
```

### Database Operations

```bash
# Create a new migration
cd services/user-service && npx prisma migrate dev --name your-migration-name

# Reset database (⚠️ This will delete all data)
cd services/user-service && npx prisma migrate reset

# View database in browser
npm run db:studio
```

## 📁 Project Structure

```
microservice_example/
├── services/
│   ├── api-gateway/          # REST API Gateway
│   ├── auth-service/         # Authentication service
│   ├── user-service/         # User management service
│   └── post-service/         # Post management service
├── shared/                   # Shared DTOs, interfaces, utilities
├── scripts/                  # Database and deployment scripts
├── docker-compose.yml        # Production containers
├── docker-compose.dev.yml    # Development containers
├── .env.example             # Environment variables template
└── README.md               # This file
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `DATABASE_URL` | PostgreSQL connection string | See .env.example |
| `JWT_SECRET` | JWT signing secret | **Change in production** |
| `JWT_REFRESH_SECRET` | Refresh token secret | **Change in production** |
| `POSTGRES_USER` | Database username | `postgres` |
| `POSTGRES_PASSWORD` | Database password | `password` |
| `POSTGRES_DB` | Database name | `microservices_db` |
| `API_GATEWAY_PORT` | Gateway service port | `3000` |

## 🐳 Docker Services

| Service | Container Name | Port | Purpose |
|---------|---------------|------|---------|
| API Gateway | `microservices-gateway` | 3000 | REST API endpoints |
| Auth Service | `microservices-auth` | 3001 | Authentication |
| User Service | `microservices-user` | 3002 | User management |
| Post Service | `microservices-post` | 3003 | Post management |
| PostgreSQL | `microservices-postgres` | 5432 | Database |
| RabbitMQ | `microservices-rabbitmq` | 5672, 15672 | Message broker |
| Redis | `microservices-redis` | 6379 | Caching |

## 🔐 Security Features

- **JWT Authentication** with access and refresh tokens
- **Password Hashing** using bcrypt with salt rounds
- **Rate Limiting** to prevent API abuse
- **CORS Protection** with configurable origins
- **Helmet Security Headers** for additional protection
- **Input Validation** with class-validator
- **SQL Injection Prevention** through Prisma ORM

## 📊 Monitoring and Observability

- **Health Check Endpoints** for all services
- **Request/Response Logging** with timestamps
- **Error Tracking** with detailed stack traces
- **Service Status Monitoring** via health endpoints

## 🚀 Production Deployment

### Prerequisites
- Docker and Docker Compose
- Domain name and SSL certificates
- Environment variables configured

### Steps
1. Update environment variables for production
2. Build and push Docker images to registry
3. Deploy using docker-compose:

```bash
# Production deployment
docker-compose -f docker-compose.yml up -d

# Monitor logs
docker-compose logs -f

# Scale services
docker-compose up -d --scale auth-service=2 --scale user-service=2
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the conventional commit format
4. Run tests and linting
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## ❓ Troubleshooting

### Common Issues

**Database Connection Issues**
```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# View database logs
docker-compose logs postgres
```

**Service Not Starting**
```bash
# Check service logs
docker-compose logs [service-name]

# Restart specific service
docker-compose restart [service-name]
```

**Port Already in Use**
```bash
# Check what's using the port
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### Useful Commands

```bash
# View all containers
docker-compose ps

# View logs for all services
docker-compose logs

# Rebuild a specific service
docker-compose build [service-name]

# Execute commands in a container
docker-compose exec [service-name] sh
```

## 📞 Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the API documentation at http://localhost:3000/api/docs
3. Check service health at http://localhost:3000/api/v1/health/services

---

**🎉 Congratulations!** Your NestJS microservices architecture is now ready for development and production use.