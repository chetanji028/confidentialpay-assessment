# ConFiPay - DevOps Engineer Assessment

## Overview

This is a **1-1.5 hour take-home task** for a DevOps-focused engineer. You will containerize the ConFiPay application, set up local deployment automation, and verify the entire stack runs correctly in containers.

**The task requires:**
- Writing Docker configurations (Dockerfile + docker-compose.yml)
- Setting up environment management
- Running the full stack locally in containers
- Documenting deployment steps
- **Actually running and testing the deployed app** (not just submitting configs)

---

## Time Box

**Aim to complete this task in 1-1.5 hours total.**

Time breakdown:
- Docker setup for frontend & backend: 25-30 min
- Docker Compose orchestration: 10-15 min
- Environment configuration: 10-15 min
- Testing/verification in containers: 15-20 min
- Documentation: 10-15 min

---

## Context

ConFiPay currently runs locally with:
- **Frontend:** React app on port 3000 (Vite dev server)
- **Backend:** Node.js server on port 4000 (Express.js)
- **Mock Data:** No database (in-memory only)

Your task is to containerize this stack and create a reproducible deployment configuration that works on any machine.

---

## The Task

### Part 1: Containerize the Backend (20 min)

Create `backend/Dockerfile`:

**Requirements:**
- Use Node.js 18+ as base image
- Install dependencies from `package.json`
- Set working directory to `/app`
- Expose port 4000
- Start with `node --watch ./backend/server.js` (or `npm run dev:backend`)
- Use `.dockerignore` to exclude unnecessary files

**Acceptance Criteria:**
- ✅ Dockerfile builds without errors
- ✅ Container starts successfully
- ✅ Backend responds on http://localhost:4000 when running
- ✅ API endpoints respond with data (not 500 errors)

---

### Part 2: Containerize the Frontend (20 min)

Create `Dockerfile` (at project root):

**Requirements:**
- Use Node.js 18+ for build stage
- Build the frontend: `npm run build`
- Use a lightweight image (nginx:alpine) for production OR serve with node
- Expose port 3000
- Serve built app or dev server
- Use `.dockerignore` to exclude unnecessary files

**Acceptance Criteria:**
- ✅ Dockerfile builds without errors
- ✅ Container starts successfully
- ✅ Frontend is accessible at http://localhost:3000
- ✅ Page loads without 404 errors (not just a blank page)

---

### Part 3: Orchestrate with Docker Compose (15 min)

Create `docker-compose.yml`:

**Requirements:**
- Define two services: `frontend` and `backend`
- Frontend service:
  - Builds from `Dockerfile`
  - Ports: 3000:3000
  - Environment variable: `VITE_API_URL=http://backend:4000`
- Backend service:
  - Builds from `backend/Dockerfile`
  - Ports: 4000:4000
  - Environment variables for JWT_SECRET, NODE_ENV, etc.
- Both services depend on each other (frontend depends on backend starting)
- Use a single network so services can communicate by hostname

**Acceptance Criteria:**
- ✅ `docker-compose up` starts both services without errors
- ✅ Frontend can reach backend (API calls work)
- ✅ Backend remains running (doesn't crash)
- ✅ Both services accessible from localhost on their respective ports

---

### Part 4: Environment Management (10 min)

Create or update `.env.docker`:

**Requirements:**
- Define variables needed for Docker environment:
  ```
  NODE_ENV=development
  PORT=4000
  CORS_ORIGIN=http://localhost:3000,http://frontend:3000
  JWT_SECRET=docker-test-secret-12345
  ```
- Backend Dockerfile or docker-compose should use these
- Frontend should have VITE_API_URL pointing to backend

**Acceptance Criteria:**
- ✅ Environment variables are properly set
- ✅ Services use `.env` file (not hardcoded)
- ✅ JWT authentication still works

---

### Part 5: Testing & Verification (20 min)

**You MUST run the containers and verify everything works:**

1. **Start containers:**
   ```bash
   docker-compose up
   ```

2. **Test backend API** (in another terminal):
   ```bash
   # Health check
   curl http://localhost:4000
   
   # Login
   curl -X POST http://localhost:4000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@confidentialpay.com","password":"00000"}'
   ```

3. **Test frontend:**
   - Open http://localhost:3000 in browser
   - Verify page loads (not blank)
   - Attempt login (with credentials above)
   - Verify API responses show actual data

4. **Verify logs:**
   ```bash
   docker-compose logs backend
   docker-compose logs frontend
   ```
   - Should see startup logs
   - Should see request logs when accessing the app

5. **Test cleanup:**
   ```bash
   docker-compose down
   ```

---

## Deliverables

1. **backend/Dockerfile**
   - Builds Node.js backend
   - Exposes port 4000
   - Works with `docker build -t confipay-backend .`

2. **Dockerfile** (at project root)
   - Builds React frontend
   - Exposes port 3000
   - Works with `docker build -t confipay-frontend .`

3. **docker-compose.yml**
   - Orchestrates both services
   - Services communicate by hostname
   - Works with `docker-compose up`

4. **.dockerignore** (optional but recommended)
   - Excludes node_modules, .git, etc.

5. **.env.docker** or `.env.example`
   - Documents all environment variables
   - Can be used for local docker setup

6. **DEPLOYMENT_GUIDE.md**
   - Step-by-step deployment instructions
   - How to build containers
   - How to run with docker-compose
   - Troubleshooting common issues
   - How to test from inside containers
   - Port mappings and service URLs

---

## Acceptance Criteria

### Docker Configurations
- ✅ Both Dockerfiles build without errors
- ✅ Both containers start successfully
- ✅ Containers use appropriate base images (Node, Alpine, etc.)
- ✅ Port mappings are correct
- ✅ Working directory and COPY/ADD commands are logical

### Docker Compose Orchestration
- ✅ `docker-compose up` starts all services
- ✅ Services are on same network (can reach each other)
- ✅ Port mappings allow localhost access
- ✅ Environment variables passed correctly
- ✅ Graceful shutdown with `docker-compose down`

### Functional Requirements
- ✅ Backend API responds with data (not errors)
- ✅ Frontend loads and is accessible
- ✅ Frontend can call backend API successfully
- ✅ Login works (uses real credentials from mock data)
- ✅ No CORS errors
- ✅ Logs show requests/responses

### Code Quality
- ✅ Dockerfile follows best practices (layering, caching)
- ✅ No unnecessary files in images
- ✅ Environment-specific configs separate from code
- ✅ Comments explaining key steps

### Documentation
- ✅ Clear deployment steps
- ✅ How to test functionality
- ✅ Common issues and solutions
- ✅ How to scale (future improvements)

---

## Key Concepts

### Docker Networking
```yaml
services:
  backend:
    container_name: confipay-backend
  frontend:
    container_name: confipay-frontend
    depends_on:
      - backend
    environment:
      VITE_API_URL: http://backend:4000  # Uses service name, not localhost!
```

### Multi-stage Build (Optional for Frontend)
```dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
```

### Environment Variables
```dockerfile
# Backend - can be override at runtime
ENV PORT=4000
ENV NODE_ENV=development

# Run with override
docker run -e NODE_ENV=production ...
```

---

## Testing Checklist

Before submitting, verify:

### Docker Build
- [ ] `docker build -t confipay-backend -f backend/Dockerfile .` succeeds
- [ ] `docker build -t confipay-frontend .` succeeds
- [ ] Images are a reasonable size (not huge)

### Containers Run
- [ ] `docker run -p 4000:4000 confipay-backend` starts without crashing
- [ ] `docker run -p 3000:3000 confipay-frontend` starts without crashing
- [ ] Services stay running (don't immediately exit)

### Docker Compose
- [ ] `docker-compose up` starts all services
- [ ] Services communicate (no "connection refused")
- [ ] Wait 5-10 seconds for startup, then test
- [ ] `curl http://localhost:4000` returns data
- [ ] `curl http://localhost:3000` returns HTML (not 404)

### Functionality Tests
- [ ] Backend login endpoint works:
  ```bash
  curl -X POST http://localhost:4000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@confidentialpay.com","password":"00000"}'
  ```
  - Response should include `token` field

- [ ] Backend stats endpoint works (with token):
  ```bash
  curl http://localhost:4000/api/dashboard/stats \
    -H "Authorization: Bearer YOUR_TOKEN_HERE"
  ```
  - Should return transaction data, not 401/500 error

- [ ] Frontend loads:
  - Open http://localhost:3000 in browser
  - Page should load (not blank white page)
  - Console should have no major errors
  - Can see login form

### Cleanup
- [ ] `docker-compose down` stops all services
- [ ] No orphaned containers remain
- [ ] No port conflicts after cleanup

---

## Common Issues & Solutions

### ❌ "Port already in use"
```bash
# Find what's using port 3000
lsof -i :3000  # Mac/Linux
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess  # Windows

# Kill it or use different port in docker-compose
```

### ❌ "Cannot connect to backend from frontend"
```yaml
# WRONG - localhost doesn't work inside containers
VITE_API_URL: http://localhost:4000

# CORRECT - use service name
VITE_API_URL: http://backend:4000
```

### ❌ "Container exits immediately"
```bash
docker-compose logs frontend  # Check why it's exiting
# Usually: missing dependencies, build failed, or wrong command
```

### ❌ "CORS errors in frontend"
```
# Backend CORS_ORIGIN must include frontend hostname
CORS_ORIGIN=http://localhost:3000,http://frontend:3000
```

### ❌ "npm install takes forever"
```dockerfile
# Cache npm layers
COPY package*.json ./
RUN npm ci  # Use ci instead of install
COPY . .    # Copy code after dependencies
```

---

## Evaluation Criteria

| Criterion | Score | Notes |
|-----------|-------|-------|
| **Docker Setup** | /5 | Do Dockerfiles build? Good practices? |
| **Orchestration** | /5 | Does docker-compose work? Services communicate? |
| **Functionality** | /5 | Can you actually use the app in containers? |
| **Documentation** | /5 | Clear deployment steps? Troubleshooting included? |
| **Testing** | /5 | Did you verify everything works? Evidence provided? |

**Passing Score:** 3+ on all criteria (minimum 15/25)

---

## Important Notes

⚠️ **You must test your setup!** Don't just submit files and hope they work.
- Run `docker-compose up` yourself
- Verify the frontend loads
- Verify the backend API responds
- Include evidence (screenshots or curl output) in your DEPLOYMENT_GUIDE.md

✅ **This is a realistic DevOps task.** In real jobs, deployment configs must actually work.

---

## Resources

- **Docker Docs:** https://docs.docker.com/
- **Docker Compose:** https://docs.docker.com/compose/
- **Dockerfile Best Practices:** https://docs.docker.com/develop/develop-images/dockerfile_best-practices/
- **Node.js Docker:** https://hub.docker.com/_/node
- **Nginx Docker:** https://hub.docker.com/_/nginx

Good luck! 🚀
