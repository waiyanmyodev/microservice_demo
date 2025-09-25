#!/bin/bash

echo "🚀 NestJS Microservices API Demo"
echo "================================="
echo ""

# API base URL
BASE_URL="http://localhost:3000/api/v1"

echo "📋 Prerequisites:"
echo "1. Infrastructure services running: ✅ (PostgreSQL, RabbitMQ, Redis)"
echo "2. Database migrated and seeded: ✅"
echo "3. All microservices built: ✅"
echo ""

echo "🏃‍♂️ To start the microservices, run these commands in separate terminals:"
echo ""
echo "Terminal 1 (Auth Service):"
echo "export DATABASE_URL='postgresql://postgres:password@localhost:5432/microservices_db?schema=public'"
echo "export JWT_SECRET='super-secret-jwt-key-for-development'" 
echo "export JWT_REFRESH_SECRET='super-secret-refresh-key-for-development'"
echo "cd services/auth-service && npm run start"
echo ""

echo "Terminal 2 (User Service):"
echo "export DATABASE_URL='postgresql://postgres:password@localhost:5432/microservices_db?schema=public'"
echo "cd services/user-service && npm run start"
echo ""

echo "Terminal 3 (Post Service):"
echo "export DATABASE_URL='postgresql://postgres:password@localhost:5432/microservices_db?schema=public'"
echo "cd services/post-service && npm run start"
echo ""

echo "Terminal 4 (API Gateway):"
echo "export JWT_SECRET='super-secret-jwt-key-for-development'"
echo "cd services/api-gateway && npm run start"
echo ""

echo "📚 Once all services are running, try these API calls:"
echo ""

echo "1. Check Health:"
echo "curl $BASE_URL/health"
echo ""

echo "2. Register a new user:"
cat << 'EOF'
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@example.com",
    "username": "demouser",
    "password": "password123",
    "firstName": "Demo",
    "lastName": "User"
  }'
EOF
echo ""

echo "3. Login:"
cat << 'EOF'
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@example.com", 
    "password": "password123"
  }'
EOF
echo ""

echo "4. Get all posts (public):"
echo "curl $BASE_URL/posts"
echo ""

echo "5. Create a post (requires JWT token from login):"
cat << 'EOF'
curl -X POST http://localhost:3000/api/v1/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "title": "My First Post",
    "content": "This is my first post using the microservices API!",
    "published": true,
    "tags": ["demo", "nestjs"]
  }'
EOF
echo ""

echo "🌟 Key Features Available:"
echo "• JWT Authentication with refresh tokens"
echo "• User registration and management" 
echo "• Post creation, editing, and publishing"
echo "• Automatic Swagger documentation at: http://localhost:3000/api/docs"
echo "• Health monitoring at: http://localhost:3000/api/v1/health/services"
echo ""

echo "🎯 Sample Users Available (from seeding):"
echo "• admin@example.com / password123 (Admin user)"
echo "• user1@example.com / password123 (Test user 1)"
echo "• user2@example.com / password123 (Test user 2)"
echo ""

echo "✨ The system is ready to run!"