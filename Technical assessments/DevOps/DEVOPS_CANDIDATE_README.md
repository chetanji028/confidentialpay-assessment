# DevOps Engineer - Getting Started

## Welcome! 👋

You're taking the ConFiPay DevOps engineer assessment. This is a **1-1.5 hour hands-on task** where you'll containerize the full-stack application and deploy it with Docker & Docker Compose.

**Key Requirement:** You must actually run and test the deployment. Don't just submit config files!

---

## What You'll Do

**Containerize ConFiPay** and make it run with:
1. Backend Docker container (Node.js on port 4000)
2. Frontend Docker container (React on port 3000)
3. Docker Compose orchestration
4. Environment configuration management
5. Fully functional deployment that you've tested

---

## Prerequisites

### Install Docker

#### Mac
```bash
# Install Docker Desktop
brew install docker
# or download from https://www.docker.com/products/docker-desktop

# Start Docker
open /Applications/Docker.app
```

#### Windows
```powershell
# Download Docker Desktop from https://www.docker.com/products/docker-desktop
# Install and restart

# Verify installation
docker --version
docker-compose --version
```

#### Linux
```bash
sudo apt-get update
sudo apt-get install docker.io docker-compose

# Start Docker
sudo systemctl start docker
```

### Verify Installation
```bash
docker --version              # Should be 20.10+
docker-compose --version      # Should be 1.29+
docker run hello-world        # Should print "Hello from Docker"
```

---

## Step 1: Read the Task

Open **DEVOPS_ENGINEER_TEST.md**

Key sections:
- **Time Box:** 1-1.5 hours total
- **Part 1-5:** Dockerize backend, frontend, set up compose, configure env, test
- **Acceptance Criteria:** What working deployment looks like
- **Testing Checklist:** Required verification steps

---

## Step 2: Use the Reference Guide

**DEVOPS_REFERENCE_GUIDE.md** contains:
- Docker essentials (images, containers, commands)
- Dockerfile structure and best practices
- Docker Compose YAML patterns
- Environment variable management
- Common troubleshooting
- Networking and volumes

**Bookmark it!** You'll reference this while building configs.

---

## Step 3: Plan Your Work

### Time Breakdown
```
0-5 min:   Review task and plan approach
5-35 min:  Create backend/Dockerfile
35-55 min: Create Dockerfile (frontend) + docker-compose.yml
55-75 min: Configure .env and test everything
75-90 min: Document and verify all works
```

### Checklist
- [ ] backend/Dockerfile created and builds
- [ ] Dockerfile (frontend) created and builds
- [ ] docker-compose.yml created
- [ ] .env or .env.docker created
- [ ] .dockerignore created
- [ ] docker-compose up works
- [ ] Backend API responds
- [ ] Frontend loads
- [ ] Login works
- [ ] DEPLOYMENT_GUIDE.md written

---

## Step 4: Create Backend Dockerfile

Create `backend/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 4000

CMD ["node", "--watch", "./backend/server.js"]
```

**Test it:**
```bash
cd backend
docker build -t confipay-backend .
# Should see: "Successfully tagged confipay-backend:latest"
```

---

## Step 5: Create Frontend Dockerfile

Create `Dockerfile` (at project root):

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

**Test it:**
```bash
docker build -t confipay-frontend .
# Should see: "Successfully tagged confipay-frontend:latest"
```

---

## Step 6: Create Docker Compose

Create `docker-compose.yml` (at project root):

```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: backend/Dockerfile
    container_name: confipay-backend
    ports:
      - "4000:4000"
    environment:
      NODE_ENV: development
      PORT: 4000
      JWT_SECRET: docker-test-secret
      CORS_ORIGIN: "http://localhost:3000,http://frontend:3000"
    volumes:
      - .:/app
      - /app/node_modules
    networks:
      - confipay-network

  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: confipay-frontend
    ports:
      - "3000:3000"
    environment:
      VITE_API_URL: http://backend:4000
    depends_on:
      - backend
    volumes:
      - .:/app
      - /app/node_modules
    networks:
      - confipay-network

networks:
  confipay-network:
    driver: bridge
```

---

## Step 7: Create .dockerignore

Create `.dockerignore` (at project root):

```
node_modules
npm-debug.log
.git
.gitignore
.env
.DS_Store
dist
build
.vscode
.idea
```

---

## Step 8: Create .env.docker

Create `.env.docker` (at project root):

```
NODE_ENV=development
PORT=4000
JWT_SECRET=docker-dev-secret-12345
CORS_ORIGIN=http://localhost:3000,http://frontend:3000
VITE_API_URL=http://backend:4000
```

---

## Step 9: Test Everything Works

### Start Containers
```bash
docker-compose up
```

**Wait 5-10 seconds for services to start.** You should see:
```
confipay-backend  | Server is running on port 4000
confipay-frontend | VITE v... ready in ... ms
```

### Test Backend (in another terminal)

```bash
# Health check
curl http://localhost:4000
# Expected: Some response (not connection refused)

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@confidentialpay.com","password":"00000"}'
# Expected: JSON with "token" field
```

### Test Frontend

```
1. Open http://localhost:3000 in browser
2. Should see login page (not blank white)
3. No major console errors (check browser DevTools)
4. Click login with credentials: admin@confidentialpay.com / 00000
5. Should redirect to dashboard
6. Dashboard should show transaction data
```

### Check Logs

```bash
docker-compose logs backend    # Backend logs
docker-compose logs frontend   # Frontend logs

# If something's wrong, logs will show why
```

### Stop Everything

```bash
docker-compose down
# Cleans up containers and networks
```

---

## Step 10: Document Your Deployment

Create `DEPLOYMENT_GUIDE.md`:

```markdown
# ConFiPay Deployment Guide

## Prerequisites
- Docker 20.10+
- Docker Compose 1.29+

## Build

### Backend Image
\`\`\`bash
docker build -t confipay-backend -f backend/Dockerfile .
\`\`\`

### Frontend Image
\`\`\`bash
docker build -t confipay-frontend .
\`\`\`

## Deploy

### Start Services
\`\`\`bash
docker-compose up
\`\`\`

Services will be available:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

### Stop Services
\`\`\`bash
docker-compose down
\`\`\`

## Testing

### Login
```
Email: admin@confidentialpay.com
Password: 00000
```

### Test Backend
\`\`\`bash
curl http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@confidentialpay.com","password":"00000"}'
\`\`\`

### Test Frontend
1. Open http://localhost:3000
2. Login with above credentials
3. Verify dashboard loads with data

## Troubleshooting

### Port 3000 in use
\`\`\`bash
lsof -i :3000  # Find process
kill -9 <pid>  # Kill it
\`\`\`

### Frontend shows blank page
- Check browser console for errors
- Verify backend is running: curl http://localhost:4000
- Check VITE_API_URL environment variable

### Backend won't start
- Check logs: docker-compose logs backend
- Verify port 4000 is free
- Check environment variables in docker-compose.yml

## Architecture

- **Backend:** Node.js Express server in container on port 4000
- **Frontend:** React Vite app in container on port 3000
- **Network:** Both containers on confipay-network bridge
- **Volumes:** Bind mounts for development (hot-reload)

## Future Improvements

- Add production docker-compose (remove volumes, no watch mode)
- Add health checks for liveness monitoring
- Multi-stage build for smaller frontend image
- Add Nginx reverse proxy
```

---

## Verification Checklist Before Submitting

- [ ] Both Dockerfiles created and build successfully
- [ ] docker-compose.yml created and syntax valid
- [ ] .dockerignore created
- [ ] .env.docker created
- [ ] `docker-compose up` starts without errors
- [ ] Backend responds: `curl http://localhost:4000`
- [ ] Frontend loads: http://localhost:3000 (not blank)
- [ ] Login works with admin@confidentialpay.com / 00000
- [ ] Dashboard displays transaction data
- [ ] `docker-compose down` cleans up properly
- [ ] DEPLOYMENT_GUIDE.md written and clear

---

## Deliverables

Package your submission:
```
submission/
├── backend/
│   └── Dockerfile           ← Backend container config
├── Dockerfile               ← Frontend container config
├── docker-compose.yml       ← Orchestration config
├── .dockerignore           ← Files to exclude from images
├── .env.docker             ← Environment variables
└── DEPLOYMENT_GUIDE.md     ← How to deploy and test
```

---

## Quick Reference

### Start
```bash
docker-compose up
```

### View logs
```bash
docker-compose logs -f
```

### Stop
```bash
docker-compose down
```

### Test backend
```bash
curl http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@confidentialpay.com","password":"00000"}'
```

### Test frontend
```
http://localhost:3000
Login with: admin@confidentialpay.com / 00000
```

---

## Tips for Success

### ⏱️ Time Management
- Don't overthink it - basic Dockerfiles are fine
- Focus on getting it running, not perfecting it
- Test early and often

### 🎯 Common Mistakes to Avoid

❌ Using `latest` tag (use specific versions like `node:18-alpine`)
```dockerfile
FROM node:latest  # Bad
FROM node:18-alpine  # Good
```

❌ API URL hardcoded (should be from environment)
```javascript
const API = "http://localhost:4000"  // Bad - won't work in container
const API = process.env.VITE_API_URL  // Good
```

❌ Services can't communicate (wrong hostname)
```yaml
VITE_API_URL: http://localhost:4000  # Wrong - localhost doesn't exist in container
VITE_API_URL: http://backend:4000  # Correct - use service name
```

❌ No .dockerignore (bloats images)
```
# Without .dockerignore: 500MB image
# With .dockerignore: 150MB image
```

❌ Forgetting to test
```bash
# Don't just submit - actually run it!
docker-compose up
# Wait 10 seconds, then test in browser
# http://localhost:3000
```

### ✅ Green Flags

- Dockerfiles build on first try
- Containers start immediately
- Frontend loads in browser
- Login works without errors
- Clear, concise DEPLOYMENT_GUIDE.md
- Thoughtful use of volumes for development

---

## Stuck?

1. **Check the Reference Guide** (DEVOPS_REFERENCE_GUIDE.md)
2. **Read the Task** (DEVOPS_ENGINEER_TEST.md) - detailed requirements there
3. **Check Docker logs:**
   ```bash
   docker-compose logs backend
   docker-compose logs frontend
   ```
4. **Try debugging in container:**
   ```bash
   docker-compose exec backend curl http://localhost:4000
   docker-compose exec frontend curl http://backend:4000
   ```

---

**Good luck! You've got this! 🚀**

The goal is a working deployment that someone else could run with just `docker-compose up`.

