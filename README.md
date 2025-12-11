# Home Library Service

REST API for managing a home music library. Allows you to manage users, artists, albums, tracks, and favorites.

## Setup and Run with Docker

### 1. Clone repository and checkout branch

```bash
git clone https://github.com/vitali007tut/nodejs2025Q2-service.git
cd nodejs2025Q2-service
git checkout dev-part3
```

### 2. Install dependencies and setup environment

```bash
npm install
cp .env.example .env
```

### 3. Start services with Docker Compose

```bash
# Start PostgreSQL and application in Docker
docker-compose up -d postgres app-dev

# Check that containers are running
docker-compose ps

# View application logs (wait for "Application is running")
docker-compose logs -f app-dev
```

### 4. Run tests

**Important:** The application must be running before running tests!

```bash
# Run all tests
npm run test
```

### 5. Stop services

```bash
# Stop Docker containers
docker-compose down
```

## Additional Commands

### Stop all Node.js processes

```bash
# On Windows
taskkill /im node.exe /f

# On Linux/Mac
pkill -f node
```

### Stop process running on specific port

```bash
# Find process on port (example with port 4000)
# On Windows
netstat -ano | findstr :4000

# On Linux/Mac
lsof -i :4000

# Kill process by PID (after finding it with above commands)
# On Windows
taskkill //PID <PID> //F

# On Linux/Mac
kill -9 <PID>
```

## Checking Logging Functionality

To verify that the logging functionality is working properly:

1. Make sure the application is running:

```bash
docker-compose up -d postgres app-dev
docker-compose logs -f app-dev
```

2. Make requests to the API to generate logs:

```bash
# Test user endpoint
curl http://localhost:4000/user

# Create a new user
curl -X POST http://localhost:4000/user \
  -H "Content-Type: application/json" \
  -d '{"login":"testuser","password":"testpass123"}'

# Test other endpoints as needed
```

3. View the logs to confirm logging is working:

```bash
# View all application logs
docker-compose logs app-dev

# View logs in real-time
docker-compose logs -f app-dev

# Filter logs for specific endpoints
docker-compose logs app-dev | grep "/user"

# View only the most recent logs
docker-compose logs --tail=20 app-dev
```
