# 🚀 Quick Start Guide

## Current Status ✅

### ✅ **Infrastructure Services Running**
- PostgreSQL (Port 5432) - Database ✅ Healthy
- RabbitMQ (Port 5672, 15672) - Message broker ✅ Healthy  
- Redis (Port 6379) - Caching ✅ Healthy

### ✅ **Database Ready**
- Schema migrated ✅
- Sample data seeded ✅
- Admin user: `admin@example.com` / `password123`
- Test users: `user1@example.com` / `password123`

### ✅ **Services Built**
- Shared package compiled ✅
- Auth service built ✅
- User service ready ✅
- Post service ready ✅
- API Gateway ready ✅

## 🏃‍♂️ Start the Microservices

Run each command in a **separate terminal**:

### Terminal 1 - Auth Service (Port 3001)
```bash
export DATABASE_URL='postgresql://postgres:password@localhost:5432/microservices_db?schema=public'
export JWT_SECRET='super-secret-jwt-key-for-development'
export JWT_REFRESH_SECRET='super-secret-refresh-key-for-development'
cd services/auth-service && npm run start
```

### Terminal 2 - User Service (Port 3002)
```bash
export DATABASE_URL='postgresql://postgres:password@localhost:5432/microservices_db?schema=public'
cd services/user-service && npm run start
```

### Terminal 3 - Post Service (Port 3003)
```bash
export DATABASE_URL='postgresql://postgres:password@localhost:5432/microservices_db?schema=public'
cd services/post-service && npm run start
```

### Terminal 4 - API Gateway (Port 3000)
```bash
export JWT_SECRET='super-secret-jwt-key-for-development'
cd services/api-gateway && npm run start
```

## 🧪 Test the API

Once all services are running:

### 1. Check Health
```bash
curl http://localhost:3000/api/v1/health
```

### 2. Register New User
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

### 3. Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123" 
  }'
```

### 4. Create Post (use token from login)
```bash
curl -X POST http://localhost:3000/api/v1/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Hello World",
    "content": "My first microservices post!",
    "published": true
  }'
```

### 5. Get All Posts (Public)
```bash
curl http://localhost:3000/api/v1/posts
```

## 📚 Access Documentation

- **Swagger API Docs**: http://localhost:3000/api/docs
- **Health Dashboard**: http://localhost:3000/api/v1/health/services
- **RabbitMQ Management**: http://localhost:15672 (admin/password)

## 🛑 Stop Services

```bash
# Stop infrastructure
docker-compose down

# Stop microservices with Ctrl+C in each terminal
```

## 🎯 What You Have

✅ **Production-Ready Architecture**
- JWT Authentication with refresh tokens
- Microservices communication via TCP
- Database with proper relations
- API Gateway with unified endpoints
- Swagger documentation
- Health monitoring
- Error handling and validation

✅ **Security Features**
- Password hashing with bcrypt
- JWT tokens with expiration
- Request validation
- CORS protection
- Rate limiting

✅ **Developer Experience** 
- Hot reload in development
- Comprehensive logging
- Type safety with TypeScript
- Code quality tools (ESLint, Prettier)
- Database migrations and seeding

🎉 **Your microservices are ready to use!**