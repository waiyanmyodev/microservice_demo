# 🏗️ Microservices Architecture Guide

## Database Per Service Pattern

### ❌ **Single Database Issues:**
- **Tight Coupling**: Services share schema, changes affect all
- **Single Point of Failure**: One database failure breaks everything
- **Scaling Bottleneck**: Cannot scale databases independently
- **Team Dependencies**: Schema changes require coordination across teams
- **Technology Lock-in**: All services must use same database technology

### ✅ **Database Per Service Benefits:**
- **Independence**: Each service owns its data and schema
- **Technology Freedom**: Services can use different databases (PostgreSQL, MongoDB, etc.)
- **Scalability**: Scale databases based on service needs
- **Fault Isolation**: Database failure only affects one service
- **Team Autonomy**: Teams can evolve schemas independently

---

## 🗄️ Database Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        API Gateway (Port 3000)                  │
│                    Unified REST Endpoints                       │
└─────────────────────┬───────────────────┬──────────────────────┘
                      │                   │                      
              ┌───────▼────────┐ ┌────────▼────────┐ ┌──────▼──────┐
              │  Auth Service  │ │  User Service   │ │ Post Service│
              │   Port 3001    │ │   Port 3002     │ │  Port 3003  │
              └───────┬────────┘ └────────┬────────┘ └──────┬──────┘
                      │                   │                 │      
              ┌───────▼────────┐ ┌────────▼────────┐ ┌──────▼──────┐
              │   Auth DB      │ │    User DB      │ │   Post DB   │
              │  Port 5433     │ │   Port 5434     │ │  Port 5435  │
              │                │ │                 │ │             │
              │ • users        │ │ • users         │ │ • posts     │
              │ • refresh_     │ │ • user_events   │ │ • post_     │
              │   tokens       │ │                 │ │   events    │
              │                │ │                 │ │ • post_views│
              └────────────────┘ └─────────────────┘ └─────────────┘
                                          │
              ┌─────────────────────────────────────────────────────┐
              │          RabbitMQ Message Broker                    │
              │              Event Communication                    │
              └─────────────────────────────────────────────────────┘
```

---

## 📋 Service Database Responsibilities

### 🔐 **Auth Service Database (Port 5433)**
```sql
-- Tables:
• users           -- Authentication data only
• refresh_tokens  -- JWT refresh tokens

-- Responsibilities:
• User login/registration
• Password hashing & verification
• JWT token management
• Authentication state
```

### 👤 **User Service Database (Port 5434)**
```sql
-- Tables:
• users        -- Complete user profiles
• user_events  -- Audit trail

-- Responsibilities:
• User profile management (name, bio, avatar)
• User CRUD operations
• Profile updates & settings
• User activity tracking
```

### 📝 **Post Service Database (Port 5435)**
```sql
-- Tables:
• posts       -- Blog posts (stores authorId reference)
• post_events -- Post lifecycle events
• post_views  -- Analytics data

-- Responsibilities:
• Post creation, editing, publishing
• Post analytics & metrics
• Content management
• Author relationship (via authorId)
```

---

## 🔄 Data Consistency Patterns

### **Event-Driven Communication**
Services communicate via domain events through RabbitMQ:

```typescript
// When user registers in Auth Service
AuthService -> PublishEvent(UserRegisteredEvent) -> RabbitMQ

// User Service listens and creates profile
RabbitMQ -> UserService -> CreateUserProfile(event.userData)

// When user updates profile in User Service  
UserService -> PublishEvent(UserUpdatedEvent) -> RabbitMQ

// Auth Service updates display name cache
RabbitMQ -> AuthService -> UpdateUserCache(event.userData)
```

### **Eventual Consistency**
- Services maintain their own data
- Updates propagate via events
- Short-term inconsistency is acceptable
- System converges to consistent state

---

## 🚀 Migration Steps

### 1. **Start Separate Databases**
```bash
# Use the separate database compose file
docker-compose -f docker-compose.databases.yml up -d

# This creates:
# - auth-db (Port 5433)
# - user-db (Port 5434)  
# - post-db (Port 5435)
```

### 2. **Update Service Configurations**
```bash
# Copy the new environment file
cp .env.databases .env

# Each service connects to its own database:
# AUTH_DATABASE_URL=postgresql://auth_user:auth_password@localhost:5433/auth_db
# USER_DATABASE_URL=postgresql://user_user:user_password@localhost:5434/user_db
# POST_DATABASE_URL=postgresql://post_user:post_password@localhost:5435/post_db
```

### 3. **Run Migrations Per Service**
```bash
# Auth service migration
cd services/auth-service
AUTH_DATABASE_URL="postgresql://auth_user:auth_password@localhost:5433/auth_db" npx prisma migrate dev

# User service migration
cd services/user-service  
USER_DATABASE_URL="postgresql://user_user:user_password@localhost:5434/user_db" npx prisma migrate dev

# Post service migration
cd services/post-service
POST_DATABASE_URL="postgresql://post_user:post_password@localhost:5435/post_db" npx prisma migrate dev
```

### 4. **Update Data Access Layer**
```typescript
// Each service imports its own Prisma client
// Auth Service
import { PrismaClient } from '@prisma/auth-client';

// User Service  
import { PrismaClient } from '@prisma/user-client';

// Post Service
import { PrismaClient } from '@prisma/post-client';
```

---

## 🎯 **Benefits of This Architecture:**

✅ **Service Independence**: Each service can evolve independently
✅ **Fault Tolerance**: Database failure only affects one service  
✅ **Technology Freedom**: Mix PostgreSQL, MongoDB, Redis per service needs
✅ **Team Autonomy**: Teams own their service and data completely
✅ **Scalability**: Scale databases based on actual usage patterns
✅ **Security**: Isolated data access, principle of least privilege

---

## 📊 **Trade-offs:**

### **Pros:**
- True microservices isolation
- Independent scaling & technology choices
- Better fault tolerance
- Team autonomy

### **Cons:**
- More complex data management
- Eventual consistency challenges  
- More infrastructure to manage
- Cross-service queries require events/APIs

---

## 🔧 **Implementation Status:**

✅ **Current**: Single database (easier to start)
🚀 **Available**: Separate databases (production-ready)

Choose based on your needs:
- **Single DB**: Simpler for development, prototypes
- **Separate DBs**: Better for production, team scaling

Both patterns are implemented and ready to use! 🎉