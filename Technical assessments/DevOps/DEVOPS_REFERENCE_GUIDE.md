# DevOps Engineer - Reference Guide

## Docker Essentials

### Images vs Containers
- **Image:** Blueprint (like a class)
- **Container:** Running instance (like an object)
- Build image → Run container

### Basic Commands

```bash
# Images
docker images                          # List local images
docker build -t myapp:1.0 .           # Build image from Dockerfile
docker rmi myapp:1.0                   # Remove image
docker pull node:18-alpine            # Download image from registry

# Containers
docker run -p 3000:3000 myapp         # Run container
docker ps                              # List running containers
docker ps -a                           # List all containers (running + stopped)
docker logs <container-id>            # View container logs
docker stop <container-id>            # Stop container gracefully
docker kill <container-id>            # Force stop container
docker rm <container-id>              # Remove stopped container

# Interactive
docker exec -it <container-id> bash   # Enter running container
docker attach <container-id>          # Attach to container output
```

---

## Dockerfile Structure

### Basic Template
```dockerfile
# 1. Base image
FROM node:18-alpine

# 2. Working directory
WORKDIR /app

# 3. Copy files
COPY package*.json ./
COPY . .

# 4. Install dependencies
RUN npm ci

# 5. Expose port
EXPOSE 3000

# 6. Run command
CMD ["npm", "start"]
```

### Key Commands

#### FROM
```dockerfile
# Latest Node (not recommended)
FROM node:latest

# Specific version with Alpine (recommended - smaller)
FROM node:18-alpine

# Multi-stage build
FROM node:18 AS builder
...
FROM node:18-alpine
COPY --from=builder ...
```

#### WORKDIR
```dockerfile
# Sets working directory inside container
WORKDIR /app

# All commands run from /app
COPY package.json .     # Goes to /app/package.json
RUN npm install         # Runs in /app
```

#### COPY vs ADD
```dockerfile
# COPY - safer, recommended
COPY . .                # Copy from host to container

# ADD - can also extract archives (less common)
ADD app.tar.gz .        # Extract tar file
```

#### RUN vs CMD vs ENTRYPOINT
```dockerfile
# RUN - execute during build
RUN npm install         # Runs when building image

# CMD - default command when container starts
CMD ["npm", "start"]    # Runs when container runs
# Can be overridden: docker run myapp npm run dev

# ENTRYPOINT - can't be overridden
ENTRYPOINT ["node", "app.js"]
# docker run myapp arg1 arg2  →  node app.js arg1 arg2
```

#### EXPOSE
```dockerfile
# Documents which ports app uses (doesn't actually expose)
EXPOSE 3000 4000

# Must still use -p flag: docker run -p 3000:3000 myapp
```

#### ENV
```dockerfile
# Set environment variables
ENV NODE_ENV production
ENV PORT 3000

# Can be overridden: docker run -e NODE_ENV=development
```

### Layers & Caching

```dockerfile
# GOOD - efficient caching
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./        # Layer 1 - only changes if package.json changes
RUN npm ci                   # Layer 2 - skipped if layer 1 unchanged
COPY . .                     # Layer 3 - code changes often
CMD ["npm", "start"]

# BAD - invalidates cache every time
FROM node:18-alpine
WORKDIR /app
COPY . .                     # Any file change invalidates cache
RUN npm install
RUN npm build
```

### Build Context & .dockerignore

```dockerfile
# Dockerfile builds relative to current directory
docker build -f backend/Dockerfile .

# .dockerignore - files NOT copied into image
node_modules/
.git/
.env
__pycache__/
*.log
```

**Benefit:** Keeps image size small (don't include dev dependencies, git history, etc.)

---

## Docker Compose

### YAML Structure
```yaml
version: '3.8'          # Docker Compose file format

services:               # Define containers
  backend:
    build: .            # Build from Dockerfile
    ports:
      - "4000:4000"     # host_port:container_port
    environment:        # Environment variables
      NODE_ENV: prod
      PORT: 4000
    depends_on:         # Start order
      - database
    networks:           # Custom network
      - mynet
    volumes:            # Bind mounts
      - .:/app          # host_path:container_path

networks:               # Define networks
  mynet:
    driver: bridge
```

### Port Mapping
```yaml
# Short syntax
ports:
  - "3000:3000"        # host:container

# Long syntax
ports:
  - target: 3000       # Inside container
    published: 3000    # On host machine
    protocol: tcp
```

### Environment Variables
```yaml
environment:
  NODE_ENV: production
  JWT_SECRET: my-secret

# Or from file
env_file:
  - .env
```

### Volumes

```yaml
volumes:
  - /host/path:/container/path     # Bind mount (specific directory)
  - named_volume:/container/path   # Named volume (managed by Docker)
  - /container/only                # Anonymous volume (docker manages)

volumes:  # Define named volumes
  named_volume:
```

**Use cases:**
- Development: Bind mount for hot-reload (code changes reflect immediately)
- Production: Named volumes for data persistence

### Networking

```yaml
# Services on same network can communicate by service name
services:
  backend:
    networks:
      - mynet
  frontend:
    networks:
      - mynet
    # Can access backend as: http://backend:4000
```

### Common Commands
```bash
docker-compose up                   # Start services
docker-compose up -d                # Start in background (detached)
docker-compose down                 # Stop and remove containers
docker-compose logs                 # View all logs
docker-compose logs -f backend      # Follow logs for backend service
docker-compose ps                   # List running services
docker-compose exec backend bash    # Execute command in service
docker-compose restart backend      # Restart a service
```

---

## Environment Management

### .env Files

#### .env (git-ignored, for local development)
```
NODE_ENV=development
JWT_SECRET=dev-secret-123
CORS_ORIGIN=http://localhost:3000
DATABASE_URL=postgres://localhost/devdb
```

#### .env.example (checked into git)
```
NODE_ENV=development
JWT_SECRET=<set-your-secret>
CORS_ORIGIN=http://localhost:3000
DATABASE_URL=postgres://localhost/devdb
```

#### .env.docker (for docker-compose)
```
NODE_ENV=development
JWT_SECRET=docker-secret-123
CORS_ORIGIN=http://frontend:3000
DATABASE_URL=postgres://db:5432/appdb
```

### Loading in Application

#### Node.js
```javascript
require('dotenv').config();

const port = process.env.PORT || 3000;
const nodeEnv = process.env.NODE_ENV || 'development';
```

#### Docker Compose
```yaml
services:
  backend:
    env_file: .env.docker
    # or
    environment:
      - NODE_ENV=development
      - PORT=4000
```

---

## Common Patterns

### Multi-stage Build (Smaller Production Images)
```dockerfile
# Stage 1: Builder
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Runtime (much smaller!)
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm ci --only=production
EXPOSE 3000
CMD ["node", "dist/index.js"]

# Result: Only dist/ and production dependencies in final image
```

### Development vs Production
```yaml
# docker-compose.yml (development)
services:
  app:
    build: .
    volumes:
      - .:/app              # Code hot-reload
    command: npm run dev    # Watch mode

# docker-compose.prod.yml (production)
services:
  app:
    build: .
    # No volumes - immutable
    command: npm start      # Normal start
    restart: always         # Auto-restart on crash
```

### Database Initialization
```yaml
services:
  backend:
    depends_on:
      - database          # Start database first
    environment:
      DATABASE_URL: postgres://db:5432/app
    
  database:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: app
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Health Checks
```yaml
services:
  backend:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:4000"]
      interval: 10s
      timeout: 5s
      retries: 3
```

---

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker logs <container-id>

# Common issues:
# - Missing dependencies: npm install failed
# - Port already in use: lsof -i :3000 (Mac/Linux)
# - Wrong working directory: Check WORKDIR
# - Command failed: Check CMD syntax
```

### Port Already in Use

```bash
# Find process using port
lsof -i :3000                    # Mac/Linux
netstat -ano | findstr :3000    # Windows
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess  # PowerShell

# Kill it
kill -9 <process-id>            # Mac/Linux
taskkill /PID <process-id> /F   # Windows
```

### Services Can't Communicate

```
Error: Cannot reach backend from frontend

Fix:
1. Check VITE_API_URL (use http://backend:4000, not localhost)
2. Verify services on same network
3. Check CORS_ORIGIN includes frontend hostname
4. Try: docker-compose exec frontend curl http://backend:4000
```

### Image Too Large

```
Problem: Docker build creates 500MB+ image

Solutions:
1. Add .dockerignore to exclude node_modules, .git, etc.
2. Use Alpine base images (node:18-alpine not node:18)
3. Use multi-stage builds
4. Clean npm cache: RUN npm cache clean --force
```

### Volumes Not Working

```yaml
# WRONG (doesn't work on all systems)
volumes:
  - ./src:/app/src

# CORRECT (more compatible)
volumes:
  - .:/app          # Mount entire directory
  - /app/node_modules  # Exclude node_modules from mount
```

---

## Best Practices Checklist

- [ ] Use specific version tags, not `latest`
- [ ] Use Alpine-based images for smaller size
- [ ] Include `.dockerignore` file
- [ ] Minimize layers (group RUN commands if possible)
- [ ] Cache dependencies before copying code
- [ ] Don't run as root in production (use USER command)
- [ ] Use health checks for long-running services
- [ ] Manage secrets securely (never hardcode)
- [ ] Use meaningful image names and tags
- [ ] Document Dockerfile with comments

---

## Resources

- **Docker Official Docs:** https://docs.docker.com/
- **Docker Compose:** https://docs.docker.com/compose/compose-file/
- **Dockerfile Reference:** https://docs.docker.com/engine/reference/builder/
- **Docker Best Practices:** https://docs.docker.com/develop/develop-images/dockerfile_best-practices/
- **Node.js Docker:** https://github.com/nodejs/docker-node

