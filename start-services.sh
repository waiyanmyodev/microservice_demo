#!/bin/bash

# Start NestJS Microservices
echo "🚀 Starting NestJS Microservices..."

# Set environment variables
export NODE_ENV=development
export DATABASE_URL="postgresql://postgres:password@localhost:5432/microservices_db?schema=public"
export JWT_SECRET="super-secret-jwt-key-for-development"
export JWT_REFRESH_SECRET="super-secret-refresh-key-for-development" 
export JWT_EXPIRES_IN="15m"
export JWT_REFRESH_EXPIRES_IN="7d"

# Service configuration
export AUTH_SERVICE_PORT=3001
export AUTH_SERVICE_HOST=localhost
export USER_SERVICE_PORT=3002
export USER_SERVICE_HOST=localhost
export POST_SERVICE_PORT=3003
export POST_SERVICE_HOST=localhost
export API_GATEWAY_PORT=3000
export API_GATEWAY_HOST=localhost

echo "✅ Environment variables set"
echo ""

# Build all services
echo "📦 Building services..."
cd services/auth-service && npm run build && cd ../..
cd services/user-service && npm run build && cd ../.. 
cd services/post-service && npm run build && cd ../..
cd services/api-gateway && npm run build && cd ../..

echo "✅ All services built successfully!"
echo ""

# Start services in background (for demonstration)
echo "🔥 To start the services, run these commands in separate terminals:"
echo ""
echo "Terminal 1 - Auth Service:"
echo "cd services/auth-service && npm run start"
echo ""
echo "Terminal 2 - User Service:"  
echo "cd services/user-service && npm run start"
echo ""
echo "Terminal 3 - Post Service:"
echo "cd services/post-service && npm run start" 
echo ""
echo "Terminal 4 - API Gateway:"
echo "cd services/api-gateway && npm run start"
echo ""
echo "📚 Once all services are running:"
echo "- API Gateway: http://localhost:3000/api/v1"
echo "- Swagger Docs: http://localhost:3000/api/docs"
echo "- Health Check: http://localhost:3000/api/v1/health"
echo ""
echo "🎉 Ready to go!"